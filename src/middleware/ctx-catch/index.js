
/**
 * REST API中间件
 */
module.exports = () => {
    return async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            ctx.restError('Oh~Oh~Oh!!!! Find An Error Inner Api');
        }
    };
};
