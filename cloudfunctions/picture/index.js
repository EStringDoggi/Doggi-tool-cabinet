// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
//const picture = db.collection('picture')
const MAX_LIMIT = 5


// 云函数入口函数
exports.main = async (event, context) => {
  const countResult = await db.collection('picture').count()
  const total = countResult.total
  //计算分几次取
  var batchTimes = Math.ceil(total / MAX_LIMIT)
  console.log("batchTimes:" + batchTimes)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  /*
  if(event.i)
  {
    i = event.i
  }
  else{
    var i = 0
  }
  
  if(i<batchTimes)
  {
    var promise = db.collection('picture').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
    i++
  }*/
  
  for(let i = 0; i < batchTimes; i++)
  {
    const promise = db.collection('picture').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  return(await Promise.all(tasks)).reduce((acc,cur)=>{
  //return (await Promise.all(tasks)).reduce((acc, cur) => {
    //console.log("acc:"+acc.data)
    //console.log("cur:"+cur.data)
    return{
      data:acc.data.concat(cur.data),
      //data:tasks,
      batchTimes: batchTimes,
      //acc:acc.data,
      //cur:cur.data,
      //i:i
      errMsg:acc.errMsg
      
    }
  })

}