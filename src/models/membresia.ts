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
    tarjeta: {
        type: Schema.Types.ObjectId,
        ref: "Tarjeta"
    }
},
    { timestamps: true }
);

export default model<IMembresia>("Membresia", membresiaSchema);