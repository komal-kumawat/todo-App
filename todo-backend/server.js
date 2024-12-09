const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Task = require("./mongoSchema");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://komalK:komal%40123@atlascluster.fukzabb.mongodb.net/todoApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

// API to fetch all tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// API to add a new task
app.post("/tasks", async (req, res) => {
    try {
        const task = new Task({ name: req.body.name, completed: false });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: "Failed to create task" });
    }
});

// API to update a task
app.put("/tasks/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedTask) {
            res.status(200).json(updatedTask);
        } else {
            res.status(404).json({ error: "Task not found" });
        }
    } catch (error) {
        res.status(400).json({ error: "Failed to update task" });
    }
});

// API to delete a task
app.delete("/tasks/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (deletedTask) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Task not found" });
        }
    } catch (error) {
        res.status(400).json({ error: "Failed to delete task" });
    }
});

const port = 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
