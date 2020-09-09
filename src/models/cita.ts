import { model, Schema, Document } from "mongoose";
import { IUser } from "./user";
import { IMedio } from "./medios";
import { ITarjeta } from "./tarjeta";

export interface ICita extends Document {
  doctor: IUser;
  usuario: IUser;
  dia: string;
  inicio: string;
  fin: string;
  medio: IMedio;
  cancelado: string;
  comentario: string,
  shareExp: boolean,
  estados: any;
  estado: boolean;
  fecha: Date;
  factura: string;
  receta: string;
  createdAt: Date;
  updatedAt: Date;
}

const citaSchema = new Schema({

  doctor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: false,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: false,
  },
  dia: {
    type: String
  },
  inicio: {
    type: String
  },
  fin: {
    type: String
  },
  fecha: {
    type: Date
  },
  medio: {
    type: Schema.Types.ObjectId,
    ref: "Medio",
    require: false,
  },
  cancelado: {
    type: String,
    enum: ["Pendiente", "Cancelado", "Rechazado"],
    default: "Pendiente"
  },
  comentario: {
    type: String,
    default: ""
  },
  shareExp:{
    type: Boolean,
    default:false
  },
  estados: {
    type: String,
    enum: ["Pendiente", "Recibido", "En Proceso", "Completado"],
    default: "Pendiente"
  },
  factura: {
    type: String
  },
  receta: {
    type: String
  },
  estado: {
    type: Boolean,
    default: true
  },
},
  { timestamps: true }
);

export default model<ICita>("Cita", citaSchema);
