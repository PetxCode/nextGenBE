import { Document, model, Schema } from "mongoose";

interface iQuestion {
  question: {};
  specific: {};
}
interface iQuestionData extends iQuestion, Document {}

const questionModel = new Schema<iQuestionData>(
  {
    question: {
      type: Object,
      required: true,
    },
    specific: {
      type: Object,
    },
  },
  { timestamps: true }
);

export default model<iQuestionData>("questions", questionModel);
