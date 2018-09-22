Page({

  /**
   * 页面的初始数据
   */
  data: {
      a: ['https://ws1.sinaimg.cn/large/8e278454gy1fur3std6hyj20oa0o976a.jpg'],
      engine: "",
      array: ['中英文混合', '英文', '葡萄牙语', '法语', '德语', '意大利语', '西班牙语', '俄语', '日语','韩语'],
      index: 0,
      dis:false
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
                    data: 'CHN_ENG',
                })
                break;
            case '1':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'ENG',
                })
                break;
            case '2':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'POR',
                })
                break;
            case '3':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'FRE',
                })
                break;
            case '4':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'GER',
                })
                break;
            case '5':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'ITA',
                })
                break;
            case '6':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'SPA',
                })
                break;
            case '7':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'RUS',
                })
                break;
            case '8':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'JAP',
                })
                break;
            case '9':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                wx.setStorage({
                    key: 'engine',
                    data: 'KOR',
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

    accu:function () {
        var that=this
        wx.showActionSheet({
            itemList: ['通用识别(支持多语言)','高精度识别(只支持中英文)'],
            success: function (e) {
                if (e.tapIndex == 0) {
                    wx.setStorage({
                        key: 'isAccu',
                        data: false,
                        success:(res)=> {
                            console.log(res);
                            that.setData({
                                dis: false
                            })
                        },fail:(res)=> {
                            console.log(res);
                        },complete:(res)=>{}
                    })
                }
                if (e.tapIndex == 1) {
                    wx.setStorage({
                        key: 'isAccu',
                        data: true,
                        success:(res)=> {
                            console.log(res);
                            that.setData({
                                dis:true
                            })
                        },fail:(res)=> {
                            console.log(res);
                        },complete:(res)=>{}
                    })
                }
            }
        })
    },

    back: function () {
        wx.redirectTo({
            url: '/pages/a/a',
        })
    },

    contact:function() {
        wx.previewImage({
            urls: ["https://ws1.sinaimg.cn/large/8e278454gy1fviazyv0yxj20ih0iuwgu.jpg"],
        })
    }
})