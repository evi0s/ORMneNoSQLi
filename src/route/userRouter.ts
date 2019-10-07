import * as Router from 'koa-router'

import { Auth } from "../middleware"
import * as userController from "../controller/userController";


const router = new Router();
let AuthMiddleware = new Auth();

router.get('/user/:username', AuthMiddleware.getAuth, userController.show);
router.patch('/user/:username', AuthMiddleware.getAuth, userController.save);
router.get('/search', AuthMiddleware.getAuth, userController.search);

export { router }
