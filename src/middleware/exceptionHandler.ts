import { Context } from "koa"

import { environ } from '../config'

async function exceptionHandler(ctx: Context, next: Function) {
    try {
        await next();
    } catch (err) {
        const status = err.status || 500;
        const error = status === 500 && environ === 'production'
            ? 'Internal Server Error'
            : err.message;

        await ctx.render('error', {
            errorCode: status,
            errorMessage: error
        });
        ctx.status = status;
        return;
    }
}

export { exceptionHandler }
