import * as Router from 'koa-router'

import * as authController from '../controller/authController';


const router = new Router();


router.post('/auth/login', authController.login);
router.get('/auth/login', authController.loginPage);

router.post('/auth/register', authController.register);
router.get('/auth/register', authController.registerPage);

router.delete('/auth/logout', authController.logout);

export { router }
