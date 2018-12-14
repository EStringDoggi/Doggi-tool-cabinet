// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const picture = db.collection('picture')
const MAX_LIMIT = 20
// 云函数入口函数
exports.main = async (event, context) => {
  const countResult = await db.collection('picture').count()
  const total = countResult.total
  var batchTimes = Math.ceil(total / MAX_LIMIT)
  return{
    total: total,
    batchTimes: batchTimes

  }
}