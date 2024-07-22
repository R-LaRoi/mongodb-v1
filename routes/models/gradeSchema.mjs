import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    class_id: Number,
    learner_id: Number,
  },
  { strict: false }
);

gradeSchema.index({ class_id: 1 });

const Grade = mongoose.model("Grade", gradeSchema, "grades");

export default Grade;
