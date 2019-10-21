import { RouterContext } from "koa-router"

import {
    saveResult, saveProfile,
    showResult, showProfile, searchResult, searchProfile
} from "../service/userService"


async function show(ctx:RouterContext) {

    // @ts-ignore
    if (ctx.session.username !== ctx.params['username']
        // @ts-ignore
        && ctx.session.username !== 'admin') {
        ctx.throw(401);
    }

    let result: showResult;
    try {
        result = await showProfile(ctx.params['username']);
    } catch (err) {
        ctx.throw(err);
    }
    console.log(result);

    if (result.message === 'OK') {
        ctx.status = 200;
        // @ts-ignore
        await ctx.render('profile', {
            username: ctx.params['username'],
            data: JSON.stringify(result.data),
            isNew: false
        });
        return;
    }

    if (result.message === 'Empty Content!') {
        ctx.status = 200;
        // @ts-ignore
        await ctx.render('profile', {
            username: ctx.params['username'],
            data: '{}',
            isNew: true
        });
        return;
    }

    if (result.message === 'User Not Existed!') {
        ctx.throw(404, result.message);
    }

    ctx.throw(500);
}


async function save(ctx: RouterContext) {

    // @ts-ignore
    if (ctx.session.username !== ctx.params['username']
        // @ts-ignore
        && ctx.session.username !== 'admin') {
        ctx.throw(401);
    }

    if (!ctx.request.body.data) {
        ctx.throw(422);
    }
    console.log(ctx.request.body.data);

    let result: saveResult;

    try {
        result = await saveProfile(ctx.params['username'], ctx.request.body.data);
    } catch (err) {
        ctx.throw(err);
    }

    ctx.body = result;

    if (result.message === 'Profile Saved') {
        ctx.status = 200;
        return;
    }

    ctx.throw(500);
}

async function search(ctx: RouterContext) {

    if (!ctx.request.query.key || !ctx.request.query.value) {
        // @ts-ignore
        await ctx.render('search', {
            // @ts-ignore
            username: ctx.session.username,
            isSearch: true
        });
        return;
    }

    let result: searchResult;
    try {
        // @ts-ignore
        result = await searchProfile(ctx.session.username, ctx.request.query.key, ctx.request.query.value);
    } catch (err) {
        ctx.throw(err);
    }

    console.log(result);

    if (result.message === 'OK') {
        // @ts-ignore
        await ctx.render('search', {
            // @ts-ignore
            username: ctx.session.username,
            isSearch: false,
            hasRecord: true,
            data: result.data
        });
        return;
    }

    if (result.message === 'No Such Record!') {
        ctx.status = 404;
        // @ts-ignore
        await ctx.render('search', {
            // @ts-ignore
            username: ctx.session.username,
            isSearch: false,
            hasRecord: false
        });
        return;
    }

    ctx.throw(500);
}


export { show, save, search }
