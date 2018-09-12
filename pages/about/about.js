Page({

  /**
   * 页面的初始数据
   */
  data: {
      a: ['https://ws1.sinaimg.cn/large/8e278454gy1fur3std6hyj20oa0o976a.jpg'],
      engine: "",
      array: ['百度', '必应', '微博', '淘宝', '知乎', '位置', '图片', '优酷', '爱奇艺'],
      index: 0,
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    
  },

    Auth: function () {
        var that = this;
        wx.openSetting({
            success: (res) => {
                console.log(res.authSetting);
                if (!res.authSetting['scope.record']) {
                    //未设置录音授权
                    console.log("未设置录音授权");
                    wx.showModal({
                        title: '提示',
                        content: '您未授权录音，功能将无法使用',
                        showCancel: false,
                        success: function (res) {

                        },
                    })
                } else {
                    //第二次才成功授权
                    console.log("设置录音授权成功");
                    //recorderManager.start(options);
                }
            },
            fail: function () {
                console.log("授权设置录音失败");
            }
        })
    },

    test:function() {
        var a="1234567890"
        console.log(a.substr(a.length-4,a.length-1));
    },

    pre:function() {
        
        wx.previewImage({
            urls: this.data.a,
            success:(res)=> {
                console.log(res);
            },fail:(res)=> {
                console.log(res);
            },complete:(res)=>{}
        }) 
    },

    bindPickerChange: function (e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        switch (e.detail.value) {
            case '0':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'https://www.baidu.com/s?wd=',
                })
                break;
            case '1':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'https://cn.bing.com/search?q=',
                })
                break;
            case '2':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'http://s.weibo.com/weibo/',
                })
                break;
            case '3':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'https://s.taobao.com/search?q=',
                })
                break;
            case '4':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'https://www.zhihu.com/search?q=',
                })
                break;
            case '5':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'https://www.amap.com/search?query=',
                })
                break;
            case '6':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'https://www.flickr.com/search/?text=',
                })
                break;
            case '7':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'https://www.soku.com/search_video/q_',
                })
                break;
            case '8':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'https://so.iqiyi.com/so/q_',
                })
                break;
        }
        this.setData({
            index: e.detail.value
        })
        wx.getStorage({
            key: 'engine',
            success: (res) => {
                console.log(res);
            }, fail: (res) => {
                console.log(res);
            }, complete: (res) => { }
        })
    },

    // test:function() {
        
    // }
})