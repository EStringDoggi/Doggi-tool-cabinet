//const cloud = require('wx-server-sdk')
// 云函数入口函数
exports.main = async (event, context) => {
  //let Rate = [1, 2, 3, 4, 666, 777.7]
  var rate = new Array()
  rate[0] = 1     //人民币
  rate[1] = 0.1455//美元
  rate[2] = 1.1370//港币
  rate[3] = 1.1711//澳门元
  rate[4] = 16.3990//日元
  rate[5] = 163.6404//韩元
  rate[6] = 0.1278//欧元
  rate[7] = 0.1143//英镑
  rate[8] = 4.7777//泰国铢
  
  return{
    
    //  ['人民币', '美元','港币','澳门元', '日元','韩元', '欧元', '英镑', '泰国铢']
    Rate:rate
    
    
  }
}