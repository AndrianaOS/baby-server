const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;

app.use(cors());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
