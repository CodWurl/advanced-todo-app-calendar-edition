
const db = require("../db");

exports.getTasks = async (req,res)=>{
  const { page=1 } = req.query;
  const limit = 5;
  const offset = (page-1)*limit;

  const query = req.user.role === "admin"
    ? `SELECT * FROM tasks ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
    : `SELECT * FROM tasks WHERE user_id=$1 ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

  const { rows } = await db.query(query, req.user.role === "admin" ? [] : [req.user.userId]);
  res.json(rows);
};

exports.createTask = async (req,res)=>{
  const { title, description, due_date } = req.body;
  await db.query(
    "INSERT INTO tasks(title,description,due_date,user_id) VALUES($1,$2,$3,$4)",
    [title,description,due_date,req.user.userId]
  );
  res.sendStatus(201);
};

exports.updateTask = async (req,res)=>{
  const { id } = req.params;
  const { title,description,status,due_date } = req.body;
  await db.query(
    "UPDATE tasks SET title=$1, description=$2, status=$3, due_date=$4 WHERE id=$5",
    [title,description,status,due_date,id]
  );
  res.sendStatus(200);
};

exports.deleteTask = async (req,res)=>{
  await db.query("DELETE FROM tasks WHERE id=$1",[req.params.id]);
  res.sendStatus(204);
};
