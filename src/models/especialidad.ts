import { model, Schema, Document } from "mongoose";

export interface IEspecialidad extends Document {
  nombre: string;
  createdAt: Date;
};

const especialidadSchema = new Schema({

  nombre: {
    type: String,
    required: true
  }
}, { timestamps: true });


export default model<IEspecialidad>("Especialidad", especialidadSchema);
