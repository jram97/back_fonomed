import { model, Schema, Document } from "mongoose";
import { IUser } from "./user";

export interface IMembresia extends Document {
    doctor: IUser;
    usuario: IUser;
}

const membresiaSchema = new Schema({
    doctor: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    tarjeta_id: {
      type: Schema.Types.ObjectId,
      ref: "Tarjeta",
      required: false
    },
    tarjeta: {
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
          predeterminada: {
            type: Boolean,
            default: false
          }
    },
    tipo: {
        type: String,
    }
},
    { timestamps: true }
);

export default model<IMembresia>("Membresia", membresiaSchema);