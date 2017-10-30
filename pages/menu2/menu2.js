Page({
  data: {
    moveStartPos: 0,//移动开始位置
    newPos: 0,  //父级view当前移动距离,
    // absNewPos: 0,
    moveDis: 0,
    lastPos: 0, //上次停留位置
    rightMaxPos: 0, //向右最大移动位置
    leftMaxPos:0, //向左最大移动位置

    // itemScale: 1,


    //缩放相关变量
    // originPos: 0,
    // newOriginPos: 0,
    


    //new
    touchItemArr: [1,2,3,4], //滑动元素数量
    touchItemWrapWidth: 0, //滑动元素wrap宽度
    touchItemRadius: 300, //滑动元素半径 rpx
    midWindowWidth: 0,  //屏幕一半尺寸
    windowWidth: 0,
    widthRatio: 0, //rpx * widthRaio = px
    // initialLeft: 0,


    scaleStartPos: 0,
    newScalePos: 0,  //子集view位置
    calculatedNewScalePos: 0,
    lastScalePos: 0,
    // absIndex: 1,

    animationData: {},
    animationDuration: 1000,

    scaleInterval: null,  //scale 定时器

    showIndex: 0, // 图片中间显示索引，第一张图0，第二张图1...

    // canMove: true,  //是否可移动

  },
  onLoad: function () {
    var self = this;
    
    wx.getSystemInfo({
      success: function (res) {

        let _midWindowWidth = res.windowWidth / 2,
            _widthRatio = res.windowWidth / 750,
            _touchItemRadius = self.data.touchItemRadius,
            _touchItemArrLen = self.data.touchItemArr.length,
            _initialLeft = _midWindowWidth - (_touchItemRadius * _widthRatio); //初始父级wrap的left值

        self.setData({
          windowWidth: res.windowWidth, //屏幕宽度
          midWindowWidth: _midWindowWidth,  //屏幕一半的宽度
          widthRatio: _widthRatio, //rpx px 换算比
          touchItemWrapWidth: _midWindowWidth * (_touchItemArrLen - 1) + (_touchItemRadius * 2 * _widthRatio), //父级wrap宽度
          
          lastPos: _initialLeft,
          newPos: _initialLeft,
          rightMaxPos: _initialLeft - _midWindowWidth * (_touchItemArrLen - 1) - _midWindowWidth/3,
          leftMaxPos: _initialLeft + _midWindowWidth / 3,

        });
      },
    })


   
  },
  onShow: function(){
    let animation = wx.createAnimation({
      duration: this.data.animationDuration,
      timingFunction: 'ease',
    })

    this.animation = animation;
  },
  itemTouchStart: function(e){
    clearInterval(this.data.scaleInterval); //清楚定时器

    this.setData({
      animationData: {},
      moveStartPos: e.touches[0].pageX,
      scaleStartPos: e.touches[0].pageX,
      // lastPos: this.data.initialLeft
      moveDis: 0,
      newScalePos: 0,
    });

    // console.log(this.data.lastScalePos);

  },
  itemTouchMove: function (e) {
    let _newPos = e.touches[0].pageX - this.data.moveStartPos + this.data.lastPos;
    let _newScalePos = e.touches[0].pageX - this.data.scaleStartPos + this.data.lastScalePos;

    if (_newPos >= this.data.rightMaxPos && _newPos <= this.data.leftMaxPos){
      this.animation.translate(_newPos).step({
        duration: 0
      });


      this.setData({
        animationData: this.animation.export(),
        newPos: _newPos,
        newScalePos: _newScalePos,
        moveDis: e.touches[0].pageX - this.data.moveStartPos
      });

      if (_newScalePos > 0){  //特殊情况
        this.setData({
          calculatedNewScalePos: Math.abs(_newScalePos) * (-1),
        })
      }
      else {
        this.setData({
          calculatedNewScalePos: Math.abs(_newScalePos),
        })
      }


      //绝对值指数
      // if (e.touches[0].pageX - this.data.scaleStartPos + this.data.lastScalePos < 0) {
      //   this.setData({
      //     absIndex: -1,
      //   })
      // }
      // else {
      //   this.setData({
      //     absIndex: 1,
      //   })
      // }
    }
    

    
  },



  itemTouchEnd: function (e) {
    let _self = this;
    let _newPos = 0;
    let _divideScale = 0;


    //公共函数
    //@param type  --  1
    let c = type => {

      if (type == 2) {
        this.setData({
          showIndex: _self.data.showIndex + 1
        });
      }
      if (type == 3){
        this.setData({
          showIndex: _self.data.showIndex - 1
        });
      }

      //最终停留位置x轴
      _newPos = this.data.midWindowWidth - (this.data.touchItemRadius * this.data.widthRatio) - this.data.midWindowWidth * this.data.showIndex;

      //添加动画
      this.animation.translate(_newPos).step();

      //最终scale位置
      let _endStopScalePos = -(_self.data.showIndex * _self.data.midWindowWidth);  

      _divideScale = (_self.data.newScalePos - _endStopScalePos) / 60;


      this.setData({
        animationData: this.animation.export(),
        newPos: _newPos,
        // newScalePos: 0
        scaleInterval: setInterval(function () {

          _self.setData({
            newScalePos: _self.data.newScalePos - _divideScale,
            lastScalePos: _self.data.newScalePos,
          });

          if (_self.data.newScalePos > 0) {  //特殊情况
            _self.setData({
              calculatedNewScalePos: Math.abs(_self.data.newScalePos - _divideScale) * (-1),
            })
          }
          else {
            _self.setData({
              calculatedNewScalePos: Math.abs(_self.data.newScalePos - _divideScale),
            })
          }


          //清除定时器
          if (_divideScale < 0) {           
            if (_self.data.newScalePos >= _endStopScalePos) {
              console.log('<0');
              clearInterval(_self.data.scaleInterval);
              _self.setData({
                calculatedNewScalePos: Math.abs(_endStopScalePos),
                lastScalePos: _endStopScalePos,
              });
            }
          }
          else {
            if (_self.data.newScalePos <= _endStopScalePos) {
              console.log(">=0");
              clearInterval(_self.data.scaleInterval);
              _self.setData({
                calculatedNewScalePos: Math.abs(_endStopScalePos),
                lastScalePos: _endStopScalePos,
              });
            }
          }
        }, 16),
      });
    }

    

    //判断点击滑动
    if (Math.abs(this.data.moveDis) < this.data.midWindowWidth / 2) {
      // console.log(Math.abs(this.data.moveDis));
      if (Math.abs(this.data.moveDis) < 10){   //点击
        wx.navigateTo({
          url: '../detail/detail'
        })
      }
      else {
        c(1);
      }
      
    }
    else {
      if (this.data.moveDis < 0) { 
        c(2);
      }
      else {
        c(3)
      }
    }


    this.setData({
      lastPos: this.data.newPos,
      // lastScalePos: this.data.newScalePos,
    });
  },
})
