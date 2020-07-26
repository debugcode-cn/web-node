
class UserBiz{
    static async create(time_create) {
        let ctx = global.SBiz.getCtx();
        return await ctx.UserModel.findOrCreate({where: {namenick: 'User_'+time_create}, defaults: {password: '123@qq.com'}})
    }

    static async signIn(){

    }

    /**
     * 获取用户
     * @param {int} user_id 用户id
     */
    static async getUser(user_id=0){
        if(parseInt(user_id) > 0){
            let ctx = global.SBiz.getCtx();
            let user = await ctx.UserModel.findByPk(user_id);
            return user;
        }
        return null;
    }
}

module.exports = UserBiz;