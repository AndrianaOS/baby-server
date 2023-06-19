const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const names = require("./db_config.js");

app.get("/", (req, res) => {
  res.send("Andriana's Baby name server");
});

// GET AND SEARCH NAMES
app.get("/names", (req, res) => {
  const searchName = req.query.name || "";

  let getQuery = "SELECT * FROM names";

  const searchQuery = " WHERE lower(name) LIKE $1 || '%'";

  names
    .query(getQuery + searchQuery, [searchName])
    .then((result) => {
      if (result.rowCount === 0) {
        res.status(400).json({ error: "Names does not exist in this list" });
      } else {
        console.log(result.rows);
        const allResults = result.rows.filter((eachName) => {
          return eachName.name.toLowerCase().includes(searchName.toLowerCase());
        });
        return res.json(allResults);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err.error);
    });
});

// POST NAMES
app.post("/name", (req, res) => {
  // const { name, sex } = req.body;

  const newName = req.body.name;
  const newSex = req.body.sex;

  const postNameQuery = "INSERT INTO names (name, sex) VALUES ($1, $2)";
  const getNamesQuery = "SELECT 1 FROM names WHERE name = $1";

  names
    .query(getNamesQuery, [newName])
    .then((result) => {
      if (result.rowCount > 0) {
        throw { error: "Name already exists" };
      } else if (!newName || !newSex) {
        throw { error: "Please fill in all fields" };
      } else {
        return names.query(postNameQuery, [newName, newSex]);
      }
    })
    .then((result) => {
      console.log(result.rows);
      res.status(200).json({ message: "New name added" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err.error);
    });

  // if(nameResults.rowCount > 0) {

  // } else if (!newName || !newSex) {
  //   throw {error: "Please fill in all fields"}
  // }

  // res.status(200).json({ message: "New name added" });
  // const newID = names.length + 20;
  // //   console.log(newID);

  // const newName = {
  //   id: newID,
  //   name,
  //   sex,
  // };

  // if (!newName.name || !newName.sex) {
  //   return res.status(400).json({ error: "Please fill all fields" });
  // }

  // for (let eachName of names) {
  //   // console.log(eachName.name);
  //   if (eachName.name === newName.name) {
  //     return res.status(400).json({ error: "Name already exists" });
  //   }
  // }

  // names.push(newName);
  // res.status(200).json({ message: "New name added", newName, names });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
