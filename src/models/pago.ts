import { model, Schema, Document } from "mongoose";
import { ITarjeta } from "./tarjeta";
import { IUser } from './user';

export interface IPago extends Document {
    fecha: Date;
    doctor: IUser;
    tarjeta: ITarjeta;
    servicio: string;
    code: string;
    estado: string;
    recurrente: boolean;
};

const pagoSchema = new Schema({

    fecha: {
        type: Date,
        default: Date.now()
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    tarjeta: {
        type: Schema.Types.ObjectId,
        ref: "Tarjeta",
    },
    servicio: {
        type: String,
        required: true,
        default: ""
    },
    code: {
        type: String,
        default: ""
    },
    estado: {
        type: String,
        required: true,
        default: ""
    }

}, { timestamps: true });


export default model<IPago>("Pago", pagoSchema);
