const router = require("express").Router();
const task = require("../../models/Task/Task");
let Task = require("../../models/Task/Task");
const jwt = require("jsonwebtoken");
const { verifyToken, verifyUser } = require('../../utills/verifyToken');

//Admin SignUp
router.route("/addPost").post(verifyUser, async (req, res) => {
    const taskName = req.body.taskName;
    const description = req.body.description;
    const estimatedTime = req.body.estimatedTime;
    const priority = req.body.priority;
    const completion = req.body.completion;
    const cookie = req.cookies.access_token;
    console.log(cookie);

    try {
        const newTask = new Task({
            taskName,
            description,
            estimatedTime,
            priority,
            completion,
            cookie
        });

        await newTask.save();

        res.status(201).json({ message: "Task Added Successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//Get all posts
router.route("/getAllTasks").get(verifyUser, (req, res) => {
    Task.find()
        .then((tasks) => {
            res.json(tasks);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
});


router.route("/getTask/:id").get(verifyUser, async (req, res) => {
    try {
        let taskID = req.params.id;

        const userIdFromCookie = req.cookies.access_token; // Assuming the cookie contains user ID
        const task = await Task.findById(taskID);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        // Check if the user associated with the cookie matches the user associated with the task
        if (task.cookie !== userIdFromCookie) {
            return res.status(403).json({ error: "Unauthorized: You do not have permission to access this task" });
        }

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



//Delete
router.route("/deleteTask/:id").delete(verifyUser, async (req, res) => {
    try {
        let taskID = req.params.id;

//  const userIdFromCookie = req.cookies.access_token; // Assuming the cookie contains user ID
        const task = await Task.findById(taskID);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        // // Check if the user associated with the cookie matches the user associated with the task
        // if (task.cookie !== userIdFromCookie) {
        //     return res.status(403).json({ error: "Unauthorized: You do not have permission to delete this task" });
        // }

        const deletedTask = await Task.findByIdAndDelete(taskID);

        if (!deletedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json({ status: "Task Deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: "Error with delete", error: err.message });
    }
});



router.route("/update/:id").put(verifyUser, async (req, res) => {
    try {
        let taskID = req.params.id;

        const {
            taskName,
            description,
            estimatedTime,
            priority,
            completion
        } = req.body;

        const userIdFromCookie = req.cookies.access_token; // Assuming the cookie contains user ID
        const task = await Task.findById(taskID);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        // Check if the user associated with the cookie matches the user associated with the task
        if (task.cookie !== userIdFromCookie) {
            return res.status(403).json({ error: "Unauthorized: You do not have permission to update this task" });
        }

        const updateTask = {
            taskName,
            description,
            estimatedTime,
            priority,
            completion
        };

        await Task.findByIdAndUpdate(taskID, updateTask);

        res.json("Task details Updated Successfully!");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.route("/getAllTasksForUser").get(verifyUser, async (req, res) => {
    try {
        // Assuming user information is stored in req.user after authentication
        const userId = req.user._id; // Adjust this based on how user information is stored
        const cookie = req.cookies.access_token;

        const tasks = await Task.find({ cookie: cookie });

        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


    
module.exports = router;