//app.js
App({
  onLaunch: function () {
    var that = this
    //云函数初始化
    wx.cloud.init()
    //获取用户openID
    wx.cloud.callFunction({
      name: 'login',
      success: function (res) {
        console.log(res.result.openid)
        that.globalData.openid = res.result.openid
        console.log("globalData.openId:" + that.globalData.openid)
        //let openid = res.result
        //console.log("test:"+openid)
      }
    },()=>{
      if(that.globalData.openid = null){
        wx.showToast({
          title: '云函数返回openid出现错误',
          icon:'loading'
        })
      }
    })
    //皮肤
    this.getSkin()
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init()
    }
    
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        if (!res.authSetting['scope.writePhotosAlbum'])
        {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('图片保存授权成功')
            }
          })
        }
      }
    })
    console.log('进入app');
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log("skin:" + this.globalData.skin)
    //获取屏幕宽高
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.screenWidth = res.windowWidth,
        that.globalData.screenHeight = res.windowHeight
      },
    })
    console.log("app:screenwidth:" + that.globalData.screenWidth + "/ app:screenheight:" + that.globalData.screenHeight)
    
  },
  
  globalData: {
    userInfo: null,
    skin:"dark",
    skinSwitch:false,
    isgetskin:false,
    screenWidth: 0,
    screenHeight: 0,
    openid:null
  }
  ,
  getSkin:function(){
    var that = this

    //读取缓存
    wx.getStorage({
      key: 'skin',
      success: function(res) {
        //缓存赋予全局变量
        that.globalData.skin = res.data
        //成功取得缓存
        that.globalData.isgetskin = true
        console.log("getskin:skin:"+that.globalData.skin)
        if(that.globalData.skin == "light")
        {
          that.globalData.skinSwitch = true
        }
        else
        {
          that.globalData.skinSwitch = false
        }
      },
    })
  }


      

})