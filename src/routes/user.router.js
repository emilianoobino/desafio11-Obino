import express from 'express';
const router = express.Router();
import passport from 'passport';
import UserController from '../controllers/user.controller.js';
import authMiddleware from "../middleware/authmiddleware.js";
import CustomError from "../services/errores/custom-error.js";
import generarInfoError from "../services/errores/info.js";
import { EErrors } from "../services/errores/enums.js";
import { isAdmin, isUser } from "../middleware/authorization.js";

const userController = new UserController();
const arrayProductos = [];

// Registro de usuarios
router.post('/register', passport.authenticate('register', { 
    successRedirect: '/api/users/profile',
    failureRedirect: '/register',
    failureFlash: true 
}));

// Inicio de sesión de usuarios
router.post('/login', passport.authenticate('login', { 
    successRedirect: '/api/users/profile',
    failureRedirect: '/login',
    failureFlash: true 
}));

// Perfil de usuario autenticado
router.get('/profile', passport.authenticate("jwt", { session: false }), userController.profile);

// Cerrar sesión de usuario
router.post('/logout', userController.logout.bind(userController));

// Administrador
router.get('/admin', passport.authenticate("jwt", { session: false }), userController.admin);

// Ruta para solicitar restablecimiento de contraseña
router.post("/requestPasswordReset", userController.requestPasswordReset);

// Ruta para restablecer la contraseña
router.post('/reset-password', userController.resetPassword);

// Ruta para cambiar el rol a premium
router.put("/premium/:uid", userController.cambiarRolPremium);

// Ruta para crear un producto genérico
router.post("/", async (req, res, next) => { 
    const { producto, carrito, stock, ticket } = req.body;

    try {
        if (!producto || !carrito || !stock || !ticket) {
            throw CustomError.crearError({
                nombre: "Producto Error",
                causa: generarInfoError({ producto, carrito, stock, ticket }),
                mensaje: "Error al intentar crear producto",
                codigo: EErrors.INVALID_PRODUCT_DATA.code
            });
        }

        const nuevoProducto = { producto, carrito, stock, ticket };
        arrayProductos.push(nuevoProducto);
        console.log(arrayProductos);
        res.send({ status: "success", payload: nuevoProducto });
    } catch (error) {
        next(error);
    }
});

// Ruta para crear un producto (solo administrador)
router.post('/products', isAdmin, (req, res) => {
    // Lógica para crear un producto
    res.send('Producto creado');
});

// Ruta para actualizar un producto (solo administrador)
router.put('/products/:id', isAdmin, (req, res) => {
    // Lógica para actualizar un producto
    res.send('Producto actualizado');
});

// Ruta para eliminar un producto (solo administrador)
router.delete('/products/:id', isAdmin, (req, res) => {
    // Lógica para eliminar un producto
    res.send('Producto eliminado');
});

// Ruta para agregar un producto al carrito (solo usuario)
router.post('/carts', isUser, (req, res) => {
    // Lógica para agregar un producto al carrito
    res.send('Producto agregado al carrito');
});

export default router;


