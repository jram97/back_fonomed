import { model, Schema, Document } from "mongoose";
import { IUser } from "./user";

export interface IHorario extends Document {
  dia: string;
  fecha: string;
  inicio: string;
  fin: string;
  doctor: IUser;
  estado: boolean;
}

const horarioSchema = new Schema(
  {
    fecha: {
      type: String,
      default: ""
    },
    dia: {
      type: String,
      default: ""
    },
    inicio: {
      type: String,
      default: ""
    },
    fin: {
      type: String,
      default: ""
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

export default model<IHorario>("Horario", horarioSchema);