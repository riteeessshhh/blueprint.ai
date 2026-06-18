# Blueprint.ai

A personalized, AI-driven learning roadmap generator. 

Blueprint takes your current skill level, target goal, and available time, and builds a hyper-customized, day-by-day learning schedule. It drops the generic tutorial paths and generates actionable, hour-by-hour tasks powered by Google's Gemini API. 

## Features

- **Dynamic Roadmap Generation:** Takes your prompt and outputs a highly structured, realistic learning path.
- **Progress Tracking:** Interactive checklists to track your daily and hourly progress.
- **User Authentication:** Save, manage, and revisit your generated roadmaps by securely logging in.
- **PDF Export:** Download your roadmaps locally as perfectly-formatted, dark-mode PDFs.
- **Premium UI:** Built with a modern "cyber-glass" aesthetic and micro-animations.

## Tech Stack

- **Frontend:** React (Vite), plain CSS (no UI libraries, all custom styling), html2pdf for exports.
- **Backend:** Node.js, Express.
- **Database:** MongoDB (Mongoose) with bcrypt for password hashing and JWT for session management.
- **AI Integration:** Google Gemini API.

## Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed on your machine. You'll also need a Gemini API key.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/riteeessshhh/blueprint.ai.git
   cd blueprint.ai
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
```

### Running the App

1. Start the backend development server:
   ```bash
   cd backend
   npm run dev
   ```

2. Open a new terminal and start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to `http://localhost:5173` in your browser.

## Contributing
Feel free to open an issue or submit a pull request if you want to help improve the project!

## License
MIT
