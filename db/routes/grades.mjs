import express from "express";
import db from "../conn.mjs";
import { ObjectId } from "mongodb";
import grades from "../routes/grades";

const router = express.Router();

app.use(grades);
router.get("/:id", async (req, res) => {
  let collection = await db.collection("gades");
  let query = { _id: new ObjectId(req.params.id) };
});

let result = await collection.findOne(query);

if (!result) {
  res.send("Not found".status(404));
} else {
  res.send(result).status(200);
}

export default router;
