import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
const app = express();

app.use(cors());
app.use(express.json());

const connection = await mysql.createConnection({
  /* host: "bujtuwkrt3getswhsi8t-mysql.services.clever-cloud.com",
  user: "uy5bvzwclj463gnm",
  password: "FPKKauQCTP3mwKY6hFvL",
  database: "bujtuwkrt3getswhsi8t",
  port: 3306, */
  host: "myawsdb.cpskmwc6eopp.eu-north-1.rds.amazonaws.com",
  user: "admin",
  database: "bujtuwkrt3getswhsi8t",
  password: "Mshi_245",
});

try {
  const [results] = await connection.query("show tables");
  console.log(results);
} catch (err) {
  console.log(err);
}

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "shhhhh", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        request.useremail = payload.useremail;
        next();
      }
    });
  }
};

app.get("/getemail", authenticateToken, (request, response) => {
  response.send({ email: request.useremail });
});

app.get("/", (req, res) => {
  res.send("hellooooo");
});

app.get("/properties", async (req, res) => {
  try {
    const [results] = await connection.query("select * from properties");
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});

app.post("/signup", async (req, res) => {
  const { useremail, password } = req.body;
  try {
    const [results] = await connection.query(
      `select * from users where useremail = '${useremail}'`
    );

    if (results.length === 0) {
      try {
        bcrypt.hash(password, 10, async function (err, hash) {
          await connection.query(
            `insert into users values ("${useremail}", "${hash}")`
          );
        });

        res.send({ resMsg: "User Created Successfully." });
      } catch (err) {
        console.log(err);
      }
    } else {
      res.send({ resMsg: "user already exists." });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const { useremail, password } = req.body;
  try {
    const [results] = await connection.query(
      `select * from users where useremail = '${useremail}'`
    );
    if (results.length === 0) {
      res.send("User doesnot exist.");
      console.log("user not exists");
    } else {
      const [results] = await connection.query(
        `select * from users where useremail = '${useremail}'`
      );
      const dbPassword = results[0].password;
      bcrypt.compare(password, dbPassword, function (err, result) {
        if (result) {
          console.log("loginSuccess");
          var token = jwt.sign({ useremail: useremail }, "shhhhh");
          res.send({ jwtToken: token, resMsg: "", loginStatus: true });
        } else {
          console.log("loginNotSuccess");
          res.send({ resMsg: "*invalid credentials", loginStatus: false });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
