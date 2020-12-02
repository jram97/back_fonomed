import { model, Schema, Document } from "mongoose";
import { IUser } from './user';

export interface IEmergencia extends Document {
  usuario: IUser;
  descripcion: string;
  foto?: string;
};

const emergenciaSchema = new Schema({

  usuario: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  descripcion: {
    type: String,
    required: true
  },
  fotos: [{
    type: String,
    default: "",
    required: false
  }]
}, { timestamps: true });


export default model<IEmergencia>("Emergencia", emergenciaSchema);
