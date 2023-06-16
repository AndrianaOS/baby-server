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

// SEARCH NAMES
app.get("/names", (req, res) => {
  const searchName = req.query.name || "";
  //   console.log(searchName);

  let nameResults = names.filter((eachName) => {
    // console.log(eachName.name.toLowerCase());
    return eachName.name.toLowerCase().includes(searchName.toLowerCase());
  });
  //   console.log(nameResults);
  res.status(200).json(nameResults);
});

// POST NAMES
app.post("/name", (req, res) => {
  const { name, sex } = req.body;

  const newID = names.length + 20;
  //   console.log(newID);

  const newName = {
    id: newID,
    name,
    sex,
  };

  if (!newName.name || !newName.sex) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  for (let eachName of names) {
    // console.log(eachName.name);
    if (eachName.name === newName.name) {
      return res.status(400).json({ error: "Name already exists" });
    }
  }

  names.push(newName);
  res.status(200).json({ message: "New name added", newName, names });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
