import { Router } from "express";
import {
  login,
  logout,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserShifts,
  initAdmin,
} from "../controllers/user.controller.js";

const router = Router();

// Autenticación
router.post("/login", login);
router.post("/logout", logout);

// Inicializar admin
router.post("/init-admin", initAdmin);

// CRUD de usuarios (solo admin)
router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Turnos
router.get("/:userId/shifts", getUserShifts);

export default router;
