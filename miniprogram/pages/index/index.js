//index.js
//获取应用实例
const app = getApp()

var _that = this

Page({
  data: {
    skin: app.globalData.skin
   
  }
  ,
  catchtapPage:function(e){
    var that = this
    var page = e.currentTarget.dataset.page
    console.log(page)
    wx.navigateTo({
      url: page+'/'+page,
    })
  },
  onReady:function(){
    
  },
  
  onLoad: function () {

    


  },
  onShow:function(){
    var that = this
    app.getSkin()
    if (app.globalData.isgetskin != false) {
      console.log("index发生onshow")
      that.setData({
        skin: app.globalData.skin
      })
    }
    else {
      wx.getStorage({
        key: 'skin',
        success: function (res) {
          //that.data.skin = res.data
          console.log("index被先执行了，读取缓存")
          that.setData({
            skin: res.data
          })
        },
      })
    }
    that.setData({
      skin: app.globalData.skin
    })
    console.log("skin")

  },
  onHide:function(){

  },
  
})
