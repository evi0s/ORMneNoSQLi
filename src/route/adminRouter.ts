import * as Router from 'koa-router'
import { Auth } from "../middleware"
import * as adminController from "../controller/adminController";

const router = new Router();

let AuthMiddleware = new Auth();

router.get('/admin', AuthMiddleware.adminAuth, adminController.index);
router.get('/admin/query', AuthMiddleware.adminAuth, adminController.query);
router.get('/admin/manage', AuthMiddleware.adminAuth, adminController.modifyIndex);
router.get('/admin/manage/:username', AuthMiddleware.adminAuth, adminController.modifyShow);
router.patch('/admin/manage/:username', AuthMiddleware.adminAuth, adminController.modify);

export { router }
