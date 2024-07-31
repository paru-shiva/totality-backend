import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
const app = express();

app.use(cors());

const connection = await mysql.createConnection({
  host: "bujtuwkrt3getswhsi8t-mysql.services.clever-cloud.com",
  user: "uy5bvzwclj463gnm",
  password: "FPKKauQCTP3mwKY6hFvL",
  database: "bujtuwkrt3getswhsi8t",
});

try {
  const [results] = await connection.query("show tables");
  console.log(results);
} catch (err) {
  console.log(err);
}

app.get("/", (req, res) => {
  res.send("hellooooo");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
