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
  citaRealizada: boolean;
  comentario: string,
  shareExp: boolean,
  cont_shareExp: any;
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
  citaRealizada: {
    type: Boolean,
    default: false
  },
  comentario: {
    type: String,
    default: ""
  },
  shareExp: {
    type: Boolean,
    default: false
  },
  cont_shareExp: {
    type: Number,
    default: 3
  },
  estadosDoc: {
    type: String,
    enum: ["Pendiente", "En Proceso", "Completado", "Fallo de conexion"],
    default: "Pendiente"
  },
  estadosCli: {
    type: String,
    enum: ["Pendiente", "En Proceso", "Completado", "Fallo de conexion"],
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
