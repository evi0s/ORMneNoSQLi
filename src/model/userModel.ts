import { Model, INTEGER, STRING, JSON } from "sequelize"

import { sequelize } from "../store";

class User extends Model {
    id: number;
    username: string;
    data: any;
}

User.init({
    id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: STRING,
    password: STRING,
    data: JSON
}, { sequelize });

(async () => {
    // await sequelize.drop();
    await sequelize.sync();
})();

export { User }
