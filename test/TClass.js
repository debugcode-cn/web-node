class Test{
    static name = 'wanglei';
    age = 27;
}

console.log('Test.name',Test.name);

let instance = new Test();
console.log(typeof instance,typeof instance.name)