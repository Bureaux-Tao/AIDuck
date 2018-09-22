var utilMd5 = require('../../utils/md5utf-8.js')
var lang=""
Page({

  /**
   * 页面的初始数据
   */
  data: {
      Text: "",
      int: 0,
      autoHeight:true,
      src:"",
      array: ['中文', '英文', '日文', '韩文', '法文', '俄文', '葡萄牙文', '西班牙文', '越南文'],
      index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
      var that=this
      wx.getStorage({
          key: 'strWithN',
          success: function(res) {
              console.log(res);
              that.setData({
                  Text:res.data
              })
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

    Copy:function() {
        var that=this
        wx.setClipboardData({
            data: that.data.Text,
        })
    },

    Erase: function () {
        var that = this
        wx.getStorage({
            key: 'strWithoutN',
            success: function (res) {
                console.log(res);
                that.setData({
                    Text: res.data
                })
            },
        })
    },

    bindPickerChange: function (e) {
        switch (e.detail.value) {
            case '0':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                lang ="zh-CHS"
                break;
            case '1':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                lang = "EN"
                break;
            case '2':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                lang = "ja"
                break;
            case '3':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                lang = "ko"
                break;
            case '4':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                lang = "fr"
                break;
            case '5':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                lang = "ru"
                break;
            case '6':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                lang = "pt"
                break;
            case '7':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                lang = "es"
                break;
            case '8':
                console.log('picker发送选择改变，携带值为', e.detail.value)
                lang = "vi"
                break;
        }
        this.Translate(this.data.Text,lang)
    },

    Check: function () {
        var that=this
        if(that.data.autoHeight==true) {
            that.setData({
                autoHeight: false
            })
            wx.getStorage({
                key: 'pic',
                success: function(res) {
                    that.setData({
                        src:res.data,
                    })
                },
            })
        } else {
            that.setData({
                autoHeight: true
            })
        }
    },

    Undo: function () {
        var that = this
        wx.getStorage({
            key: 'strWithN',
            success: function (res) {
                console.log(res);
                that.setData({
                    Text: res.data
                })
            },
        })
    },

    OK: function (event) {
        console.log(event);
        var mod = event.detail.value
        console.log("OK");
        this.setData({
            Text:mod
        })
        console.log(this.data.Text);
    },

    Translate: function (trans, to_lang) {
        // trans="this is a test"
        // to_lang ="zh-CHS"
        var q = trans
        var appKey = "5445a4b07b987f3c"
        var salt = (new Date).getTime();
        var secretKey = "llzq3a9QfzGHkWndDOAId2NZ0LqWa2lW"
        var password = utilMd5.md5(appKey + q + salt + secretKey)
        password = password.toUpperCase();
        console.log(password);
        wx.showLoading({
            title: '翻译中...',
        })
        wx.request({
            url: 'https://openapi.youdao.com/api',
            data: {
                q: encodeURI(q),
                appKey: appKey,
                salt: salt,
                from: "",
                to: to_lang,
                sign: password
            },
            success: (res) => {
                console.log(res.data.errorCode);

                //判错
                if(res.data.errorCode!="0") {
                    if (res.data.errorCode == "103") {
                        wx.showModal({
                            title: 'Ooops 翻译出错了',
                            content: '翻译文本过长, 请分次翻译',
                            showCancel:false
                        })
                    }
                    else if (res.data.errorCode == "113") {
                        wx.showModal({
                            title: 'Ooops 翻译出错了',
                            content: '翻译内容不能为空, 写点内容8',
                            showCancel: false
                        })
                    }
                    else if (res.data.errorCode == "301") {
                        wx.showModal({
                            title: 'Ooops 翻译出错了',
                            content: '词典查询失败, 请再次尝试',
                            showCancel: false
                        })
                    }
                    else if (res.data.errorCode == "302") {
                        wx.showModal({
                            title: 'Ooops 翻译出错了',
                            content: '翻译查询失败, 请再次尝试',
                            showCancel: false
                        })
                    }
                    else if (res.data.errorCode == "411") {
                        wx.showModal({
                            title: 'Ooops 翻译出错了',
                            content: '太过频繁地请求, 请歇会',
                            showCancel: false
                        })
                    } else {
                        wx.showModal({
                            title: 'Ooops 翻译出错了',
                            content: "错误码:" + res.data.errorCode+"。请将此错误码反馈给开发者",
                            showCancel: false
                        })
                    }
                    return
                }
                var temp=""
                // console.log(res.data.translation[0]);
                temp = res.data.translation[0]
                // console.log(temp);
                this.setData({
                    Text: temp
                })
            }, fail: (res) => {
                console.log(res);
            }, complete: (res) => { 
                wx.hideLoading()
            }
        })
    },
})