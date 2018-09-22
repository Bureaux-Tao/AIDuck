var utilMd5 = require('../../utils/md5utf-8.js');
// var CusBase64 = require('../../utils/base64.js');
var access_token = ""
const bgm = wx.createInnerAudioContext()
bgm.src = '/audios/switch.mp3';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      picUrl:"",
      isHand:false,
      bt:false,
      btn:"/images/button-un.png",
      swit:"/images/switch_left.png",
      image:"https://ws1.sinaimg.cn/large/8e278454gy1fvf850412pj20ir0rsh3i.jpg"
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

  a:function() {
      wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          success: (res) => {
            //   console.log(res);
              var that = this;
              var exitedFilePaths = that.data.picUrl;
              var tempFilePaths = res.tempFilePaths;
              console.log("tempFilePaths:" + tempFilePaths);
              that.setData({
                  picUrl:tempFilePaths,
                  image: tempFilePaths
              })
              wx.setStorage({
                  key: 'pic',
                  data: that.data.image,
              })
              wx.getStorage({
                  key: 'isAccu',
                  success: function(res) {
                      console.log("getStorage(isAccu):" + res.data);
                      if (res.data == false) {
                          console.log("是否精度模式?:" + res.data);
                          console.log("调用that.baidu()");
                          that.baidu()
                      } else if (res.data == true){
                          console.log("是否精度模式?:" + res.data);
                          console.log("调用that.baidu_accu()");
                          that.baidu_accu()
                      }
                  },
              })
          },
      })
  },
    
    createTimeStamp: function () {
        return parseInt(new Date().getTime() / 1000) + ''
    },

    Base64_str:function(str) {

        var Base64 = {

            // private property
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

            // public method for encoding
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;

                input = Base64._utf8_encode(input);

                while (i < input.length) {

                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

                }

                return output;
            },

            // public method for decoding
            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;

                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                while (i < input.length) {

                    enc1 = this._keyStr.indexOf(input.charAt(i++));
                    enc2 = this._keyStr.indexOf(input.charAt(i++));
                    enc3 = this._keyStr.indexOf(input.charAt(i++));
                    enc4 = this._keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                }

                output = Base64._utf8_decode(output);

                return output;

            },

            // private method for UTF-8 encoding
            _utf8_encode: function (string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";

                for (var n = 0; n < string.length; n++) {

                    var c = string.charCodeAt(n);

                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }

                return utftext;
            },

            // private method for UTF-8 decoding
            _utf8_decode: function (utftext) {
                var string = "";
                var i = 0;
                var c = c1 = c2 = 0;

                while (i < utftext.length) {

                    c = utftext.charCodeAt(i);

                    if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                    } else if ((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i + 1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    } else {
                        c2 = utftext.charCodeAt(i + 1);
                        c3 = utftext.charCodeAt(i + 2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }

                }

                return string;
            }

        }
        /****************************** */
        var a = '{ "language": "cn|en", "location": "true" }'
        return Base64.encode(str);
    },

    btntap:function() {
        var that=this
        bgm.play()
        wx.vibrateShort({
            success:(res)=> {
                console.log(res);
            },fail:(res)=> {
                console.log(res);
            },complete:(res)=>{}
        })
        that.setData({
            btn:"/images/button.png"
        })
        setTimeout(function () {
            //要延时执行的代码
            that.setData({
                btn: "/images/button-un.png"
            })
            that.a()
        }, 200) 
    },

    swi:function () {
        var that=this
        bgm.play()
        wx.vibrateShort({
            success: (res) => {
                console.log(res);
            }, fail: (res) => {
                console.log(res);
            }, complete: (res) => { }
        })
        if(that.data.isHand==true) {
            that.setData({
                swit: '/images/switch_left.png',
                isHand:false
            })
        } else {
            that.setData({
                swit: '/images/switch_right.png',
                isHand: true
            })
        }  
    },

    baidu_accu: function () {
        console.log("进入baidu_accu()");
        var url
        var strWithN = ""
        var strWithoutN = ""
        var base64
        var that = this
        //   console.log(that.data.picUrl);
        var a = wx.getFileSystemManager()
        if(that.data.isHand==false) {
            url ="https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token="
        } else {
            url = "https://aip.baidubce.com/rest/2.0/ocr/v1/handwriting?access_token="
        }
        a.readFile({
            filePath: that.data.picUrl[0],
            encoding: "base64",
            success: (res) => {
                // console.log(res);
                base64 = res.data

                //   console.log("a:" + base64);

                var q = base64
                wx.showLoading({
                    title: '识别中...',
                })
                wx.request({
                    url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=qQL514Y31Em0V8pFLajY8CfC&client_secret=LEjRu03p3HUub1t2qlm35Xp6GZ8Pz8tE',
                    success: (res) => {
                        //   console.log(res.data.access_token);
                        access_token = res.data.access_token
                        // console.log(access_token);

                        url = url + access_token
                        console.log("模式:精度模式");
                        console.log("手写开关:"+that.data.isHand);
                        console.log("请求的URL:"+url);
                        wx.request({
                            url: url,
                            method: "POST",
                            header: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            data: {
                                image: encodeURI(q)
                            }, success: (res) => {
                                console.log(res);
                                wx.hideLoading()

                                that.setData({
                                    content: res.data.words_result
                                })
                                for (var index in that.data.content) {
                                    strWithN = strWithN + that.data.content[index].words + " \n "
                                    strWithoutN = strWithoutN + that.data.content[index].words
                                }
                                // console.log("有换行:" + strWithN);
                                // console.log("无换行:" + strWithoutN);
                                if ((strWithN && strWithoutN == "") || res.data.words_result_num==0) {
                                    wx.showModal({
                                        title: 'Ooops 有问题',
                                        content: '识别内容为空, 请再次尝试。如果多次尝试均有此提示, 请联系开发者',
                                        showCancel:false
                                    })
                                    return
                                }
                                wx.setStorage({
                                    key: 'strWithN',
                                    data: strWithN,
                                    success: (res) => {
                                        // console.log(res);
                                    }, fail: (res) => {
                                        console.log(res);
                                    }, complete: (res) => { }
                                })
                                wx.setStorage({
                                    key: 'strWithoutN',
                                    data: strWithoutN,
                                    success: (res) => {
                                        // console.log(res);
                                    }, fail: (res) => {
                                        console.log(res);
                                    }, complete: (res) => { }
                                })

                                wx.navigateTo({
                                    url: '/pages/ocr/ocr',
                                })
                            }, fail: (res) => {
                                console.log(res);
                            }, complete: (res) => { }
                        })

                    }, fail: (res) => {
                        console.log(res);
                    }, complete: (res) => { }
                })
            }, fail: (res) => {
                console.log(res);
            }, complete: (res) => { }
        })


    },

    baidu:function() {
        console.log("进入baidu");
        var url
        var strWithN = ""
        var strWithoutN = ""
        var base64
        var that = this
        if(that.data.isHand==true) {
            console.log("跳转手写");
            that.baidu_accu()
            return
        } else {
            var language_type = ""
            wx.getStorage({
                key: 'engine',
                success: function (res) {
                    language_type = res.data
                    console.log("语言:" + language_type);
                },
            })
            //   console.log(that.data.picUrl);
            var a = wx.getFileSystemManager()
            url = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token="
            a.readFile({
                filePath: that.data.picUrl[0],
                encoding: "base64",
                success: (res) => {
                    // console.log(res);
                    base64 = res.data

                    //   console.log("a:" + base64);

                    var q = base64
                    wx.showLoading({
                        title: '识别中...',
                    })
                    wx.request({
                        url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=qQL514Y31Em0V8pFLajY8CfC&client_secret=LEjRu03p3HUub1t2qlm35Xp6GZ8Pz8tE',
                        success: (res) => {
                            //   console.log(res.data.access_token);
                            access_token = res.data.access_token
                            // console.log(access_token);

                            url = url + access_token
                            console.log("模式:通用模式");
                            console.log("手写开关:" + that.data.isHand)
                            console.log("请求的URL:" + url);
                            wx.request({
                                url: url,
                                method: "POST",
                                header: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                data: {
                                    image: encodeURI(q),
                                    language_type: language_type,
                                    // detect_direction:'true',
                                    detect_language:'true'
                                }, 
                                success: (res) => {
                                    console.log(res);
                                    wx.hideLoading()
                                    that.setData({
                                        content: res.data.words_result
                                    })
                                    for (var index in that.data.content) {
                                        strWithN = strWithN + that.data.content[index].words + " \n "
                                        strWithoutN = strWithoutN + that.data.content[index].words
                                    }
                                    // console.log("有换行:" + strWithN);
                                    // console.log("无换行:" + strWithoutN);
                                    if ((strWithN && strWithoutN == "") || res.data.words_result_num == 0) {
                                        wx.showModal({
                                            title: 'Ooops 有问题',
                                            content: '识别内容为空, 请再次尝试。如果多次尝试均有此提示, 请联系开发者',
                                            showCancel: false
                                        })
                                        return
                                    }

                                    wx.setStorage({
                                        key: 'strWithN',
                                        data: strWithN,
                                        success: (res) => {
                                            // console.log(res);
                                        }, fail: (res) => {
                                            console.log(res);
                                        }, complete: (res) => { }
                                    })
                                    wx.setStorage({
                                        key: 'strWithoutN',
                                        data: strWithoutN,
                                        success: (res) => {
                                            // console.log(res);
                                        }, fail: (res) => {
                                            console.log(res);
                                        }, complete: (res) => { }
                                    })

                                    wx.navigateTo({
                                        url: '/pages/ocr/ocr',
                                    })
                                }, fail: (res) => {
                                    console.log(res);
                                }, complete: (res) => { }
                            })

                        }, fail: (res) => {
                            console.log(res);
                        }, complete: (res) => { }
                    })
                }, fail: (res) => {
                    console.log(res);
                }, complete: (res) => { }
            })

        }
    }
})