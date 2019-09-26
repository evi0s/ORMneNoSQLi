import { RouterContext} from "koa-router";

async function indexPage(ctx: RouterContext): Promise<any> {
    let username = ctx.session.username;

    await ctx.render('index', {
        username: username
    });
}

export {
    indexPage
}