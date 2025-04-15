import jwt from "jsonwebtoken";

export const guestMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    // Si hay token válido, redirigir al dashboard correspondiente
    return res.redirect(
      decoded.role === "admin" ? "/admin/dashboard" : "/client/dashboard"
    );
  } catch (error) {
    // Si el token es inválido, continuar como invitado
    next();
  }
};