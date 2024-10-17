import { Document, model, Schema } from "mongoose";

interface iGallary {
  image: string;
  imageID: string;
  title: string;
}

interface iGallaryData extends iGallary, Document {}

const gallaryModel = new Schema(
  {
    image: {
      type: String,
    },
    imageID: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model<iGallaryData>("gallaries", gallaryModel);
