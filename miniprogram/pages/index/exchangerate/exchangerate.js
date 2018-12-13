//index.js
//获取应用实例
const app = getApp()
var openid = app.globalData.openid
var _that = this

Page({
  data: {
    money: ['人民币', '美元','港币','澳门元',  '日元','韩元', '欧元', '英镑', '泰国铢'],
    img: ['/img/middle/cn.png', '/img/middle/us.png', '/img/middle/hk.png', '/img/middle/mc.png', '/img/middle/jp.png', '/img/middle/kr.png', '/img/middle/eu.png', '/img/middle/gb.png', '/img/middle/th.png'],
    exchangeRate: [1, 0.1456, 1.1371, 1.17, 16.5711, 163.5313,0.1262, 0.1123, 4.7117],
    result: 1,
    left: 0,
    right: 1,
    skin: app.globalData.skin,
    placeholder: 0,
    objectMoney: [
      {
        id: 0,
        name: '人民币'

      },
      {
        id: 1,
        name: '美元'
      },
      {
        id: 2,
        name: '日元'
      },
      {
        id: 3,
        name: '欧元'
      },
      {
        id: 4,
        name: '英镑'
      },
      {
        id: 5,
        name: '泰国铢'
      }
    ]
  }
  ,

  bindMoneyChange: function (e) {
    var a = e.currentTarget.dataset.a;
    var exchangeRate = this.data.exchangeRate
    var _left = this.data.left
    var _right = this.data.right
    if (a == 'left') {
      this.setData({
        left: e.detail.value,

      })
      _left = this.data.left
    } else {
      this.setData({
        right: e.detail.value,

      })
      _right = this.data.right
    }
    this.setData({
      placeholder: (exchangeRate[_right] / exchangeRate[_left]).toFixed(4)
    })

  }
  ,
  bindMoneyInput: function (e) {
    var NowNum, ResultNum = 0, rate;
    var left, right;
    left = this.data.left;
    right = this.data.right;
    NowNum = parseFloat(e.detail.value);
    rate = parseFloat(this.data.exchangeRate[right] / this.data.exchangeRate[left]);
    if (e.currentTarget.id == 'input2') {
      ResultNum = parseFloat(NowNum / rate).toFixed(4);
      if (isNaN(ResultNum)) { ResultNum = null; }
      this.setData({
        inputvalue1: ResultNum
      })
    }
    else {
      ResultNum = parseFloat(NowNum * rate).toFixed(4);
      if (isNaN(ResultNum)) { ResultNum = null; }
      this.setData({
        inputvalue2: ResultNum
      })
    }



  }



  ,
  onReady: function () {

  },

  onLoad: function () {
    var _that = this

    /*if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }*/
    //正在加载中
    wx.showLoading({
      title: '汇率更新中',
      success: function () {
        //wx.hideLoading()
      }
    })
    //汇率
    wx.cloud.callFunction({
      //云函数名
      name: 'exchangeRate',
      success: function (res) {
        console.log(res.result.Rate)
        console.log("来自云函数的汇率：" + res.result.Rate)
        //修改汇率值
        _that.setData({
          exchangeRate: res.result.Rate
        }, () => {
          var exchangeRate = _that.data.exchangeRate
          var _left = _that.data.left
          var _right = _that.data.right
          _that.setData({
            placeholder: (exchangeRate[_right] / exchangeRate[_left]).toFixed(4)
          })
          console.log(_that.data.placeholder)
        })
        console.log("exchangeRate:" + _that.data.exchangeRate)
        //显示汇率更新成功
        wx.showToast({
          title: '汇率更新成功',
          success: function () {
            //wx.hideLoading()
          }
        })
      },
      fail: function () {
        wx.showToast({
          title: '网络连接出现问题，汇率更新失败',
          icon: 'loading'
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })
    setTimeout(function () { wx.hideLoading() }, 5000)
    wx.cloud.callFunction({
      name: 'login',
      success: function (res) {
        console.log(res.result)
      }
    })
    console.log("index发生onload")


  },
  onShow: function () {
    //皮肤
    var that = this
    var exchangeRate = that.data.exchangeRate
    var left = that.data.left
    var right = that.data.right
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
          console.log("index被先执行了，读取缓存")
          that.setData({
            skin: res.data
          })
        },
      })
    }
    this.setData({
      placeholder: (exchangeRate[right] / exchangeRate[left]).toFixed(4)
    })

  },
  onHide: function () {

  },

})
