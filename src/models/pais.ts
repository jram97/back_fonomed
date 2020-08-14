import { model, Schema, Document } from "mongoose";

export interface IPais extends Document {
  codigo: string;
  iso: string;
  nombre: string;
}

const paisSchema = new Schema({

  codigo: {
    type: String,
    required: true
  },
  iso: {
    type: String
  },
  nombre: {
    type: String,
    require: true
  }

}, { timestamps: true }
);

export default model<IPais>("Pais", paisSchema);
