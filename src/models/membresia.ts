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
    tipo: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true }
);

export default model<IMembresia>("Membresia", membresiaSchema);
