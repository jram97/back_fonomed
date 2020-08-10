import { model, Schema, Document } from "mongoose";

export interface ICode extends Document {
  code: string;
  correlativo: number;
}

const codeSchema = new Schema(
  {
    code: {
      type: String,
      default: ""
    },
    correlativo: {
        type: Number,
        default: 0
    }
  },
  { timestamps: true }
);

export default model<ICode>("Code", codeSchema);