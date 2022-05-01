class test {
	static getVar1() {
		if (!test.var1) {
			console.log('init var1');
			test.var1 = 1;
		}
		return test.var1;
	}
}
console.log('-----');
test.v1 = null;
console.log('+++++');

module.exports = test;
