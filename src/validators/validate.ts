import { Response } from "express";
import bycrypt from "bcrypt";
import { roles } from "../utils/utils";
import { UserCredentials } from "../interfaces/UserCredentials";
import { User } from "../models/user";

export function handleValidateRole(role: string, res: Response) {
  if (!roles.map((r) => r.name).includes(role)) {
    return res.status(400).json({ message: "Rol inválido" });
  }
}

export async function handleValidateUniqueUser(
  credentials: UserCredentials,
  res: Response
) {
  if (
    await User.findOne({
      $or: [{ email: credentials.email }, { username: credentials.username }],
    })
  ) {
    return res.status(400).json({ message: "El usuario ya existe" });
  }
}

export function handleValidateEmail(email: string, res: Response) {
  if (!/^\w+([.-]?\w+)*@(gmail|hotmail|outlook)\.com$/.test(email))
    return res.status(400).json({
      message: "El correo electrónico debe ser de gmail, hotmail o outlook",
    });
}

export function handleValidatePassword(password: string, res: Response) {
  if (password.length < 6) {
    return res.status(400).json({
      message: "La contraseña debe tener al menos 6 caracteres",
    });
  }
  if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(password)) {
    return res.status(400).json({
      message:
        "La contraseña debe tener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial",
    });
  }
}
export function handleValidationErrors(error: any, res: Response) {
  const keyError = error.message.split(":");
  return res.status(400).json({
    atributeError: keyError[1].trim(),
    message: keyError[2].trim().split(",")[0],
  });
}

export async function checkPassword(
  password: string,
  res: Response,
  user: any
) {
  const matchPassword = await bycrypt.compare(password, user.password);
  if (!matchPassword)
    return res.status(401).json({ message: "Contraseña inválida" });
}

export const validateCardData = (cardData: any) => {
  const { cardType, frontSide, backSide } = cardData;

  if (cardType === "txtImg") {
    if (!frontSide?.text || frontSide.text.length !== 1) {
      throw new Error(
        "Para el tipo 'Texto e Imagen', el frente debe tener un texto."
      );
    }
    if (!backSide?.images || backSide.images.length !== 1) {
      throw new Error(
        "Para el tipo 'Texto e Imagen', el reverso debe tener una imagen."
      );
    }
  } else if (cardType === "txtTxt") {
    if (!frontSide?.text || frontSide.text.length !== 1) {
      throw new Error(
        "Para el tipo 'Texto y Texto', el frente debe tener un texto."
      );
    }
    if (!backSide?.text || backSide.text.length !== 1) {
      throw new Error(
        "Para el tipo 'Texto y Texto', el reverso debe tener un texto."
      );
    }
  } else {
    throw new Error("Tipo de carta inválido.");
  }
};

export const handleSpecificValidationErrors = (error: any, res: Response) => {
  if (error.message) {
    return res.status(400).json({ message: error.message });
  }
  return res.status(500).json({ message: "Ocurrió un error desconocido" });
};

export const handleValidationErrorsDeckUpdate = (error: any, res: Response) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    return res.status(400).json({ message: errors });
  } else if (error.name === "CastError") {
    return res.status(400).json({ message: `ID no válido: ${error.value}` });
  } else {
    return res.status(500).json({ message: error.message });
  }
};
