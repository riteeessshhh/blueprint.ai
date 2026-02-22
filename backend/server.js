require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/agent.routes"));

app.listen(process.env.PORT, () =>
  console.log("Server running on port", process.env.PORT)
);
