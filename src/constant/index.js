exports.CookieSession = {
    session_name: 'session_nid',
    CookieKeys: ['ewareartrat43tw4tfrf'],
    SessionExpire: 20 * 60,
};

exports.Jwtkey = (() => {
    let dicts = ["e", "i", "u", "a", "c", "o", "w", "l", "b", "d", "g", "n", "."];
    let dict_index = [9, 0, 8, 2, 10, 4, 5, 9, 0, 12, 4, 11, 12, 6, 3, 11, 10, 7, 0, 1];
    return dict_index.map(item => {
        return dicts[item];
    }).join('');
})();