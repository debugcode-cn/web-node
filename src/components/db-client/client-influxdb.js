/**
 * 1、无模式 schemaless 
 * 2、字段类型不可变，拒绝写入类型变化了的后续数据
 
###写入###
curl -i -XPOST http://localhost:8086/query --data-urlencode "q=CREATE DATABASE mydb"
curl -i -XPOST 'http://localhost:8086/write?db=mydb' --data-binary 'cpu_load_short,host=server01,region=us-west value=0.64 1434055562000000000'
curl -i -XPOST 'http://localhost:8086/write?db=mydb' --data-binary 'cpu_load_short,host=server02 value=0.67
cpu_load_short,host=server02,region=us-west value=0.55 1422568543702900257
cpu_load_short,direction=in,host=server01,region=us-west value=2.0 1422568543702900257'
curl -i -XPOST 'http://localhost:8086/write?db=mydb' --data-binary @cpu_data.txt

###查询###
curl -G 'http://localhost:8086/query?pretty=true' --data-urlencode "db=mydb" --data-urlencode "q=SELECT \"value\" FROM \"cpu_load_short\" WHERE \"region\"='us-west'"
curl -G 'http://localhost:8086/query?pretty=true' --data-urlencode "db=mydb" --data-urlencode "q=SELECT \"value\" FROM \"cpu_load_short\" WHERE \"region\"='us-west';SELECT count(\"value\") FROM \"cpu_load_short\" WHERE \"region\"='us-west'"

流式返回数据，chunk size可改
curl -G 'http://localhost:8086/query' --data-urlencode "db=deluge" --data-urlencode "chunked=true" --data-urlencode "chunk_size=20000" --data-urlencode "q=SELECT * FROM liters"

传递认证信息的时候需要把用户名、密码传递过去，有风险吧
设置u和p参数， 例：
curl -G http://localhost:8086/query --data-urlencode "u=todd" --data-urlencode "p=influxdb4ever" --data-urlencode "q=SHOW DATABASES"

 */
const influx = require('influx');
const params = require('../../config/config.influxdb');

const InfluxClient = new influx.InfluxDB({
    host: params.host,
    port: params.port,
    username: params.username,
    password: params.password,
    database: params.database || '_internal',
});

class InfluxDB {
    constructor() {}
    query() {
        return [];
    }
    write() {
        return true;
    }
    test() {
        return true;
    }

    info() {
        return {};
    }
}
module.exports = InfluxDB;
