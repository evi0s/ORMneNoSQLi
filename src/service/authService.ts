import { User } from "../model/userModel"


interface loginResult {
    id?: number,
    username?: string,
    message: string
}

interface registerResult {
    id?: number,
    username?: string,
    message: string
}

async function login(username: string, password: string): Promise<loginResult> {

    let result: Array<User>;
    try {
        result = await User.findAll({
            where: {
                username: username,
                password: password
            }
        });
    } catch (err) {
        console.log(err);
        throw err;
    }

    console.log(result);

    if (result.length !== 1) {
        return {
            message: 'Login Failed!'
        };
    }

    return {
        id: result[0].id,
        username: result[0].username,
        message: "Login Success!"
    };

}

async function register(username: string, password: string, repeatPassword: string): Promise<registerResult> {
    if (password !== repeatPassword) {
        return {
            message: "Password Not Same!"
        }
    }

    let findResult: Array<User>;
    try {
        findResult = await User.findAll({
            where: {
                username: username
            }
        });
    } catch (err) {
        console.log(err);
        throw err;
    }

    if (findResult.length > 0) {
        return {
            message: "Username Existed!"
        }
    }

    let insertResult: User;
    try {
        insertResult = await User.create({
            username: username,
            password: password
        });
    } catch (err) {
        console.log(err);
        throw err;
    }

    return {
        id: insertResult.id,
        username: insertResult.username,
        message: "Register Success!"
    };
}

export { login, loginResult, register, registerResult }
