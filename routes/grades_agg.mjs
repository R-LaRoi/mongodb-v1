import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

/**
 * Grading Weights by Score Type:
 * - Exams: 50%
 * - Quizes: 30%
 * - Homework: 20%
 */

// Create a GET route at /grades/stats
router.get("/grades/stats", async (req, res) => {
  let stats = await db.collection("grades");

  let result = await stats
    .aggregate([
      {
        $set: {
          averageScore: {
            $avg: "$scores.score",
          },
        },
      },
      {
        $facet: {
          totalLearners: [
            {
              $count: "count",
            },
          ],
          highScorers: [
            {
              $match: {
                averageScore: {
                  $gt: 70,
                },
              },
            },
            {
              $count: "count",
            },
          ],
        },
      },
      {
        $project: {
          totalLearners: {
            $arrayElemAt: ["$totalLearners.count", 0],
          },
          highScorers: {
            $arrayElemAt: ["$highScorers.count", 0],
          },
        },
      },
      {
        $set: {
          highScorerPercentage: {
            $multiply: [
              {
                $divide: ["$highScorers", "$totalLearners"],
              },
              100,
            ],
          },
        },
      },
    ])
    .toArray();

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Create a GET route at /grades/stats/:id

router.get("/grades/stats/:id", async (req, res) => {
  let stats = await db.collection("grades");
  let result = await stats
    .aggregate([
      {
        $match: {
          class_id: ":id",
        },
      },
      {
        $project: {
          student_id: 1,
          average_score: {
            $avg: "$scores.score",
          },
        },
      },
      {
        $group: {
          _id: "$class_id",
          total_learners: {
            $sum: 1,
          },
          above_70_percent: {
            $sum: {
              $cond: [{ $gt: ["$average_score", 70] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          total_learners: 1,
          above_70_percent: 1,
          percent_above_70: {
            $multiply: [
              { $divide: ["$above_70_percent", "$total_learners"] },
              100,
            ],
          },
        },
      },
    ])
    .toArray();

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Get the weighted average of a specified learner's grades, per class
router.get("/learner/:id/avg-class", async (req, res) => {
  let collection = await db.collection("grades");

  let result = await collection
    .aggregate([
      {
        $match: { learner_id: Number(req.params.id) },
      },
      {
        $unwind: { path: "$scores" },
      },
      {
        $group: {
          _id: "$class_id",
          quiz: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "quiz"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
          exam: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "exam"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
          homework: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "homework"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          class_id: "$_id",
          avg: {
            $sum: [
              { $multiply: [{ $avg: "$exam" }, 0.5] },
              { $multiply: [{ $avg: "$quiz" }, 0.3] },
              { $multiply: [{ $avg: "$homework" }, 0.2] },
            ],
          },
        },
      },
    ])
    .toArray();

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

export default router;
