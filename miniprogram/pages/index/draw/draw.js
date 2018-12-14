// pages/index/draw/draw.js
const app = getApp()
var Canvas = null
Page({
 

  /**
   * 页面的初始数据
   */
  data: {
    //画布宽度%
    canvasWidth:100,
    //画布高度%
    canvasHeight:90,
    //页面宽高 px
    windowWidth:0,
    windowHeight:0,
    //画笔大小 px
    penWidth:5,
    //画笔颜色
    pencolor:'#000000',
    //画笔透明度
    //penOpacity:1,
   // penOpacityshow:100,
    //橡皮擦大小 px
    eraseWidth:25,
    //背景颜色
    backgroundColor:'#ffffff',
    Lastx:0,
    Lasty:0,
    //目前画笔状态（画笔、橡皮擦）
    isPen:true,
    PenBG:'#F0F0F0',
    eraseBG: '#ffffff',
    //top
    penWidthTop:10,
    pencolorTop:10,
    //penOpacityTop:10,
    eraseWidthTop:10,
    bgColorTop:10,

    //画笔大小
    penWidthArray:['5','10','15','20','25'],
    //画笔颜色
    pencolorArray: ['#000000', '#272727', '#4F4F4F', '#8E8E8E', '#E0E0E0', '#ffffff', '#FFB6C1', '#FF69B4', '#C71585', '#ff0000', '#FF8C00', '#FFD700', '#ADFF2F', '#00FF00', '#008000', '#2E8B57', '#00CED1', '#0000FF', '#00008B', '#4B0082', '#9400D3'],
    //画笔透明度
    //橡皮擦大小
    eraseWidthArray: ['5', '10', '15', '20', '25'],
    //背景颜色
    backgroundColorArray: ['#000000', '#272727', '#4F4F4F', '#8E8E8E', '#E0E0E0', '#ffffff', '#FFB6C1', '#FF69B4', '#C71585', '#ff0000', '#FF8C00', '#FFD700', '#ADFF2F', '#00FF00', '#008000', '#2E8B57', '#00CED1', '#0000FF', '#00008B', '#4B0082', '#9400D3' ],
    //应用样式
    penWidthClass: ['select', 'unselect', 'unselect', 'unselect','unselect'],
    eraseWidthClass: ['unselect', 'unselect', 'unselect', 'unselect', 'select'],
    penColorClass: ['ColorSelect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect'
      , 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect'],
    BGColorClass: ['ColorSelect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect'
      , 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect'],
      //用于保存canvas每一笔内容的数组
    CanvasArray:[]
    //CanvasObject:[],
    //penDown_X:0,
    //penDown_Y:0,
    //penTo_X:0,
    //penTo_Y:0,
    //penTo_width:0,
    //penTo_height:0


  },
  //==============================================触笔=============================================
  penstart:function(e){
    var that = this
    var x = e.touches[0].x
    var y = e.touches[0].y
    var penWidth = that.data.penWidth
    var eraseWidth = that.data.eraseWidth
    var pencolor = that.data.pencolor
    var backgroundColor = that.data.backgroundColor
    //var penOpacity = that.data.penOpacity
    var isPen = that.data.isPen
    console.log("触笔penWidth：" + penWidth)

    //Canvas.save()
    console.log("canvas:" + Canvas)
    //console.log("发生了save()")
    //var Canvas = wx.createCanvasContext("drawCanvas")
    if(isPen){
      Canvas.setStrokeStyle(pencolor)
      //Canvas.setFillStyle(pencolor)
      
      Canvas.setLineWidth(penWidth)
    }
    else{
      Canvas.setStrokeStyle(backgroundColor)
      //Canvas.setFillStyle(backgroundColor)
      
      Canvas.setLineWidth(eraseWidth)
    }
    //Canvas.setLineJoin('miter')
    //Canvas.setMiterLimit(10)
    //Canvas.setGlobalAlpha(penOpacity)
    
    Canvas.setLineCap('round')
    Canvas.beginPath()
    Canvas.moveTo(x,y)
    Canvas.lineTo(x,y)
    Canvas.fill()
    Canvas.stroke()
    Canvas.draw(true)

    that.setData({
      Lastx: x,
      Lasty: y,
      //penDown_X: x,
      //penDown_Y: y
    })
  }
  ,
  //==============================================触笔移动==============================================
  penMove:function(e){
    var that = this
    var Lastx = that.data.Lastx
    var Lasty = that.data.Lasty
    var x = e.touches[0].x
    var y = e.touches[0].y
   // var backgroundColor = that.data.backgroundColor
    //var penWidth = that.data.penWidth
   // var penOpacity = that.data.penOpacity
    
    
    
    //Canvas.clearRect(0,0,375,500)
    //Canvas.moveTo(that.data.Lastx, that.data.Lasty)
    //Canvas.lineTo(e.touches[0].x, e.touches[0].y)
    Canvas.moveTo(Lastx, Lasty)
    Canvas.lineTo(x, y)
    //对当前路径进行描边
    Canvas.stroke()

    //Canvas.save()
    //Canvas.beginPath()
    //Canvas.setGlobalAlpha(1 - penOpacity)
    //Canvas.arc(Lastx, Lasty, penWidth / 2, 0, 2 * Math.PI)
    //Canvas.setFillStyle(backgroundColor)
    //Canvas.fill()
    //Canvas.restore()
    
    Canvas.draw(true)

    that.setData({
      Lastx: x,
      Lasty: y

    })
  },
  //==============================================触笔离开==============================================
  penTouchEnd:function(){
    var that = this
    var CanvasArray = that.data.CanvasArray
    //var CanvasObject = that.data.CanvasObject
    //var penDown_X = that.data.penDown_X
    //var penDown_Y = that.data.penDown_Y
    //var penTo_X = that.data.Lastx
    //var penTo_Y = that.data.Lasty
    var windowWidth = that.data.windowWidth
    var windowHeight = that.data.windowHeight * 0.9

    //var width = penTo_X - penDown_X
    //var height = penTo_Y - penDown_Y
    //width = Math.abs(width)
    //height = Math.abs(height)

    /*
    that.setData({
      penTo_X: penTo_X,
      penTo_Y: penTo_Y,
      penTo_width: width,
      penTo_height: height
    })
    */

    wx.canvasToTempFilePath({
      canvasId: 'drawCanvas',
      width: windowWidth,
      height: windowHeight,
      quality:1,
      //destWidth: windowWidth,
      //destHeight: windowWidth,
      success:function(res){
        CanvasArray.push(res.tempFilePath)
        console.log(res.tempFilePath)
        console.log("CanvasArray:"+CanvasArray)
        console.log("length:" + CanvasArray.length)
      }
    })
    /*wx.canvasGetImageData({
      canvasId: 'drawCanvas',
      x: penDown_X,
      y: penDown_Y,
      width: width,
      height: height,
      success: function(res) {
        //CanvasArray.push(res.data)
        var CanvasArray = new Array()
        CanvasArray[0] = penDown_X
        CanvasArray[1] = penDown_Y
        CanvasArray[2] = penTo_X
        CanvasArray[3] = penTo_Y
        CanvasArray[4] = res.data
        CanvasObject.push(CanvasArray)
        console.log("canvasGetImageData:" + CanvasArray)
      },
      fail: function(res) {},
      complete: function(res) {
        //console.log("canvasGetImageData:" + res.data)
      }
    })*/

  }
  ,
  //==============================================点击‘画笔’==============================================
  PenTap: function () {
    this.setData({
      isPen: true,
      PenBG: '#F0F0F0',
      eraseBG: '#ffffff',
      //penWidthTop:0
    })
  }
  ,
  //==============================================点击‘橡皮擦’==============================================
  eraseTap:function(){
    this.setData({
      isPen:false,
      eraseBG: '#F0F0F0',
      PenBG: '#ffffff',
      
    })
  }
  ,
  //==============================================点击‘返回’按钮==============================================
  bindprePage:function(){
    this.setData({
      penWidthTop: 10,
      pencolorTop: 10,
      penOpacityTop: 10,
      eraseWidthTop: 10,
      bgColorTop: 10,
    })
  }
  ,
  //==============================================点击‘画笔大小’==============================================
  bindPenWidth_V:function(event){
    var that = this
    that.setData({
      penWidthTop: 0
    })
  }
  ,
  //-------------------修改‘画笔大小’-------------------
  bindPenWidth:function(event){
    var penWidth = event.currentTarget.dataset.width
    var index = event.currentTarget.dataset.index
    var that = this
    var penWidthClass = ['unselect', 'unselect', 'unselect', 'unselect', 'unselect']
    penWidthClass[index] = 'select'
    /* 
    switch(penWidth){
      case '5':
        penWidthClass = ['select', 'unselect', 'unselect', 'unselect', 'unselect']
        break;
      case '10':
        penWidthClass = ['unselect', 'select', 'unselect', 'unselect', 'unselect']
        break;
      case '15':
        penWidthClass = ['unselect', 'unselect', 'select', 'unselect', 'unselect']
        break;
      case "20":
        penWidthClass = ['unselect', 'unselect', 'unselect', 'select', 'unselect']
        break;
      case "25":
        penWidthClass = ['unselect', 'unselect', 'unselect', 'unselect', 'select']
        break;
        default:
        console.log("什么都没触发")
        break;

    }*/
    that.setData({
      penWidth: penWidth,
      penWidthClass: penWidthClass
    })
    console.log("修改画笔大小")
    console.log("penWidth:" + penWidth)
  }
  ,
  //==============================================点击‘画笔颜色’==============================================
  bindPenColor_V: function (event){
    var that = this
    that.setData({
      pencolorTop:0
    })
  }
  ,
  //-------------------修改‘画笔颜色’-------------------
  bindPenColor:function(event){
    var that = this
    var pencolor = event.currentTarget.dataset.color
    var index = event.currentTarget.dataset.index
    var penColorClass = ['ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect']
    penColorClass[index] = 'ColorSelect'
    that.setData({
      pencolor: pencolor,
      penColorClass: penColorClass
    })
    console.log("修改画笔颜色:" + pencolor + ",index:" + index)
  }
  ,
  //==============================================点击‘画笔透明度’==============================================
  /*bindPenOpacity_V: function (event){
    var that = this
    that.setData({
      penOpacityTop: 0
    })
  }
  ,
  //-------------------修改‘画笔透明度’-------------------
  bindPenOpacity:function(event){
    var penOpacity = event.detail.value / 100
    penOpacity = penOpacity.toFixed(2)
    var penOpacityshow = penOpacity * 100
    penOpacityshow = penOpacityshow.toFixed(0)

    console.log(penOpacity)
    var that = this
    that.setData({
      penOpacity: penOpacity,
      penOpacityshow: penOpacityshow
    })
  }
  ,*/
  //==============================================点击‘橡皮擦大小’==============================================
  bindEraseWidth_V: function (event) {
    var that = this
    that.setData({
      eraseWidthTop: 0
    })
  }
  ,
  //-------------------修改‘橡皮擦大小’-------------------
  bindEraseWidth:function(event){
    var that = this
    var index = event.currentTarget.dataset.index
    var width = event.currentTarget.dataset.width
    //var eraseWidth = that.data.eraseWidth
    var eraseWidthClass = ['unselect', 'unselect', 'unselect', 'unselect', 'unselect']
    eraseWidthClass[index] = 'select'
    that.setData({
      eraseWidthClass: eraseWidthClass,
      eraseWidth:width
    })

  }
  ,
  //==============================================点击‘背景颜色’==============================================
  bindBgColor_V: function (event) {
    var that = this
    that.setData({
      bgColorTop: 0
    })
  }
  ,
  //-------------------修改‘背景颜色’-------------------
  bindBGColor: function (event) {
    var that = this
    var BGcolor = event.currentTarget.dataset.color
    var index = event.currentTarget.dataset.index
    var windowWidth = that.data.windowWidth
    var windowHeight = that.data.windowHeight
    var BGColorClass = ['ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect', 'ColorUnselect']
    BGColorClass[index] = 'ColorSelect'
    
    wx.showModal({
      title: '更改背景颜色',
      content: '更改背景颜色将清空画布内容',
      success:function(res){
        if(res.confirm)
        {
          Canvas.setFillStyle(BGcolor)
          Canvas.fillRect(0, 0, windowWidth, windowHeight)
          Canvas.draw()
          that.setData({
            backgroundColor: BGcolor,
            BGColorClass: BGColorClass
          })
          console.log("修改背景颜色:" + BGcolor + ",index:" + index)
        }
      }
    })
    
  }
  ,
  //==============================================‘撤销上一笔’==============================================
  bindGoBack: function (event){
    var that = this
    var windowWidth = that.data.windowWidth
    var windowHeight = that.data.windowHeight * 0.9
    //var penTo_width = that.data.penTo_width
    //var penTo_height = that.data.penTo_height
    var CanvasArray = that.data.CanvasArray
    
    //var CanvasObject = that.data.CanvasObject
    CanvasArray.pop()
    if (CanvasArray.length > 0){
      var index = CanvasArray.length - 1
      //var uint8_CanvasObject = new Uint8ClampedArray(CanvasObject[index])
      //var CanvasObject_index = CanvasObject[index]
      //var data = CanvasObject_index[4]
      //var penDown_X = CanvasObject_index[0]
      //var penDown_Y = CanvasObject_index[1]
      //var penTo_X = CanvasObject_index[2]
      //var penTo_Y = CanvasObject_index[3]
      //var width = penTo_X - penDown_X
      //var height = penTo_Y - penDown_Y
      //width = Math.abs(width)
      //height = Math.abs(height)
      //wx.canvasPutImageData({
        //canvasId: 'drawCanvas',
        //data: data,
        //x: penDown_X,
        //y: penDown_Y,
        //width: width,
        //height: height,
        //success:function(res){
          //Canvas.draw()
          //console.log("canvasPutImageData,width:"+width+", height:"+height)
        //}
      //})
      
      Canvas.drawImage(CanvasArray[index], 0, 0, windowWidth, windowHeight)
      Canvas.draw()
    }
    else{
      /* */
      Canvas.draw()
    }
    //Canvas.restore()
    //Canvas.draw()
    console.log(CanvasArray.length)
    console.log("发生了bindGoBack")
  }
  ,
  //==============================================‘清空’==============================================
  bindClearBoth: function (event){
    var that = this
    wx.showModal({
      title: '是否确定清空画布',
      content: '',
      success:function(res){
        if(res.confirm){
          var BGcolor = that.data.backgroundColor
          var windowWidth = that.data.windowWidth
          var windowHeight = that.data.windowHeight
          Canvas.setFillStyle(BGcolor)
          Canvas.fillRect(0, 0, windowWidth, windowHeight)
          Canvas.draw()
        }
      }
    })

  }
  ,
  bindSavePic:function(){
    var that = this
    var windowWidth = that.data.windowWidth
    var windowHeight = that.data.windowHeight * 0.9
    wx.canvasToTempFilePath({
      canvasId: 'drawCanvas',
      width: windowWidth,
      height: windowHeight,
      quality:1,
      fileType:'jpg',
      success:function(res){
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:function(res){
            console.log("保存成功："+res)
          }
        })
      }
    }, this)
  }
  ,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Canvas = wx.createCanvasContext("drawCanvas") 
    Canvas.setFillStyle('#ffffff')
    
    //获取页面宽高
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        Canvas.fillRect(0, 0, res.windowWidth, res.windowHeight)
        Canvas.draw()
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
        console.log("当前页高度：" + res.windowWidth)
        console.log("当前页高度：" + res.windowHeight)
      },
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