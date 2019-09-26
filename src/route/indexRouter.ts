import * as Router from 'koa-router'

import { Auth } from "../middleware"
import * as indexController from "../controller/indexController";


const router = new Router();
let AuthMiddleware = new Auth();

router.get('/', AuthMiddleware.getAuth, indexController.indexPage);

export { router }
