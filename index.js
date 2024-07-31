import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("hellooooo");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
