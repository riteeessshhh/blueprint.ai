exports.buildStrategy = (profile) => {
  return {
    approach: profile.mathStrength === "low" ? "intuitive-first" : "balanced",
    depth: profile.level === "beginner" ? "slow" : "fast",
    focus: profile.goalType === "project" ? "hands-on" : "conceptual"
  };
};
