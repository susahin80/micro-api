// @ts-nocheck
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { NODE_ENV, EXPRESS_PORT, RUNNING_IN, MONGO_URI } = require("./env_props");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
console.log("NODE_ENV: ", NODE_ENV);
console.log("EXPRESS_PORT: ", EXPRESS_PORT);
console.log("RUNNING_IN: ", RUNNING_IN);
console.log("MONGO_URI: ", MONGO_URI);

const schema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("Task", schema);

app.get("/api", async (req, res) => {
  const tasks = await User.find();
  res.send(tasks);
});

app.get("/api/test", async (req, res) => {
  res.json({message: "hello world"});
});

app.post("/api", async (req, res) => {
  const { task } = req.body;

  const result = await User.create({ task });

  res.send(result);
});

const port = parseInt(EXPRESS_PORT);

const start = async () => {
  try {
    await mongoose.connect(`mongodb://${MONGO_URI}/tasks-db`);
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
