import { RouterContext} from "koa-router";

async function indexPage(ctx: RouterContext): Promise<any> {
    // @ts-ignore
    let username = ctx.session.username;

    // @ts-ignore
    await ctx.render('index', {
        username: username
    });
}

export {
    indexPage
}