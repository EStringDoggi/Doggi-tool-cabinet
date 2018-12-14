const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  //return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  console.log("year:" + year)
  console.log("month:" + month)
  console.log("day:" + day)
  console.log("hour:" + hour)
  console.log("minute:" + minute)
  console.log("second:" + second)
  console.log("year + month + day + hour + minute + second:" + year + month + day + hour + minute + second)
  return year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString() + second.toString()
}

const formatDate = Ddate => {
  const Dyear = Ddate.getFullYear()
  const Dmonth = Ddate.getMonth() + 1
  const Dday = Ddate.getDate()
  var zeroM = ""
  var zeroD = ""
  if(Dmonth < 10)
  {
    zeroM = "0";
  }
  if (Dday < 10)
  {
    zeroD = '0'
  }
  return Dyear + '-' + zeroM + Dmonth + '-' + zeroD + parseInt(Dday)
  
  //return [Dyear, Dmonth, Dday].map(formatNumber).join('-') + ' '
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate
}
