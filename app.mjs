import express from "express";
import dotenv from "dotenv";
// import cors from "cors";
// import "./loadEnvironment.mjs";
import "express-async-errors";
// import posts from "./routes/posts.mjs";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Your API");
});

app.use((err, _req, res, next) => {
  res.status(500).send("An unexpected error occured.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
