Page({
  data: {
    moveStartPos: 0,//移动开始位置
    newPos: 0,  //当前移动距离,
    absNewPos: 0,
    
    lastPos: 0, //上次停留位置

    itemScale: 1,

    //缩放相关变量
    originPos: 0,
    newOriginPos: 0,
    midWindowWidth: 0,

  },
  onLoad: function () {
    var self = this;
    wx.getSystemInfo({
      success: function(res) {
       
        self.setData({
          midWindowWidth: res.windowWidth/2
        });
        console.log(self.data.midWindowWidth);
      },
    })
  },
  touchstart: function(e){
    this.setData({
      moveStartPos: e.touches[0].pageX,
    });
    // console.log(this.data.moveStartPos);

  },
  touchmove: function(e){
    this.setData({
      newPos: e.touches[0].pageX - this.data.moveStartPos + this.data.lastPos +'px',
      itemScale: 1-Math.abs(e.touches[0].pageX - this.data.moveStartPos + this.data.lastPos) / this.data.midWindowWidth
    });

    console.log(this.data.itemScale);
  },
  touchend: function(e){
    this.setData({
      lastPos: parseFloat(this.data.newPos)
    });

    console.log(this.data.lastPos);
  },
})
