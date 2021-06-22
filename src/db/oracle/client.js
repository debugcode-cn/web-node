/**
 * 连接oracle服务器的client
*/

const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true; //默认为false,则update操作没有真正

const config = require('../../config/params.oracle.js');

const connectConfig = {
    _enableStats: true,
    user: config.user,
    password: config.password,
    connectString: config.host + '/' + config.server_name
}

let poolWebNode = null;
let poolAlias = "web-node" ;


class Oracle{
    constructor(){
    }

    async _makeConnection() {
        if(!poolWebNode){
            poolWebNode = await oracledb.createPool({
                ...connectConfig,
                poolAlias
            })
        }
        if (!this.connection) {
            this.connection = await oracledb.getPool(poolAlias).getConnection().catch((err)=>{
                console.log('makeConnection', err.message)
                return null;
            })
        }
    }
    async _close() {
        if (this.connection) {
            try {
                await this.connection.close();
            } catch (error) {
                console.log('close catch:', error.message)
            }
        }
        this.connection = null;
    }
    async _executeSql(sql) {
        if (!this.connection) {
            console.log('executeSql !connection')
            return [];
        }
        let result = await this.connection.execute(sql).catch((err) => { console.log('executeSql', err.message); return false; })
        return result.rows;
    }
    /**
     * 获取当前所有的待销假的请假申请列表
     */
    async test() {
        let list = []
        let sql = `
            SELECT
                LEAVEAPPLY.LEAVEAPPLYID,
                LEAVEAPPLY.PERSONELCODE,
                LEAVEAPPLY.PERSONELNAME,
                LEAVEAPPLY.BEGINTIME,
                LEAVEAPPLY.ENDTIME,

                LEAVEAPPLY.LEAVECAUSE_DATADICT,
                LEAVEAPPLY.PERSONELORG,
                
                UMORGANIZATION.DISPLAYNAME AS PERSONELORGDISPLAYNAME,
                
                UMUSER.UMUSERID AS AUDIT_UMUSERID,
                UMUSER.USERNAME AS AUDIT_USERNAME，
                UMUSER.UMJOBTITLEID AS UMJOBTITLEID
            FROM
                LEAVEAPPLY
                JOIN UMUSER ON LEAVEAPPLY.AUDITPERSONEL = UMUSER.UMUSERID
                JOIN UMORGANIZATION ON LEAVEAPPLY.PERSONELORG = UMORGANIZATION.ORGANIZATIONCODE 
            WHERE
                LEAVEAPPLY.AUDITSTATE_DATADICT = 1
            ORDER BY
                LEAVEAPPLY.ENDTIME ASC
                ` ;
        await this._makeConnection();
        let list = await this._executeSql(sql)
        await this._close();
        return list;
    }
}

module.exports = Oracle ;