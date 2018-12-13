// pages/picture/picture.js
const fontsize = []
const app = getApp()
var utils = require('../../../utils/util.js');
const db = wx.cloud.database()
const picture = db.collection('picture')
//const openid = app.globalData.openid
var temp = ''

for (let i = 12; i <= 40; i++) {
  fontsize.push(i)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fontsize: fontsize,
    sizeindex: 8,
    textsize: 20,
    textlength: 0,
    imgurl: "/img/Emoticon1.png",
    //imgurl:'http://tmp/wxdd7989db87240996.o6zAJswpyL4GASzJJJgbHRDBroc4.XEQSMwqBemzZ04ee30a7c806bf2e435c890dedb89372.png',
    //imgurl: "/img/middle/au.png",
    //imgurl: "/img/IMG_0105.jpg",
    //imgurl:"/img/IMG_20160108_233005.jpg",
    textvalue: "",
    x: 0,
    y: 0,
    skin: app.globalData.skin,
    fontcolorrange: ['黑', '粉红', '纯红', '紫罗兰', '蓝色', '绿宝石', '金', '深橙色', '白色'],
    fontcolorhex: ['#000000', '#FF69B4', '#ff0000', '#9400D3', '#0000FF', '#00FA9A', '#FFD700', '#FF8C00', '#ffffff'],
    colorIndex: 0,
    tempfile: "",
    canvasWidth: 675,//单位rpx
    canvasHeight: 0,
    imgwidth: 0,
    imgheight: 0,
    textIsClick: false,
    //EmoPic: ['/img/Emoticon1.png', '/img/Emoticon2.png', '/img/Emoticon3.png', '/img/Emoticon4.png'],
    EmoPic:null,
    EmoIndex: 0,
    EmoButtonIsClick: false,
    EmoHeight: '0px',
    ishavePic: false,
    ClearCanvasHidden: "block",
    icon: "∨"



  },
  //图片宽高自适应
  bindimageload: function (e) {
    var that = this
    var imgwidth = e.detail.width
    var imgheight = e.detail.height

    console.log("first:imgwidth:" + imgwidth + " imgheight:" + imgheight)
    var screenWidth = app.globalData.screenWidth
    var screenHeight = app.globalData.screenHeight
    screenWidth = screenWidth * 0.9

    var ratio = imgwidth / imgheight
    if (ratio > 2) {
      wx.showToast({
        title: '宽高比超过2:1',
        image: '/img/icon/icon26.png',
        duration: 2000
      })
    }
    else if (ratio < 0.5) {
      wx.showToast({
        title: '宽高比低于1:2',
        image: '/img/icon/icon26.png',
        duration: 2000
      })
    }
    else {
      var viewwidth = 660
      var viewheight = viewwidth / ratio
      imgwidth = screenWidth
      imgheight = imgwidth / ratio
      console.log("ratio:" + ratio)
      that.setData({
        canvasHeight: viewheight,
        imgwidth: imgwidth,
        imgheight: imgheight
      })
      console.log("imgwidth:" + imgwidth + "/ imgheight:" + imgheight)
      that.canvasfunction()
    }

  }
  ,
  //点击“选择图片”
  bindEmoPicbutton: function () {
    var that = this
    var h = 0
    var _boolean = that.data.EmoButtonIsClick
    var _ClearCanvasHidden = that.data.ClearCanvasHidden
    var _icon = that.data.icon
    if (_boolean == true) {
      _boolean = false
      _icon = "∨"
    }
    else {
      _boolean = true
      _icon = "∧"
    }
    if (_boolean == true) {
      h = 'auto'
      _ClearCanvasHidden = "none"
    }
    else {
      h = '0px'
      _ClearCanvasHidden = "block"
    }

    that.setData({
      EmoButtonIsClick: _boolean,
      EmoHeight: h,
      ClearCanvasHidden: _ClearCanvasHidden,
      icon: _icon
    })
    console.log("_boolean:" + _boolean + " /h:" + h + " /EmoButtonIsClick:" + that.data.EmoButtonIsClick)
    console.log("发生了bindEmoPicbutton")
  }
  ,
  //选择表情
  bindEmoPicChoose: function (e) {
    var that = this
    //var index = e.currentTarget.dataset.index
    var src = e.currentTarget.dataset.src
    //var EmoPic = that.data.EmoPic
    that.setData({
      imgurl: src,
      ishavePic: true
    })
    console.log("发生了bindEmoPicChoose")
    console.log("imgurl:" + that.data.imgurl + "/ i:null")
    //that.canvasfunction()
    wx.showToast({
      title: '图片下载中',
      icon: 'loading'
    })
  }
  ,
  //上传图片
  bindAddEmo: function (e) {
    var that = this


    //本地选择图片
    wx.chooseImage({
      count:1,
      success: function (res) {
        var temp = res.tempFilePaths
        that.setData({
          imgurl: temp[0],
          ishavePic: true
        })
        //setTimeout(function () {
          that.canvasfunction()
        //}, 0)
      }, complete: function () {
        //wx.hideToast()
      }
    })

  },
  //新增表情至服务端
  bindInsertEmo:function(){
    var imgurl = null
    var cloudimgurl = null
    var dbimgurl = null
    //相册选取图片
    wx.chooseImage({
      count:1,
      success: function(res) {
        //提示
        wx.showToast({
          title: '图片上传中',
          icon: 'loading'
        })
        //路径
        imgurl = res.tempFilePaths[0]
        //后缀名
        cloudimgurl = imgurl.match(/\.[^.]+?$/)[0]
        console.log("===================")
        console.log("imgurl:"+imgurl)
        console.log("cloudimgurl:" + cloudimgurl)
        console.log("===================")
        //图片存储至云端
        var nowtime = utils.formatTime(new Date())
        var openid = app.globalData.openid
        console.log(nowtime)
        console.log(openid)
        wx.cloud.uploadFile({
          cloudPath: 'image/uploadEmoPic' + openid + nowtime + cloudimgurl,
          filePath:imgurl
          , success: function (res) {
            
            console.log(res)
            dbimgurl = res.fileID
            //数据库新增数据
            picture.add({
              data:{
                url: dbimgurl
              },
              success:function(res){
                wx.showToast({
                  title: '图片上传成功',
                  icon:'success'
                })
                console.log(res)
              }
            })


          }
        })
      },
    })
  }
  ,
  //view触底刷新
  scrolltolower:function(){
    wx.showToast({
      title: '触底了',
    })
  }

  ,
  //文字大小
  bindsizechange: function (e) {
    this.setData({
      sizeindex: e.detail.value


    })
    console.log("字号改变了：" + this.data.fontsize[this.data.sizeindex])
    var size = this.data.fontsize[this.data.sizeindex]
    this.setData({
      textsize: size
    })
    console.log("sizeindex：" + this.data.sizeindex)
  }
  ,
  //文字颜色
  bindcolorchange: function (e) {
    this.setData({
      colorIndex: e.detail.value
    })
    console.log("颜色改变了：" + this.data.fontcolorrange[this.data.colorIndex])
    console.log("colorIndex:" + this.data.colorIndex)
  }
  ,
  //文字输入
  textinput: function (e) {
    this.setData({
      textvalue: e.detail.value,
      textlength: parseInt(e.detail.value.length)
    })
    console.log("textvalue的值：" + this.data.textvalue + " / textlength:" + this.data.textlength)
  }
  ,
  //canvas初始化及绘制图片
  canvasfunction: function () {
    //onshow时不加文字
    var that = this
    var mycanvas = wx.createCanvasContext("canvas-pic")
    var imgwidth = that.data.imgwidth
    var imgheight = that.data.imgheight
    var imgurl = that.data.imgurl
    var getimgurl = null
    var ishavePic = that.data.ishavePic
    wx.getImageInfo({
      src: imgurl,
      success:function(res){

        getimgurl = res.path
        console.log(getimgurl)
        





    if (ishavePic == true) {
      console.log("if:imgurl:" + getimgurl)
      mycanvas.drawImage(getimgurl, 0, 0, imgwidth, imgheight)
    }
    else {
      mycanvas.setFillStyle("#000000")
      mycanvas.setFontSize("20")
      mycanvas.fillText("请选择一张图片吧~", app.globalData.screenWidth / 2 - 100, (app.globalData.screenHeight) * 0.3)
    }
    mycanvas.draw()
    console.log("发生了canvasfunction,imgurl:" + getimgurl)
    console.log("y:" + ishavePic)
    wx.hideToast()
      }
    })
  },
  //清空画布
  bindcanvasclear: function () {
    this.setData({
      ishavePic: false
    })
    this.canvasfunction()
    this.canvascleartext()
  }
  ,
  //添加文字
  canvasaddtext: function () {
    var mytext = wx.createCanvasContext("canvas-text")
    var text = this.data.textvalue
    var color = this.data.fontcolorhex[this.data.colorIndex]
    var that = this
    var textw = 0
    var texth = 0
    if (text == "") {
      wx.showToast({
        title: '文字内容为空',
        image: '/img/icon/icon26.png'
      })
    }
    mytext.setFillStyle(color)
    mytext.setFontSize(that.data.fontsize[that.data.sizeindex])
    mytext.fillText(text, 150, 150)

    mytext.draw()
    console.log("发生了canvasaddtext")
    that.setData({
      textsize: that.data.fontsize[that.data.sizeindex]
    })
    console.log("textsize:" + that.data.textsize)
  }
  ,
  //文本canvas清除
  canvascleartext: function () {
    var mytext = wx.createCanvasContext("canvas-text")
    // mytext.clearRect(0,0,200,200)
    //this.setData({
    // textvalue: ""
    // })
    mytext.fillText("", 0, 0)
    mytext.draw()
    console.log("发生了canvascleartext")
  }
  ,
  //canvas点击
  canvasmovestart: function (e) {
    var x = e.touches[0].x
    var y = e.touches[0].y
    if (y < 30) { y = 30 }
    this.setData({
      //x: e.touches[0].x,
      //y: e.touches[0].y,
      x: x,
      y: y,
      textIsClick: true
    })
    console.log("x:" + e.touches[0].x)
    console.log("y:" + e.touches[0].y)
  }
  ,
  //canvas拖拽
  canvasmoveon: function (e) {
    if (this.data.textIsClick == true) {
      console.log("moveon!")
      var x = e.touches[0].x
      var y = e.touches[0].y
      var textsize = this.data.textsize
      var textlength = this.data.textlength
      var imgwidth = this.data.imgwidth
      var imgheight = this.data.imgheight

      if (x < 0) { x = 0 }
      if (x + (textlength * textsize) > imgwidth) { x = imgwidth - (textlength * textsize) }
      if (y - (textsize) < 0) { y = textsize }
      if (y > imgheight) { y = imgheight }

      console.log("x:" + x + "  y:" + y + " textsize:" + textsize)
      //this.mytext.restore()
      var mytext = wx.createCanvasContext("canvas-text")
      var text = this.data.textvalue
      var color = this.data.fontcolorhex[this.data.colorIndex]
      mytext.setFillStyle(color)
      mytext.setFontSize(this.data.fontsize[this.data.sizeindex])
      mytext.fillText(text, x, y)
      mytext.draw()
      this.setData({
        x: x,
        y: y,
        textvalue: text
      })
    }
    else {
      console.log("没有点击，不拖拽~")
    }


  }
  ,
  //离开canvas，暂无效果
  canvasmoveout: function (e) {
    this.setData({
      textIsClick: false
    })
    /*var x = e.detail.x
    var y = e.detail.y
    console.log("moveout:x:"+ x + " y:" + y )

    this.setData({
      x:x,
      y:y
    })*/
  }
  ,
  //保存图片
  canvaspicsave: function () {
    console.log("发生了canvaspicsave")

    var text = this.data.textvalue
    var x = this.data.x
    var y = this.data.y
    var fontsize = this.data.fontsize[this.data.sizeindex]
    var img = this.data.imgurl
    var color = this.data.fontcolorhex[this.data.colorIndex]
    var mycanvas = wx.createCanvasContext("canvas-pic")
    var imgwidth = this.data.imgwidth
    var imgheight = this.data.imgheight
    wx.showToast({
      title: '图片生成中',
      duration: 1000
    })
    //console.log(this.data.textvalue)
    setTimeout(function () {
      mycanvas.drawImage(img, 0, 0, imgwidth, imgheight)
      mycanvas.setFillStyle(color)
      mycanvas.setFontSize(fontsize)
      mycanvas.fillText(text, x, y)
      mycanvas.draw()



      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: imgwidth,
        height: imgheight,
        canvasId: 'canvas-pic',
        success: function (res) {
          //var tempfile = res.tempFilePath
          console.log(res.tempFilePath)
          wx.hideToast()
          temp = res.tempFilePath
          wx.saveImageToPhotosAlbum({
            filePath: temp,
            success: function (data) {
              console.log('图片保存成功！data:' + data)
            },
            fail: function (err) {
              console.log("图片保存失败：error：" + err)
            }
          })
        }

      })
      var canvastext = wx.createCanvasContext("canvas-text")
      canvastext.fillText("", x, y)
      canvastext.draw()

    }, 1000)

    this.setData({
      tempfile: temp
    })
    /*
    wx.saveImageToPhotosAlbum({
      filePath: this.data.tempfile,
      success:function(data){
        console.log('图片保存成功！data:' + data )
      },
      fail:function(err){
        console.log("图片保存失败：error：" + err)
      }
    })
    */
    console.log("result:" + this.data.tempfile)
    //this.canvascleartext()
  }
  ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenWidth: res.windowWidth,
          screenHeight: res.windowHeight

        })
      },
    })
    console.log("screenwidth:" + that.data.screenWidth + "/screenheight:" + that.data.screenHeight)
    //数据库
    picture.get({
      success:function(res){
        console.log(res.data)
        that.setData({
          EmoPic:res.data
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
    console.log("picture发生onshow")
    this.setData({
      skin: app.globalData.skin
    })
    //canvas加载原图
    this.canvasfunction()
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