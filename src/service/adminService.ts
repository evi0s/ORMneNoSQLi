import { User } from "../model/userModel"
import { Result } from "../model/resultModel"
import * as lodash from 'lodash';


interface userResult extends Result{
    data?: Object
}

interface modifyResult extends Result{
    data?: Object
}

async function queryUser(username: string): Promise<userResult> {
    let user: User;

    try {
        user = await User.findOne({
            where: {
                username: username
            }
        });
    } catch (err) {
        console.log(err);
        throw err;
    }

    if (!user) {
        return {
            message: 'No Such User!'
        }
    }

    return {
        id: user.id,
        username: user.username,
        data: user.data,
        message: 'OK'
    }
}


async function modifyProfile(username: string, data: any): Promise<modifyResult> {
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
    if (!user.data) {
        user.data = {};
    }
    lodash.defaultsDeep(user.data, data);
    console.log(data);
    console.log(user.data);

    let result: User;
    try {
        result = await user.update({
            data: user.data
        });
    } catch (err) {
        console.log(err);
        throw(err);
    }

    if (!result) {
        return {
            message: 'Modify Failed!'
        }
    }

    return {
        id: result.id,
        username: result.username,
        message: 'Profile Modified'
    }
}

export {
    queryUser, userResult,
    modifyProfile, modifyResult
}
