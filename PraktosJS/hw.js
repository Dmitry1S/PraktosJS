const express = require("express");
const http = require("http");
const cors = require("cors");
const { initDB } = require("./db");
const Todo = require("./db/models/ToDo.models");
const ToDo = require("./db/models/ToDo.models");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    console.log("URL = " + req.url);
    console.log("Original_URL = ", req.originalUrl);
    console.log("METHOD = ", req.method);
    console.log("HOST = ", req.headers.host);
    console.log("IsSecure = ", req.secure);
    console.log("BODY", req.body);
    console.log("QUERY", req.query);

    next();
});

app.all("/test", (req, res) => {
    res.status(200).json({ message: "KKKKKK" });
});

http.createServer(app).listen(3100, () => {
    console.log("Server is working on port 3100");
});

initDB();

// ----- Request To All ----- \\

app.get("/api/todos", async (req, res) => {
    try {
        const gA = await Todo.findAll();
        res.json(gA);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/todos", async (req, res) => {
    try {
        const pA = await Todo.create({
            title: req.body.title,
            description: req.body.description
        });
        res.json(pA);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/api/todos", async (req, res) => {
    try{
        const dA = await ToDo.destroy({
            where: {}
        })
        res.json(dA)
    }catch (error){
        res.status(500).json({error: error.message})
    }
})

// ----- Id Request ----- \\

app.get("/api/todos/:id", async (req, res) => {
    try {
        const gI = await Todo.findByPk(req.params.id);
        if (gI === null) {
            res.status(404).json({
                message: "not found",
            });
        } else {
            res.json(gI);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/api/todos/:id", async (req, res) => {
    try {
        const dI = await ToDo.findByPk(req.params.id);
        if (dI === null) {
            res.status(404).json({ message: "not found" });
        } else {
            await ToDo.destroy({
                where: { id: req.params.id },
            });
        }
        res.json(dI);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch("/api/todos/:id", async (req, res) => {
    try {
        const pI = await ToDo.findByPk(req.params.id);
        if (pI == null) {
            res.status(404).json({ message: "not found" });
            } else {

            await pI.update({
            title: req.body.title,
            description: req.body.description,
            isCompleted: req.body.isCompleted,
        }); }
       res.json({pI});
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});