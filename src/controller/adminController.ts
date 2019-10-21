import { RouterContext } from 'koa-router'
import {
    queryUser, userResult
} from "../service/adminService"
import { modifyProfile, modifyResult } from "../service/adminService";


async function index(ctx: RouterContext) {
    // @ts-ignore
    await ctx.render('admin')
}

async function query(ctx: RouterContext) {
    if (!ctx.request.query.username) {
        // @ts-ignore
        await ctx.render('query', {
            username: 'Admin',
            isQuery: true,
            data: '{}'
        });
        return;
    }

    let result: userResult;
    try {
        result = await queryUser(ctx.request.query.username);
    } catch (err) {
        ctx.throw(err);
    }

    console.log(result);

    if (result.message === 'OK') {
        ctx.status = 200;
        if (!result.data) {
            // @ts-ignore
            await ctx.render('query', {
                username: result.username,
                id: result.id,
                isQuery: false,
                hasRecord: true,
                data: '{}'
            });
        } else {
            // @ts-ignore
            await ctx.render('query', {
                username: result.username,
                id: result.id,
                isQuery: false,
                hasRecord: true,
                data: JSON.stringify(result.data)
            });
        }
        return;
    }

    if (result.message === 'No Such User!') {
        ctx.status = 200;
        // @ts-ignore
        await ctx.render('query', {
            username: ctx.request.query.username,
            id: 0,
            isQuery: false,
            hasRecord: false,
            data: '{}'
        });
        return;
    }

    ctx.throw(500);
}

async function modify(ctx: RouterContext) {
    if (!ctx.request.body.data) {
        ctx.throw(422);
    }

    let data: Object;
    try {
        data = JSON.parse(ctx.request.body.data);
    } catch (err) {
        ctx.throw(422);
    }
    console.log(data);

    let result: modifyResult;
    try {
        result = await modifyProfile(ctx.params['username'], data);
    } catch (err) {
        ctx.throw(err);
    }

    ctx.body = result;

    if (result.message === 'Profile Modified') {
        ctx.status = 200;
        return;
    }

    ctx.throw(500);
}

async function modifyIndex(ctx: RouterContext) {
    // @ts-ignore
    await ctx.render('manage', {
        username: 'admin',
        isQuery: true,
        data: '{}'
    });
}

async function modifyShow(ctx: RouterContext) {
    let result: userResult;
    try {
        result = await queryUser(ctx.params['username']);
    } catch (err) {
        ctx.throw(err);
    }

    console.log(result);

    if (result.message === 'OK') {
        ctx.status = 200;
        if (!result.data) {
            // @ts-ignore
            await ctx.render('manage', {
                username: result.username,
                id: result.id,
                isQuery: false,
                hasRecord: true,
                data: '{}'
            });
        } else {
            // @ts-ignore
            await ctx.render('manage', {
                username: result.username,
                id: result.id,
                isQuery: false,
                hasRecord: true,
                data: JSON.stringify(result.data)
            });
        }
        return;
    }

    if (result.message === 'No Such User!') {
        ctx.status = 200;
        // @ts-ignore
        await ctx.render('manage', {
            username: ctx.params['username'],
            id: 0,
            isQuery: false,
            hasRecord: false,
            data: '{}'
        });
        return;
    }

    ctx.throw(500);
}

export {
    query, index, modify, modifyIndex, modifyShow
}
