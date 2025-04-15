import express from "express";
import { login, register } from "../controllers/authController.js";
import { guestMiddleware } from "../middlewares/guestMiddleware.js";

const router = express.Router();

// Aplicar middleware a todas las rutas de autenticación
router.get("/login", guestMiddleware, (req, res) => {
  res.render("login");
});

router.post("/login", guestMiddleware, login);

router.get("/register", guestMiddleware, (req, res) => {
  res.render("register");
});

router.post("/register", guestMiddleware, register);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/account-login");
});

export default router;
