'use strict';
const Router = require('koa-router');
const router = new Router();

const async = require('async');
const SMSClient = require('@alicloud/sms-sdk');

const alicloudParams = {
    accessKeyId: 'xxxxxxxxxxx',//TODO fill me
    secretAccessKey: 'xxxxxxxxxx'//TODO fill me
};

const smsSendQuene = async.queue(function (name_phone) {
    console.log(name_phone, Date.now());
    return Promise.resolve().then(async () => {
        const smsClient = new SMSClient(alicloudParams);
        const res = await smsClient.sendSMS({
            PhoneNumbers: `${name_phone.phone}`,
            SignName: 'SignNameTest1',
            TemplateCode: 'SMS_123123123',
            TemplateParam: `{"user_name":"${name_phone.name}"}`
        });
        return res;
    }).then((res) => {
        let { Code } = res;
        if (Code !== 'OK') {
            // 记录失败的日志
            console.error('短信发送失败码：' + Code);
        }
    }).catch((err) => {
        console.error('短信发送异常：' + err.message);
    });
}, 10);

// 触发发送短信接口
router.post('/sms/reminder', async (ctx, next) => {
    // 1.1、参数校验
    // TODO verify params

    // 1.2、提前响应接口请求
    ctx.json({});

    // 2.1、实际需根据用户ID查询数据库
    let name_phone_list = [{
        name: '客户A',
        phone: '17605810095'
    }, {
        name: '客户B',
        phone: '17605810090'
    }];

    // 2.2、执行任务：将待发送信息放入并发控制队列
    name_phone_list.map(item => {
        smsSendQuene.push(item);
    });
});

module.exports = router;
