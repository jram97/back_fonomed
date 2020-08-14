import { model, Schema, Document } from "mongoose";
import { IUser } from "./user";

export interface IMedio extends Document {
  nombre: string;
  precio: number;
  doctor: IUser;
  estado: boolean;
}

const medioSchema = new Schema({

  nombre: {
    type: String
  },
  precio: {
    type: Number
  },
  doctor: {
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

export default model<IMedio>("Medio", medioSchema);
