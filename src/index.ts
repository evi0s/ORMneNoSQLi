import * as Koa from 'koa'
import * as json from 'koa-json'
import * as logger from 'koa-logger'
import * as bodyparser from 'koa-bodyparser'
import * as helmet from 'koa-helmet'
import * as session from 'koa-session'
import * as views from 'koa-views'
import * as path from 'path'


import * as config from './config'
import { exceptionHandler } from "./middleware"
import {
    indexRouter,
    adminRouter,
    authRouter,
    userRouter
} from './route'


const app = new Koa();

app.use(bodyparser());
app.use(json());
app.use(helmet());
app.use(logger());
//@ts-ignore
app.use(session(app));
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}));

app.keys = config.sesskey;

app.use(exceptionHandler);

app.use(authRouter.routes());
app.use(authRouter.allowedMethods());
app.use(indexRouter.routes());
app.use(indexRouter.allowedMethods());
app.use(adminRouter.routes());
app.use(adminRouter.allowedMethods());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.listen(config.listenport, config.listenaddr, () => {
    console.log(`Application is running on ${config.listenaddr}: ${config.listenport}`);
});
