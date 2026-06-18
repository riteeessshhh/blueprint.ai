const Task = require("../models/Task");
const UserProfile = require("../models/UserProfile");
const Goal = require("../models/Goal");
const callLLM = require("../services/llm.service");
const extractJSON = require("../utils/jsonExtractor");

/* ---------- helper: normalize plan ---------- */
function normalizePlan(plan) {
  return plan.map((item, index) => {
    let day = item.day;

    // ensure day is string
    if (typeof day === "number") {
      day = day.toString();
    }

    if (typeof day !== "string") {
      day = `${index + 1}`;
    }

    return {
      title: item.title || `Task ${index + 1}`,
      day,
      status: "pending",
      subtasks: item.subtasks || []
    };
  });
}

exports.generatePlan = async (req, res) => {
  try {
    const goalId = req.params.goalId;

    /* 1️⃣ fetch goal + profile */
    const goal = await Goal.findById(goalId);
    const profile = await UserProfile.findOne({ goalId });

    if (!goal || !profile) {
      return res.status(404).json({
        error: "Goal or user profile not found"
      });
    }

    const forceRegenerate = req.query.regenerate === "true";
    if (!forceRegenerate) {
      const existingTasks = await Task.find({ goalId });
      if (existingTasks.length > 0) {
        existingTasks.sort((a, b) => parseInt(a.day) - parseInt(b.day));
        return res.json(existingTasks);
      }
    }

    /* 2️⃣ dynamic + strict prompt */
    const totalHours = goal.days * goal.dailyHours;

    const prompt = `You are a world-class curriculum architect. Your roadmaps are legendary for being so specific that a student can follow them blindfolded and still make progress.

═══════════════════════════════════════
STUDENT PROFILE
═══════════════════════════════════════
• Topic: "${goal.title}"
• Final Goal: "${goal.finalGoal || 'General mastery'}"
• Schedule: ${goal.days} days × ${goal.dailyHours} hours/day = ${totalHours} total hours
• Skill Level: ${profile.level}
• Learning Style: ${profile.learningStyle}
• Background: "${profile.backgroundSummary || 'Complete beginner, no prior knowledge'}"
• Custom Instructions: "${goal.additionalInstructions || 'None'}"

═══════════════════════════════════════
QUALITY RULES (MANDATORY)
═══════════════════════════════════════

RULE 1 — EVERY HOUR MUST HAVE A CONCRETE DELIVERABLE
Each hour must end with the student having DONE the skill, not just read or documented it. The deliverable is the skill output itself — code that runs, a dish that's cooked, a song that's played, a problem that's solved.
• ❌ BAD: "Learn about arrays and practice using them"
• ❌ BAD: "Complete exercises on a platform like FreeCodeCamp"
• ❌ BAD: "Study X for 30 minutes, then practice for 30 minutes"
• ❌ BAD: "Create a spreadsheet listing tools" or "Make a journal entry" or "Create flashcards" (these are admin, not skill practice)
• ✅ GOOD: "Build a grocery list app in the browser console: create an array, write functions to add/remove items by name, and display the list using console.table(). Test with at least 5 items."
• ✅ GOOD: "Solve 10 'fork' puzzles on lichess.org/training (target: 7/10 correct). After each wrong answer, analyze why you missed it."
• ✅ GOOD: "Cook a classic bruschetta: dice 4 Roma tomatoes, mince 2 garlic cloves, toss with olive oil and fresh basil. Toast 8 baguette slices, rub with garlic, top with the mixture. Taste and adjust salt/acid balance."

RULE 2 — NEVER USE THESE FILLER PATTERNS
These are BANNED phrases. If you use any of them, the response is a failure:
• "Complete a set of exercises on…"
• "Practice [topic] for X hour(s)"
• "Using online platforms like…"
• "Learn about X and practice"
• "Study X, then practice X"
• "Focus on [vague concept]"
• "Reinforce understanding of…"
• "Create a spreadsheet/journal/mind map/graph to…"
• "Take notes on…" (as the primary activity)
• "Share with a partner or family member for feedback"
• "Save it as [filename]" (as the deliverable)
The student's time is precious. Maximize DOING the actual skill. Documentation should never be the main activity of any hour.

RULE 3 — PROGRESSIVE DIFFICULTY WITH CLEAR MILESTONES
• Days 1–${Math.max(1, Math.ceil(goal.days * 0.3))}: Foundation — core concepts with guided exercises
• Days ${Math.max(2, Math.ceil(goal.days * 0.3) + 1)}–${Math.max(3, Math.ceil(goal.days * 0.7))}: Application — mini-projects, real scenarios, increasing independence
• Days ${Math.max(4, Math.ceil(goal.days * 0.7) + 1)}–${goal.days}: Mastery — capstone project, simulated challenges, or real-world application tied to the Final Goal
Each day's title should reflect a SPECIFIC milestone achieved that day, not a generic topic name.

RULE 4 — RESPECT PRIOR KNOWLEDGE
If the student already knows something, skip it or bridge it in 15 minutes max. Never waste a full hour on something they already understand.

RULE 5 — NO HALLUCINATIONS
Only recommend tools, platforms, resources, and techniques that actually exist and are directly relevant to "${goal.title}". Never suggest tools from a different domain.

RULE 6 — EACH HOUR IS DIFFERENT
No two hours across the entire roadmap should feel similar. Vary the format: build something, watch+implement, solve targeted problems, teach-back exercise, timed challenge, analyze examples, create from memory, etc.

RULE 7 — START DOING FROM HOUR 1
The student should be DOING the skill by the very first hour. No spending entire days on setup, planning, or theory before touching the actual skill. If the topic is cooking, they should be cooking in Hour 1. If it's guitar, they should be playing notes in Hour 1. If it's coding, they should be writing code in Hour 1. Weave theory INTO practice, never before it.

RULE 8 — BE SPECIFIC ABOUT WHAT TO CREATE
If the final goal involves creating something (a dinner, an app, a song), name the EXACT things the student will create. Don't say "prepare a 3-course dinner" — say "Appetizer: Caprese Salad, Main: Spaghetti Carbonara, Dessert: Panna Cotta." Specificity is everything.

═══════════════════════════════════════
OUTPUT FORMAT (STRICT JSON)
═══════════════════════════════════════
Return ONLY a valid JSON array. No markdown, no explanation, no text before or after.
• Exactly ${goal.days} objects (one per day)
• Exactly ${goal.dailyHours} subtasks per day
• Each subtask has "hour" (e.g. "Hour 1") and "activity" (detailed, actionable, 2-4 sentences)

[
  {
    "title": "Specific Milestone Title (not generic)",
    "day": "1",
    "subtasks": [
      {
        "hour": "Hour 1",
        "activity": "Detailed, actionable task with a concrete deliverable. 2-4 sentences describing exactly what to do, what tool to use, and what the output should be."
      }
    ]
  }
]`;

    let plan;
    try {
      const output = await callLLM(prompt);
      plan = extractJSON(output);
    } catch (err) {
      console.error("LLM Parsing Failed. Using dynamic fallback plan.");
      // 🔁 dynamic safe fallback so it matches requested days
      const daysCount = parseInt(goal.days) || 7;
      plan = Array.from({ length: daysCount }).map((_, i) => ({
        title: `Day ${i + 1} of ${goal.title}`,
        day: `${i + 1}`,
        subtasks: [
          { hour: "Hour 1", activity: "Review core concepts" },
          { hour: "Hour 2", activity: "Practice exercises" }
        ]
      }));
    }

    /* 4️⃣ normalize shape */
    if (!Array.isArray(plan) && plan.roadmap) {
      plan = plan.roadmap;
    }

    if (!Array.isArray(plan)) {
      plan = [plan];
    }

    plan = normalizePlan(plan);

    /* 5️⃣ replace old tasks */
    await Task.deleteMany({ goalId });

    const tasks = await Task.insertMany(
      plan.map(t => ({
        goalId,
        title: t.title,
        day: t.day,
        status: t.status,
        subtasks: t.subtasks || []
      }))
    );

    res.json(tasks);

  } catch (error) {
    console.error("Planner Agent Error:", error);
    res.status(500).json({
      error: "Planning failed safely"
    });
  }
};
