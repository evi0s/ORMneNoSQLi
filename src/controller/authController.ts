import { RouterContext} from "koa-router";

import {
    login as authLogin, loginResult,
    register as authRegister, registerResult
} from "../service/authService";

async function login(ctx: RouterContext): Promise<any> {

    if (!ctx.request.body.username || !ctx.request.body.password
        || ctx.request.body.username.length > 60
        || ctx.request.body.password.length > 60) {
        ctx.throw(422);
    }

    let result: loginResult;
    try {
        result = await authLogin(ctx.request.body.username, ctx.request.body.password);
    } catch (err) {
        ctx.throw(err);
    }

    ctx.body = result;

    if (result.message === "Login Success!") {
        ctx.session.username = result.username;
        ctx.session.id = result.id;
        ctx.status = 200;
        return;
    }

    ctx.throw(401);
}

async function loginPage(ctx: RouterContext): Promise<any> {
    let action = 'Login';
    await ctx.render('passport', {
        action: action,
        isRegister: false
    });
}

async function register(ctx: RouterContext): Promise<any> {

    if (! ctx.request.body.username ||
        ! ctx.request.body.password ||
        ! ctx.request.body.repeatPassword ||
        ctx.request.body.username.length > 60 ||
        ctx.request.body.password.length > 60 ||
        ctx.request.body.repeatPassword.length > 60) {
        ctx.throw(422);
    }

    let result: registerResult;
    try {
        result = await authRegister(ctx.request.body.username,
            ctx.request.body.password,
            ctx.request.body.repeatPassword);
    } catch (err) {
        ctx.throw(err);
    }

    ctx.body = result;

    if (result.message === "Register Success!") {
        ctx.status = 201;
        return;
    }

    ctx.status = 422;
}

async function registerPage(ctx: RouterContext): Promise<any> {
    let action = 'Register';
    await ctx.render('passport', {
        action: action,
        isRegister: true
    });
}

async function logout(ctx: RouterContext): Promise<any> {
    ctx.session = null;
    ctx.status = 204;
    return;
}

export {
    login,
    loginPage,
    register,
    registerPage,
    logout
}
