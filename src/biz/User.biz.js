class UserBiz {
    static async create(time_create) {
        return await UserModel.findOrCreate({
            where: { namenick: 'User_' + time_create },
            defaults: { password: '123@qq.com' },
        });
    }

    static async signIn() {}

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
