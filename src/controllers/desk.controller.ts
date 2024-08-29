import { Request, Response } from "express";

//local imports
import { Desk } from "../models/desk";
import { handleValidationErrors } from "../validators/validate";

export const getDesks = async (req: Request, res: Response) => {
  try {
    const desks = await Desk.find();
    return res.status(200).json(desks);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDeskById = async (req: Request, res: Response) => {
  try {
    const desk = await Desk.findById(req.params.id);
    if (!desk) return res.status(404).json({ message: "Desk not found" });
    return res.status(200).json(desk);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createDesk = async (req: Request, res: Response) => {
  try {
    const desk = new Desk(req.body);
    await desk.save();
    return res.status(201).json(desk);
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const updateDesk = async (req: Request, res: Response) => {
  try {
    const desk = await Desk.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    });
    if (!desk) return res.status(404).json({ message: "Desk not found" });
    return res.status(200).json(desk);
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const deleteDesk = async (req: Request, res: Response) => {
  try {
    const desk = await Desk.findByIdAndDelete(req.params.id);
    if (!desk) return res.status(404).json({ message: "Desk not found" });
    return res.status(204).json({ message: "Desk deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
