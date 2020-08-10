import { model, Schema, Document } from "mongoose";
import { IUser } from "./user";

export interface ITarjeta extends Document {
  numero: string;
  token: string;
  pagadito: string;
  usuario: IUser;
}

const tarjetaSchema = new Schema(
  {
    numero: {
      type: String,
      required: true,
    },
    pagadito: {
      type: String,
      required: false,
      default: ""
    },
    token: {
      type: String,
      required: false,
      default: ""
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: false,
    },
  },
  { timestamps: true }
);

export default model<ITarjeta>("Tarjeta", tarjetaSchema);
