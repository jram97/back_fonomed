import { model, Schema, Document } from "mongoose";
import { IUser } from "./user";

export interface ITarjeta extends Document {
  numero: string;
  token: string;
  ultima_usada: boolean;
  pagadito: string;
  usuario: IUser;
  predeterminada: boolean;
}

const tarjetaSchema = new Schema({

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
  ultima_usada: {
    type: Boolean,
    default: false
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: false,
  },
  predeterminada: {
    type: Boolean,
    default: false
  }
},
  { timestamps: true }
);

export default model<ITarjeta>("Tarjeta", tarjetaSchema);
