// pages/daycount.jsdaycount/daycount.js
var utils = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datestart: '2018-09-11',
    dateend: '1900-01-01',
    test: "666",
    result: 0,
    skin: app.globalData.skin

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nowdate = utils.formatDate(new Date());
    console.log(nowdate)
    //var nowdate2 = utils.formatTime(new Date());
    //console.log(nowdate2)
    // var nowdate = nowdatetime.toLocaleDateString();
    this.setData({
      dateend: nowdate
    })
    var day = new Date();
    var start = new Date(this.data.datestart);
    var end = new Date(this.data.dateend);
    //start = start.getDate();
    //end = getDate(this.data.dateend);
    day = (Math.abs(end - start)) / 1000 / 60 / 60 / 24;
    this.setData({
      //result:day
      result: day
    })
    //皮肤
    //app.getSkin()
    console.log("daycount-onload")

  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.getSkin()
    console.log("daycount发生onshow")
    this.setData({
      skin: app.globalData.skin
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    /*app.getSkin()
    this.setData({
      skin: app.globalData.skin
    })
    console.log("daycount发生onhide")*/
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  binddatechange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (e.currentTarget.dataset.a == "startdate") {

      this.setData({
        datestart: e.detail.value
      })
    }
    else {
      this.setData({
        dateend: e.detail.value
      })
    }
    var day = new Date();
    var start = new Date(this.data.datestart);
    var end = new Date(this.data.dateend);
    //start = start.getDate();
    //end = getDate(this.data.dateend);
    day = (Math.abs(end - start)) / 1000 / 60 / 60 / 24;
    this.setData({
      //result:day
      result: day
    })

  }
})