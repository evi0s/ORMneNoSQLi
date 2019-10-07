import { User } from "../model/userModel"
import { Result } from "../model/resultModel"
import { Sequelize } from "sequelize"

const xss = require('xss');

interface saveResult extends Result{}
interface showResult extends Result {
    data?: Object
}
interface searchResult extends Result {
    data?: Object
}


async function showProfile(username: string): Promise<showResult> {
    let user: User;
    try {
        user = await User.findOne({
            where: {
                username: username
            }
        });
    } catch (err) {
        console.log(err);
        throw(err);
    }

    console.log(user);

    if (!user) {
        return {
            message: 'User Not Existed!'
        }
    }

    if (!user.data) {
        return {
            message: 'Empty Content!'
        }
    }

    return {
        id: user.id,
        username: user.username,
        data: user.data,
        message: 'OK'
    }
}


async function saveProfile(username: string, data: any): Promise<saveResult> {
    let user: User;
    try {
        user = await User.findOne({
            where: {
                username: username
            }
        });
    } catch (err) {
        console.log(err);
        throw(err);
    }

    for (let key in data) {
        data[key] = xss(data[key]);
    }

    console.log(user);

    let result: User;
    try {
        result = await user.update({
            data: data
        });
    } catch (err) {
        console.log(err);
        throw(err);
    }

    if (!result) {
        return {
            message: 'Save Failed!'
        }
    }

    return {
        id: result.id,
        username: result.username,
        message: 'Profile Saved'
    }

}


async function searchProfile(username: string, key: string, value: string): Promise<searchResult> {
    let user: User;
    try {
        user = await User.findOne({
            // @ts-ignore
            where: {
                username: username,
                data: Sequelize.json(`data.${key}`, value)
            },
            attributes: [ 'data' ]
        });
    } catch (err) {
        console.log(err);
        throw err;
    }

    console.log(user);

    if (!user) {
        return {
            message: 'No Such Record!'
        }
    }

    return {
        id: user.id,
        username: user.username,
        data: JSON.parse(`{"${escape(key)}": "${escape(user.data[key])}"}`),
        message: 'OK'
    }

}


export {
    saveProfile, saveResult,
    showProfile, showResult,
    searchProfile, searchResult
}
