import express from "express";
import ViewsController from "../controllers/view.controller.js";
import checkUserRole from "../middleware/checkrole.js";
import passport from "passport";

const router = express.Router();
const viewsController = new ViewsController();

// Middleware de autenticación para proteger rutas
const authMiddleware = passport.authenticate('jwt', { session: false });

// Rutas de login y register no requieren autenticación
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);

// Aplicar autenticación a todas las rutas excepto login y register
router.use(authMiddleware);

router.get("/products", checkUserRole(['usuario']), viewsController.renderProducts);
router.get("/carts/:cid", viewsController.renderCart);
router.get("/realtimeproducts", checkUserRole(['admin']), viewsController.renderRealTimeProducts); 
// solo los admins ven el stock
router.get("/chat", checkUserRole(['usuario']), viewsController.renderChat); 
// solo los users tienen acceso al chat
router.get("/", viewsController.renderHome);
router.get("/reset-password", viewsController.renderResetPassword);
router.get("/password", viewsController.renderCambioPassword);
router.get("/confirmacion-envio", viewsController.renderConfirmacion);
router.get("/panel-premium", viewsController.renderPremium);

export default router;



