// pages/option/userUploadPic/userUploadPic.js
const db = wx.cloud.database()
const picture = db.collection('picture')
const app = getApp()
//const openid = app.globalData.openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skin: app.globalData.skin,
    //上传的图片数
    PicNum:0,
    //图片数组
    PicUrl:null,
    //行显示数组
    PicLineView:[],
    //已取次数
    db_temp:1,
    //是否正在刷新
    isInRefresh:false,
    nothing: 'block'


  },
  bindDelBtn:function(e){
    var that = this
    wx.showModal({
      title: '删除图片',
      content: '是否确认删除图片？',
      success:function(res){
        if(res.confirm){
          var id = e.currentTarget.dataset.item
          var index = e.currentTarget.dataset.index
          var PicUrl = that.data.PicUrl
          var fileUrl = e.currentTarget.dataset.url
          //删除一条数据
          picture.doc(id).remove({
            success:function(res){
              PicUrl.splice(index,1)
              wx.showToast({
                title: '已删除图片',
              })
              that.setData({
                PicUrl: PicUrl
              })
            }
          })
          //清除文件
          wx.cloud.deleteFile({
            fileList:[fileUrl],
            success:function(res){
              console.log('已删除文件:'+fileUrl+' / '+res.fileList)
            }
          })
        }
      }
    })
    

  }
  ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var openid = app.globalData.openid
    var nothing = 'block'
    picture.where({
      _openid: openid
    }).limit(20).get({
      success:function(res){
        if(res.data.length > 0){
          nothing = 'none'
        }
        console.log(res.data)
        that.setData({
          PicUrl:res.data,
          PicNum: res.data.length,
          nothing: nothing
        },()=>{
        })
      }
    })

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
    var that = this
    var db_temp = that.data.db_temp
    var PicUrl = that.data.PicUrl
    var openid = app.globalData.openid
    var isInRefresh = that.data.isInRefresh
    if (!isInRefresh){
      that.setData({
        isInRefresh:true
      })

    

    wx.showToast({
      title: '加载更多',
      icon:'loading'
    })

    picture.where({
      _openid: openid
      }).skip(db_temp * 20).limit(20).get({
      success:function(res){
        if(res.data.length<=0){
          wx.showToast({
            title: '没有更多数据了',
          })
          console.log(res)
          that.setData({
            isInRefresh: false
          })
        }
        else{
          for(let i=0;i<res.data.length;i++){
            PicUrl.push(res.data[i])
          }
          console.log(res)
          console.log(PicUrl)
          that.setData({
            PicUrl: PicUrl,
            db_temp: db_temp + 1,
            isInRefresh: false
          })
        }
        
      },
      fail:function(res){
        wx.showToast({
          title: '糟糕！数据获取失败，请重试',
          image: '/img/icon/icon26.png'
        })
        that.setData({
          isInRefresh: false
        })
      }
    })
    //ifrefresh
    }
    else{
      wx.showToast({
        title: '正在刷新中...zzZ',
        icon:'loading'
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})