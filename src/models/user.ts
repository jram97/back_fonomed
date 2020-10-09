import { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  password: string;
  nombre_completo: string;
  foto?: string;
  genero?: any;
  cuenta_pagadito: string;
  fecha_nacimiento: string;
  telefono: string;
  documento_ui: string;
  tipo?: any;
  tarifa_g?: any;
  tarifa_m?: any;
  aprobado: Boolean;
  estado: Boolean;
  premium: any;
  pais: any;
  tarjeta: any;
  especialidades: any;
  num_votes: any,
  total_score: any,
  rating: any,
  codigo_postal: any;
  ciudad: any;
  direccion: any;
  firebaseTokens: any;
  expediente: any;
  comparePassword: (password: string) => Promise<Boolean>;
}

const userSchema = new Schema({

  nombre_completo: {
    type: String,
    required: true,
  },
  foto: {
    type: String,
    required: false,
  },
  cuenta_pagadito: {
    type: String,
    required: false,
    default: ""
  },
  premium: {
    /*recurrente: {
      type: String,
      default: "false"
    },
    fecha: {
      type: Date,
    }*/
  },
  genero: {
    type: String,
    required: false,
    default: ""
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fecha_nacimiento: {
    type: String,
    required: false,
    default: ""
  },
  telefono: {
    type: String,
    required: true,
  },
  documento_ui: {
    type: String,
    required: false,
  },
  tipo: {
    type: String,
    required: true,
  },
  tarifa_g: {
    type: Number,
    default: 0,
  },
  tarifa_m: {
    type: Number,
    default: 0,
  },
  aprobado: {
    type: Boolean,
    default: true,
  },
  pais: {
    type: Schema.Types.ObjectId,
    ref: "Pais",
    require: false,
  },
  tarjeta: {
    type: Schema.Types.ObjectId,
    ref: "Tarjeta",
    require: false,
  },
  especialidades: {
    especialidad: [
      {
        type: Schema.Types.ObjectId,
        ref: "Especialidad",
        require: false,
      },
    ],
    imagen: {
      type: Array,
    },
  },
  num_votes: {
    type: Number,
    default: 0
  },
  total_score: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  codigo_postal: {
    type: String
  },
  ciudad: {
    type: String
  },
  direccion: {
    type: String
  },
  firebaseTokens: [],
  estado: {
    type: Boolean,
    default: true,
  },
  expediente: {
    "Enfermedades Diagnosticadas": [],
    "Alérgico a": [],
    "Medicinas permanentes": [],
    "Medicinas recetadas": []
  }
},
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;

  next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<Boolean> {
  return await bcrypt.compare(password, this.password);
};

export default model<IUser>("User", userSchema);
