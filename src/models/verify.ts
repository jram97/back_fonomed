import { model, Schema, Document } from "mongoose";

export interface IVerify extends Document {
  code: string;
  email: string;
  nombre: string;
};

const verifySchema = new Schema({

  code: {
    type: String
  },
  email: {
    type: String
  },
  nombre: {
    type: String
  }

}, { timestamps: true });


export default model<IVerify>("Verify", verifySchema);
