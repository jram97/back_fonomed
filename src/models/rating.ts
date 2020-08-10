import { model, Schema, Document } from "mongoose";
import { IUser } from "./user";

export interface IRating extends Document {
  score: any;
  doctor: IUser;
  usuario: IUser;
  estado: boolean;
}

const ratingSchema = new Schema(
  {
    score: {
        type: Number,
        default: 0     
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: false,
    },
    estado: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default model<IRating>("Rating", ratingSchema);
