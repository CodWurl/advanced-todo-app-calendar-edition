
const r = require("express").Router();
const { auth } = require("../middleware/auth");
const c = require("../controllers/task.controller");

r.get("/",auth,c.getTasks);
r.post("/",auth,c.createTask);
r.put("/:id",auth,c.updateTask);
r.delete("/:id",auth,c.deleteTask);

module.exports = r;
