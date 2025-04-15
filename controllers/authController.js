import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";

export const register = async (req, res) => {
  try {
    const { nombre, correo, contrasena1, contrasena2, telefono } = req.body;
    console.log(req.body);
    let erroresBack = [];
    if (nombre.trim() === "") {
      erroresBack.push({ mensaje: "El campo nombre está vacío" });
    } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/.test(nombre)) {
      erroresBack.push({
        mensaje: "El nombre solo debe contener letras y espacios",
      });
    }

    if (correo.trim() === "") {
      erroresBack.push({ mensaje: "El campo correo está vacío" });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      erroresBack.push({ mensaje: "El correo no es válido" });
    }

    if (contrasena1.trim() === "") {
      erroresBack.push({ mensaje: "El campo contraseña está vacío" });
    } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(contrasena1)) {
      erroresBack.push({
        mensaje:
          "La contraseña debe tener al menos 6 caracteres, incluir una letra mayúscula, un número y un carácter especial",
      });
    }

    if (contrasena2.trim() === "") {
      erroresBack.push({ mensaje: "El campo confirmar contraseña está vacío" });
    } else if (contrasena1 !== contrasena2) {
      erroresBack.push({ mensaje: "Las contraseñas no coinciden" });
    }

    if (telefono.trim() === "") {
      erroresBack.push({ mensaje: "El campo teléfono está vacío" });
    } else if (!/^\d{10}$/.test(telefono)) {
      erroresBack.push({
        mensaje: "El teléfono debe ser un número válido de 10 dígitos",
      });
    }

    if (erroresBack.length) {
      return res.render("account-login", {
        title: "Account Login",
        errores: erroresBack,
        successMessage: null,
        usuario: req.user,
      });
    }
    const usuarioExistente = await User.findOne({
      where: { Correo: correo },
    });

    if (usuarioExistente) {
      return res.render("account-login", {
        title: "Account Login",
        errores: [{ mensaje: "El correo ya está registrado. Crea uno nuevo." }],
        successMessage: "",
        usuario: null,
      });
    }

    const hashedPassword = await bcrypt.hash(contrasena1, 10);
    await User.create({
      Nombre: nombre,
      Correo: correo,
      Telefono: telefono,
      Contrasena: hashedPassword,
    });
    res.render("account-login", {
      title: "Account Login",
      errores: [],
      successMessage: "Registro exitoso. ¡Bienvenido!",
      usuario: null,
    });
  } catch (error) {
    res.status(500).send("Error en registro");
  }
};

export const login = async (req, res) => {
  try {
    const { correo, contrasena1 } = req.body;
    const user = await User.findOne({ where: { correo } });

    if (!user || !(await bcrypt.compare(contrasena1, user.Contrasena))) {
      return res.render("account-login", {
        title: "Account Login",
        errores: [{ mensaje: "Correo o contraseña inválida" }],
        successMessage: "",
        usuario: null,
      });    }

    const token = jwt.sign({ id: user.Id, role: user.Rol }, "SECRET_KEY",{
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });
    res.redirect(
      user.Rol === "admin" ? "/admin/dashboard" : "/client/dashboard"
    );
  } catch (error) {
    res.status(500).send("Error en login");
  }
};
