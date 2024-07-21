import express from "express";
import dotenv from "dotenv";
import db from "./db/conn.mjs";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

import grades from "./routes/grades.mjs";
import grades_agg from "./routes/grades_agg.mjs";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Your API");
});

app.use("/grades", grades);
app.use("/grades", grades_agg);

app.use((err, _req, res, next) => {
  res.status(500).send("An unexpected error occured.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
