/**
 * 定义基本的模型操作类
 */

class SBiz{
    static setCtx(ctx) {
        SBiz.ctx = ctx;
    }
    static getCtx() {
        return SBiz.ctx ;
    }
}
module.exports = SBiz;