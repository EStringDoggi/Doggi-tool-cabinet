const app = getApp();
//需要寻求更改样式时降低延迟或预加载的方法
var pages = getCurrentPages()
var beforepage = pages[pages.length - 2]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:app.globalData.skinSwitch,
    skin:app.globalData.skin
  },
  BindswitchChange:function(e){
    var that = this;
    if(e.detail.value == true)
    {
      app.globalData.skin = "light"
      //app.setSkinLightTitle()
      
      app.globalData.skinSwitch = true
      this.setData({
        skin:"light"
      })
      
      
    }
    else
    {
      app.globalData.skin = "dark"
      //app.setSkinDarkTitle()
      app.globalData.skinSwitch = false
      this.setData({
        skin:"dark"
      })
     
    }
    that.setData({
      checked: app.globalData.skinSwitch
    })
    wx.setStorage({
      key: 'skinSwitch',
      data: app.globalData.skinSwitch
    })
    wx.setStorage({
      key: 'skin',
      data: app.globalData.skin
    })
    if (app.globalData.skin == "light") { 
      console.log("skin = light")
    }
    if(app.globalData.skin == "dark"){
      console.log("skin = dark")
    }


    
      
    

  }
  ,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      skin:app.globalData.skin,
      skinSwitch:app.globalData.skinSwitch
    })
    app.getSkin()
    console.log("stylechange发生onload")
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
    this.setData({
      skin: app.globalData.skin
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
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
    
  }
})