const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const db = require("./utils/database");
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/users", async (req, res) => {
  try {
    let data = await db.execute("SELECT * FROM users");
    res.json(data[0]);
  } catch (error) {
    res.json({
      error,
    });
  }
});

app.post("/users", async (req, res) => {
  let { name, email, age } = req.body;

  try {
    await db.execute(`INSERT INTO users(name,email,age) VALUES(?,?,?)`, [
      name,
      email,
      age,
    ]);
    res.json({ message: "Add a user success" });
  } catch (error) {
    res.json({ error });
  }
});

app.get("/users/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let data = await db.execute(`SELECT * FROM users WHERE user_id=?`, [id]);
    if (!!data[0][0]) {
      res.json(data[0][0]);
    } else {
      res.json({ message: "Can not find user" });
    }
  } catch (error) {
    res.json({ error });
  }
});

app.patch("/users/:id", async (req, res) => {
  let { id } = req.params;
  let { name, email, age } = req.body;
  try {
    let data = await db.execute(`SELECT * FROM users WHERE user_id=?`, [id]);
    if (!!data[0][0]) {
      await db.execute(
        `UPDATE users SET name = ?, email = ?, age = ? WHERE user_id = ?`,
        [
          name || data[0][0].name,
          email || data[0][0].email,
          age || data[0][0].age,
          id,
        ]
      );
      res.json({
        message: "Update success",
      });
    } else {
      res.json({ message: "Can not find user" });
    }
  } catch (error) {
    res.json({ error });
  }
});

app.delete("/users/:id", async (req, res) => {
  let { id } = req.params;
  try {
    await db.execute(`DELETE FROM users WHERE user_id = ?`, [id]);
    res.json({ message: "Delete user success" });
  } catch (error) {
    res.json({ error });
  }
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
