const crypto = require('crypto');

const UserModel = require('../model/user.mysql');

class UserBiz {
    static verifyPassword(user, password) {
        let user_password = user.getDataValue('password');
        let user_salt = user.getDataValue('salt');

        const sha256 = crypto.createHash('sha256');
        const password2verify = sha256.update(`${password}${user_salt}`).digest('hex');
        return user_password === password2verify;
    }

    static async signIn() { }

    /**
     * 获取用户
     * @param {int} user_id 用户id
     */
    static async getUser(user_id = 0) {
        if (parseInt(user_id) > 0) {
            let user = await UserModel.findByPk(user_id);
            return user;
        }
        return null;
    }
}

module.exports = UserBiz;
