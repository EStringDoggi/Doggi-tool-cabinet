// pages/picture/picture.js
const fontsize = []
const app = getApp()
var utils = require('../../../utils/util.js');
//数据库
const db = wx.cloud.database()
const picture = db.collection('picture')
//表情包读取条数
const MAX_LIMIT = 20
//const openid = app.globalData.openid
var temp = ''
//字号
for (let i = 20; i <= 60; i++) {
  fontsize.push(i)
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fontsize: fontsize,
    sizeindex: 8,
    textsize: 28,
    textlength: 0,
    //初始图片（填充宽高）
    imgurl: "/img/Emoticon1.png",
    //文字内容
    textvalue: "",
    //预览 坐标
    x: 0,
    y: 0,
    skin: app.globalData.skin,
    fontcolorhex: ['#000000', '#FFB6C1', '#FF69B4', '#C71585', '#ff0000', '#FF8C00', '#FFD700', '#ADFF2F', '#00FF00', '#008000', '#2E8B57', '#00CED1', '#0000FF', '#00008B', '#4B0082','#9400D3', '#ffffff'],
    fontColor: '#000000',
    colorIndex: 0,
    tempfile: "",
    //画布宽度 单位rpx
    canvasWidth: 660,
    canvasHeight: 0,
    //画布绘制图像宽高 单位px
    imgwidth: 0,
    imgheight: 0,
    //原始图像宽高 单位px
    initImgW:0,
    intImgH:0,
    textIsClick: false,
    //计算出的rpx 单位px
    _rpx:0,

    //表情包数组
    EmoPic:null,
    EmoIndex: 0,
    //无用的
    EmoButtonIsClick: false,
    //EmoHeight: '0px',
    ishavePic: false,
    ClearCanvasHidden: "block",
    icon: "∨",
    //已取次数
    count:0,
    //数据分开读取次数
    batchTimes:0,
    //页面宽高，onload时取本页宽高
    windowWidth: app.globalData.screenWidth,
    windowHeight:app.globalData.screenHeight,
    //图片view的透明度
    scrollEmoPicOpacity:1,
    //相对Top高度
    scrollEmoPicTop:"0",
    //文字view透明度
    scrollBoxTextOpacity:0,
    //文字viewTop高度
    scrollBoxTextTop:'30vh',
    //颜色viewTop
    scrollBoxColorTop:'30vh',
    //颜色view透明度
    scrollBoxColorOpacity:0,
    //选项已选择
    PicViewIsSelect:'rgb(230,230,230)',
    TextViewIsSelect:'#fff',
    ColorViewIsSelect:'#fff',
    TextIsBold_bg:'#fff',
    textBoldSelect:false,
    textBold:'normal',
    //测试
    getimgurl:null,
    //预览文字与实际文字的比例
    textRatio:1,
    //未选择图片VIEW
    EmptyViewDisable:'block',
    //文字确认按钮
    //确认按钮 display
    textConfirmBtnDisplay:'none',
    //确认按钮 top
    textConfirmBtnTop:0,
    //确认按钮 left
    textConfirmBtnLeft:0,
    //是否允许触发移动
    MoveLock:false,
    //textConfirmBtnTransition:"none"
    //正在获取图片中，阻止重复获取
    isInRefresh:false

  },
  //---------------------图片宽高自适应---------------------
  bindimageload: function (e) {
    var that = this
    var imgwidth = e.detail.width
    var initImgW = e.detail.width
    var imgheight = e.detail.height
    var initImgH = e.detail.height
    

    console.log("first:imgwidth:" + imgwidth + " imgheight:" + imgheight)
    //获取手机屏幕长宽
    var screenWidth = that.data.windowWidth
    var screenHeight = that.data.windowHeight
    console.log("screenWidth:" + screenWidth + "  screenHeight:" + screenHeight)
    
    //获取vh
    var vh = screenHeight/100
    screenWidth = screenWidth * 0.88

    //获取比例
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
      //画布宽度 rpx
      var viewwidth = 660
      //根据宽度定义画布高度 rpx
      var viewheight = viewwidth / ratio

      //绘制图片的宽高 px
      imgwidth = screenWidth
      imgheight = imgwidth / ratio

      //当画布按比例放置，高度超过60vh时，固定高度，缩放宽度
      if (imgheight > 60 * vh) {
        var _imgheight = imgheight
        //px:
        imgheight = 60*vh
        imgwidth = imgheight * ratio
        //rpx:
        var rpx_ratio = _imgheight / imgheight
        viewwidth = viewwidth / rpx_ratio
      }
      console.log("ratio:" + ratio)
      //预览宽度与实际宽度的比值作为文字大小的比值
      var textratio = initImgW/imgwidth

      that.setData({
        canvasWidth: viewwidth,
        //canvasHeight单位rpx，定义画布高度
        canvasHeight: viewheight,
        imgwidth: imgwidth,
        imgheight: imgheight,
        initImgW: initImgW,
        initImgH: initImgH,
        textRatio: textratio
      })
      //console.log("imgwidth:" + imgwidth + "/ imgheight:" + imgheight)
      //console.log("viewwidth:" + viewwidth + "/ viewheight:" + viewheight)
      that.canvasfunction()
    }
  }
  ,
  //---------------------点击‘选择图片’的事件---------------------
  bindChoosePicView:function(){
    var that = this
    var skin = that.data.skin
    if(skin == 'light'){
      var unselect = '#fff'
      var select = 'rgb(230,230,230)'
    }
    else{
      var unselect = '#3b3b3b'
      var select = '#272727'
    }
    that.setData({
      scrollEmoPicOpacity: 1,//图片
      scrollEmoPicTop: '0',//图片
      scrollBoxTextOpacity: 0,//文字
      scrollBoxTextTop: '30vh',//文字
      scrollBoxColorOpacity: 0,//颜色
      scrollBoxColorTop: '30vh',//颜色
      PicViewIsSelect: select,
      TextViewIsSelect: unselect,
      ColorViewIsSelect: unselect
    })
    console.log(unselect)
  },
  //---------------------点击‘文字’的事件---------------------
  bindChooseTextView: function () {
    var that = this
    var skin = that.data.skin
    if (skin == 'light') {
      var select = 'rgb(230,230,230)'
      var unselect = '#fff'
    }
    else {
      var unselect = '#3b3b3b'
      var select = '#272727'
    }
    that.setData({
      scrollBoxTextOpacity: 1,//文字
      scrollBoxTextTop: '0',//文字
      scrollEmoPicOpacity: 0,//图片
      scrollEmoPicTop: '30vh',//图片
      scrollBoxColorOpacity: 0,//颜色
      scrollBoxColorTop: '30vh',//颜色
      PicViewIsSelect: unselect,
      TextViewIsSelect: select,
      ColorViewIsSelect: unselect
    })
  }
  ,
  //---------------------‘文字加粗’---------------------
  bindTextBoldView: function () {
    var that = this
    var skin = that.data.skin
    var _select = that.data.textBoldSelect
    var textBold = ''
    var bgColor= ''
    if (skin == 'light') {
      var select = 'rgb(230,230,230)'
      var unselect = '#fff'
    }
    else {
      var unselect = '#3b3b3b'
      var select = '#272727'
    }
    if(_select){
      _select = false
      textBold = 'normal'
      bgColor = unselect

    }
    else{
      _select = true
      textBold = 'bold'
      bgColor = select

    }

    that.setData({
      textBold: textBold,
      textBoldSelect: _select,
      TextIsBold_bg: bgColor
    })

    that.canvasaddtext()
  }
  ,
  //---------------------点击‘颜色’的事件---------------------
  bindChooseColorView: function () {
    var that = this
    var skin = that.data.skin
    if (skin == 'light') {
      var unselect = '#fff'
      var select = 'rgb(230,230,230)'
    }
    else {
      var unselect = '#3b3b3b'
      var select = '#272727'
    }
    that.setData({
      scrollBoxColorOpacity: 1,//颜色
      scrollBoxColorTop: '0',//颜色
      scrollEmoPicOpacity: 0,//图片
      scrollEmoPicTop: '30vh',//图片
      scrollBoxTextOpacity: 0,//文字
      scrollBoxTextTop: '30vh',//文字
      PicViewIsSelect: unselect,
      TextViewIsSelect: unselect,
      ColorViewIsSelect: select
    })
  }
  ,
  //---------------------选择表情----------------------
  bindEmoPicChoose: function (e) {
    var that = this
    var src = e.currentTarget.dataset.src
    //设置图片路径
    that.setData({
      imgurl: src,
      ishavePic: true
    })
    //src驱动canvasfunction
    wx.showToast({
      title: '图片下载中',
      icon: 'loading',
      duration:5000
    })
  }
  ,
  //---------------------上传图片--------------------
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
          that.canvasfunction()
      }
    })
  },
  //---------------------新增表情至服务端--------------------
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
      }
    })
  }
  ,
  //---------------------view触底刷新---------------------
  scrolltolower:function(e){
    var that = this
    var count = that.data.count
    var Emopic = that.data.EmoPic
    let batchTimes = that.data.batchTimes
    let temp = count + 1
    var isInRefresh = that.data.isInRefresh

    if (!isInRefresh) {
      //正在获取
      that.setData({
        isInRefresh: true
      })
      //未执行云函数时
      if(batchTimes==0)
      {
        wx.cloud.callFunction({
          name: 'pictureCount',
          success: function (res) {
            console.log(res.result)
            that.setData({
              batchTimes: res.result.batchTimes
            })
            console.log("更新batchTimes:" + batchTimes)
          }
        })
      }
      //消息框
      wx.showToast({
        title: '图片加载中',
        icon:'loading',
        duration:1500
      })
      //已取的次数小于总该取次数
      if (count < batchTimes)
      {
        picture.skip(count * MAX_LIMIT).limit(MAX_LIMIT).get({
        success: function (res) {
          for (let i = 0; i < res.data.length;i++){
            Emopic.push(res.data[i])
          }
          that.setData({
            EmoPic: Emopic,
            count : temp,
            isInRefresh: false
          })
        }
      })
      }
      else{
        wx.showToast({
          title: '没有更多图片啦'
        })
        that.setData({
          isInRefresh: false
        })
      }

      that.setData({
        
      })

    }
    else{
      wx.showToast({
        title: '正在获取中...',
        icon:'loading'
      })
    }

  }
  ,
  //---------------------文字大小---------------------
  bindsizechange: function (e) {
    var size = this.data.fontsize[this.data.sizeindex]
    this.setData({
      sizeindex: e.detail.value,
      textsize: size
    })
    this.canvasaddtext()
  }
  ,
  //---------------------文字颜色---------------------
  bindcolorchange: function (e) {
    this.setData({
      fontColor: e.currentTarget.dataset.color
    })
   this.canvasaddtext()
  }
  ,
  //---------------------文字输入---------------------
  textinput: function (e) {
    this.setData({
      textvalue: e.detail.value,
      textlength: parseInt(e.detail.value.length)
    })
    console.log("textvalue的值：" + this.data.textvalue + " / textlength:" + this.data.textlength)
    console.log('e:'+e)
  }
  ,
  //---------------------canvas初始化及绘制图片---------------------
  canvasfunction: function () {
    //onshow时不加文字
    var that = this
    var mycanvas = wx.createCanvasContext("canvas-pic")
    var finalcanvas = wx.createCanvasContext('savePicCanvas')
    //预览canvas绘制宽高
    var imgwidth = that.data.imgwidth
    var imgheight = that.data.imgheight
    //最终canvas绘制宽高
    var initImgW = that.data.initImgW
    var initImgH = that.data.initImgH
    //云端url地址
    var imgurl = that.data.imgurl
    //本地url地址
    var getimgurl = null
    //是否有图片
    var ishavePic = that.data.ishavePic

    
    wx.getImageInfo({
      src: imgurl,
      success:function(res){
        getimgurl = res.path
        console.log(getimgurl)
    if (ishavePic == true) {
      console.log("if:imgurl:" + getimgurl)
      //绘制预览
      mycanvas.drawImage(getimgurl, 0, 0, imgwidth, imgheight)
      //绘制最终
      finalcanvas.drawImage(getimgurl, 0, 0, initImgW, initImgH)
      console.log("initImgW、initImgH:" + initImgW + initImgH)
      that.setData({
        EmptyViewDisable:'none'
      })
    }
    else {
      that.setData({
        EmptyViewDisable:'block'
      })

    }
    //图像绘制
    mycanvas.draw()
    finalcanvas.draw()
    that.setData({
      getimgurl: getimgurl
       })
    wx.hideToast()
      }
    })
  },
  //---------------------清空画布---------------------
  bindcanvasclear: function () {
    var that = this
    wx.showModal({
      title: '清除画布',
      content: '是否确认清除画布内容',
      success:function(res){
        if(res.confirm){
          that.setData({
            ishavePic: false
          })
          that.canvasfunction()
          that.canvascleartext()
        }
      }
    })

  }
  ,
  //---------------------添加文字---------------------
  canvasaddtext: function (event) {
    var that = this
    var mytext = wx.createCanvasContext("canvas-text-move")
    //var SaveCanvas = wx.createCanvasContext("savePicCanvas-text")
    var text = that.data.textvalue
    var textRatio = that.data.textRatio
    var textsize = that.data.textsize
    //var color = this.data.fontcolorhex[this.data.colorIndex]
    var color = that.data.fontColor
    //是否粗体
    var textBoldSelect = that.data.textBoldSelect
    var _x = 150
    var _y = 150
    var x = this.data.x
    var y = this.data.y
    if(x != 0){
      _x = x
    }
    if (y != 0) {
      _y = y
    }
    
    var textw = 0
    var texth = 0
    //var target = event.currentTarget.dataset.input || false
    //var target = true
    var _rpx = that.data._rpx
    var textConfirmBtnTop = _y - (50 * _rpx) - textsize
    var textConfirmBtnLeft = _x

    var S_fontSize = Math.ceil(that.data.fontsize[that.data.sizeindex] * textRatio)
    var textConfirmBtnDisplay = 'true'
    var MoveLock = true

    if (text == "") {
      wx.showToast({
        title: '文字内容为空',
        image: '/img/icon/icon26.png'
      })
      textConfirmBtnDisplay = 'none'
      MoveLock = false
    }

    if (textConfirmBtnTop < 50 * _rpx){
      textConfirmBtnTop += textsize * 2
    }
    mytext.setFillStyle(color)
    mytext.setFontSize(that.data.fontsize[that.data.sizeindex])
    mytext.fillText(text, _x, _y)
    if (textBoldSelect){
      mytext.fillText(text, _x - 0.5, _y)
      mytext.fillText(text, _x, _y - 0.5)
      mytext.fillText(text, _x + 0.5, _y)
      mytext.fillText(text, _x, _y + 0.5)
    }
    //SaveCanvas.setFillStyle(color)
    //SaveCanvas.setFontSize(S_fontSize)
    //SaveCanvas.fillText(text, 150 * textRatio, 150 * textRatio)
    
    mytext.draw()
    //SaveCanvas.draw()

    console.log("发生了canvasaddtext")
    that.setData({
      textsize: that.data.fontsize[that.data.sizeindex],
      textConfirmBtnTop: textConfirmBtnTop,
      textConfirmBtnLeft: textConfirmBtnLeft,
      textConfirmBtnDisplay: textConfirmBtnDisplay,
      //允许文字拖动
      MoveLock: MoveLock
    })
    console.log("textsize:" + that.data.textsize)
  }
  ,
  //---------------------文本canvas清除---------------------
  canvascleartext: function () {
    var mytext = wx.createCanvasContext("canvas-text")
    var canvastextmove = wx.createCanvasContext('canvas-text-move')
    var savePicCanvas = wx.createCanvasContext("savePicCanvas")
    //导出的画布填充原图片
    var getimgurl = this.data.getimgurl
    //最终canvas绘制宽高
    var initImgW = this.data.initImgW
    var initImgH = this.data.initImgH

    mytext.fillText("", 0, 0)
    canvastextmove.fillText("",0,0)
    savePicCanvas.drawImage(getimgurl, 0, 0, initImgW, initImgH)
    savePicCanvas.fillText("", 0, 0)
    mytext.draw()
    canvastextmove.draw()
    savePicCanvas.draw()
  }
  ,
  //---------------------文本确认按钮 取消---------------------
  textConfirmBtnCancel:function(){
    var canvastextmove = wx.createCanvasContext('canvas-text-move')
    canvastextmove.fillText("", 0, 0)
    canvastextmove.draw()
    this.setData({
      textConfirmBtnDisplay:'none',
      MoveLock: false
    })
    console.log("文本确认按钮 取消")
  }
  ,
  //---------------------文本确认按钮 确认---------------------
  textConfirmBtnCurrect: function () {
    var that = this
    var mytext = wx.createCanvasContext("canvas-text")
    var SaveCanvas = wx.createCanvasContext("savePicCanvas")
    var text = that.data.textvalue
    var textRatio = that.data.textRatio
    var boldRatio = 0.5 * textRatio
    var color = that.data.fontColor
    var x = that.data.x
    var y = that.data.y
    var S_fontSize = Math.ceil(that.data.fontsize[that.data.sizeindex] * textRatio)
    //是否粗体
    var textBoldSelect = that.data.textBoldSelect

    mytext.setFillStyle(color)
    mytext.setFontSize(that.data.fontsize[that.data.sizeindex])
    SaveCanvas.setFillStyle(color)
    SaveCanvas.setFontSize(S_fontSize)
    mytext.fillText(text, x, y)
    SaveCanvas.fillText(text, x * textRatio, y * textRatio)
    if (textBoldSelect) {
      mytext.fillText(text, x - 0.5, y)
      mytext.fillText(text, x, y - 0.5)
      mytext.fillText(text, x + 0.5, y)
      mytext.fillText(text, x, y + 0.5)
      
      SaveCanvas.fillText(text, x * textRatio - boldRatio, y * textRatio)
      SaveCanvas.fillText(text, x * textRatio, y * textRatio - boldRatio)
      SaveCanvas.fillText(text, x * textRatio + boldRatio, y * textRatio)
      SaveCanvas.fillText(text, x * textRatio, y * textRatio + boldRatio)
      
    }

    mytext.draw(true)
    SaveCanvas.draw(true)

    this.setData({
      textConfirmBtnDisplay:'none',
      MoveLock:false
    })
    console.log("文本确认按钮 确认")
  }
  ,
  //---------------------canvas点击---------------------
  canvasmovestart: function (e) {
    var x = e.touches[0].x
    var y = e.touches[0].y
    if (y < 30) { y = 30 }
    this.setData({
      x: x,
      y: y,
      textIsClick: true
    })
    console.log("x:" + e.touches[0].x)
    console.log("y:" + e.touches[0].y)
  }
  ,
  //---------------------canvas拖拽---------------------
  canvasmoveon: function (e) {
    var that = this
    if (that.data.MoveLock == true) {
      console.log("moveon!")
      var x = e.touches[0].x
      var y = e.touches[0].y
      var textRatio = that.data.textRatio
      var textsize = that.data.textsize
      var textlength = that.data.textlength
      var imgwidth = that.data.imgwidth
      var imgheight = that.data.imgheight
      var textConfirmBtnTop = that.data.textConfirmBtnTop
      var textConfirmBtnLeft = that.data.textConfirmBtnLeft
      var _rpx = that.data._rpx
      var mytext = wx.createCanvasContext("canvas-text-move")
      var text = that.data.textvalue
      var color = that.data.fontColor
      //是否粗体
      var textBoldSelect = that.data.textBoldSelect
      
      if (x < 0) { x = 0 }
      if (x + (textlength * textsize) > imgwidth) { x = imgwidth - (textlength * textsize) }
      if (y - (textsize) < 0) { y = textsize }
      if (y > imgheight) { y = imgheight }

      textConfirmBtnTop = y - (50 * _rpx) - textsize
      textConfirmBtnLeft = x

      if (textConfirmBtnTop < 50 * _rpx) {
        textConfirmBtnTop += textsize * 2
      }
      
      mytext.setFillStyle(color)
      mytext.setFontSize(textsize)
      mytext.fillText(text, x, y)
      if (textBoldSelect) {
        mytext.fillText(text, x - 0.5, y)
        mytext.fillText(text, x, y - 0.5)
        mytext.fillText(text, x + 0.5, y)
        mytext.fillText(text, x, y + 0.5)
      }

      mytext.draw()
      that.setData({
        x: x,
        y: y,
        textConfirmBtnTop: textConfirmBtnTop,
        textConfirmBtnLeft: textConfirmBtnLeft
      })
    }
  }
  ,
  canvasmoveout:function(){
    var that = this
    var x = that.data.x
    var y = that.data.y
    var textRatio = that.data.textRatio
    var textsize = that.data.textsize
    var SaveCanvas = wx.createCanvasContext("savePicCanvas-text")
    var text = that.data.textvalue
    var color = that.data.fontColor

    SaveCanvas.setFillStyle(color)
    SaveCanvas.setFontSize(textsize * textRatio)
    SaveCanvas.fillText(text, x * textRatio, y * textRatio)
    SaveCanvas.draw(true)

  }
  ,
  //---------------------保存图片---------------------
  canvaspicsave: function () {

    var imgwidth = this.data.imgwidth
    var imgheight = this.data.imgheight
    //图片原始尺寸
    var initImgW = this.data.initImgW
    var initImgH = this.data.initImgH

    wx.showToast({
      title: '图片生成中',
      duration: 1000
    })

      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: initImgW,
        height: initImgH,
        canvasId: 'savePicCanvas',
        success: function (res) {
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

    this.setData({
      tempfile: temp
    })
    console.log("result:" + this.data.tempfile)
  }
  ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var count = that.data.count
    let temp = count + 1
    const MAX_LIMIT = 20
    //获取当前页面高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenWidth: res.windowWidth,
          screenHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          _rpx:res.windowWidth/750
        })
        console.log("当前页高度：" + res.windowWidth)
        console.log("当前页高度：" + res.windowHeight)
        console.log("rpx:" + res.windowWidth / 750)
      },
    })

    //获取图片读取次数
    wx.cloud.callFunction({
      name:'pictureCount',
      success:function(res){
        console.log(res.result)
        that.setData({
          batchTimes: res.result.batchTimes
        })
      }
    })
    //云函数会出现不执行的情况，定时检查
    setTimeout(function(){
      if(that.data.batchTimes == 0){
        wx.showToast({
          title: '云函数加载出现问题了',
          icon:'loading'
        })
        wx.cloud.callFunction({
          name: 'pictureCount',
          success: function (res) {
            console.log(res.result)
            that.setData({
              batchTimes: res.result.batchTimes
            })
          }
        })
      }
      console.log("执行了定时检查次数")
    },5000)

    picture.limit(MAX_LIMIT).get({
      success:function(res){
        console.log(res.data)
        that.setData({
          EmoPic:res.data,
          count:temp,
          
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
    if(app.globalData.skin == 'light'){
      var PicViewIsSelect = 'rgb(230,230,230)'
      var TextViewIsSelect = '#fff'
      var ColorViewIsSelect= '#fff'
      var TextIsBold_bg = '#fff'
    }
    else{
      var PicViewIsSelect = '#272727'
      var TextViewIsSelect = '#3b3b3b'
      var ColorViewIsSelect= '#3b3b3b'
      var TextIsBold_bg = '#3b3b3b'
    }
    this.setData({
      skin: app.globalData.skin,
      PicViewIsSelect: PicViewIsSelect,
      TextViewIsSelect: TextViewIsSelect,
      ColorViewIsSelect: ColorViewIsSelect,
      TextIsBold_bg: TextIsBold_bg
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