/**
 * 将所有biz文件挂载到ctx中
 */
module.exports = {
	load: () => {
		let bizMap = require(`${__dirname}/../biz/index.js`);
		for (const biz_name in bizMap) {
			if (Object.hasOwnProperty.call(bizMap, biz_name)) {
				let biz = bizMap[biz_name];
				if (!global[biz_name]) {
					global[biz_name] = biz; // 老生代内存
				}
			}
		}
	},
};
