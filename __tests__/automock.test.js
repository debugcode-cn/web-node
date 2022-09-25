import utils from './utils.js';
test('if utils mocked automatically', () => {
    expect(1).toBe(1);
});


test('if utils mocked automatically 2', () => {
    expect(utils.authorize()).toBe('token');
});