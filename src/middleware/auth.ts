import { Context } from "koa"


class Auth {

    constructor() {

    }

    get getAuth() {
        return async (ctx: Context, next: Function) => {
            if (! ctx.session || ! ctx.session.username) {
                ctx.status = 302;
                ctx.redirect('/auth/login');
                return
            }
            await next();
        }
    }
}

export { Auth }
