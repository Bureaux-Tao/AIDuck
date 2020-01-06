/**
 * wx-cropper 1.1
 */

var fundebug = require('../../libs/fundebug.0.8.2.min.js')
fundebug.init(
    {
        apikey: "5811e8c7dc9ee21a8380a27164f5d73c6eafbe574f6bdea8f89b7d1aba7c918f",
        silentInject: true
    })


var access_token = ""
let SCREEN_WIDTH = 750
let PAGE_X, // 手按下的x位置
    PAGE_Y, // 手按下y的位置
    PR = wx.getSystemInfoSync().pixelRatio, // dpi
    T_PAGE_X, // 手移动的时候x的位置
    T_PAGE_Y, // 手移动的时候Y的位置
    CUT_L, // 初始化拖拽元素的left值
    CUT_T, // 初始化拖拽元素的top值
    CUT_R, // 初始化拖拽元素的
    CUT_B, // 初始化拖拽元素的
    CUT_W, // 初始化拖拽元素的宽度
    CUT_H, //  初始化拖拽元素的高度
    IMG_RATIO, // 图片比例
    IMG_REAL_W, // 图片实际的宽度
    IMG_REAL_H, // 图片实际的高度
    DRAFG_MOVE_RATIO = 750 / wx.getSystemInfoSync().windowWidth, //移动时候的比例,
    INIT_DRAG_POSITION = 200, // 初始化屏幕宽度和裁剪区域的宽度之差，用于设置初始化裁剪的宽度
    DRAW_IMAGE_W = 2000 // 设置生成的图片宽度

Page({
    /**
     * 页面的初始数据
     */
    data: {
        // 之后可以动态替换
        picUrl: "",
        image: "",

        // 是否显示图片(在图片加载完成之后设置为true)
        isShowImg: false,

        // 初始化的宽高
        cropperInitW: SCREEN_WIDTH,
        cropperInitH: SCREEN_WIDTH,

        // 动态的宽高
        cropperW: SCREEN_WIDTH,
        cropperH: SCREEN_WIDTH,

        // 动态的left top值
        cropperL: 0,
        cropperT: 0,

        // 图片缩放值
        scaleP: 0,

        // 裁剪框 宽高
        cutL: 0,
        cutT: 0,
        cutB: SCREEN_WIDTH,
        cutR: '100%',
        qualityWidth: DRAW_IMAGE_W,
        innerAspectRadio: DRAFG_MOVE_RATIO,
        ic: "#09BB07"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        wx.getStorage({
            key: 'pic',
            success: function(res) {
                that.setData({
                    picUrl: res.data,
                    image: res.data
                })
            },
        })
        wx.getStorage({
            key: 'isHand',
            success: function(res) {
                that.setData({
                    isHand: res.data
                })
            },
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

        this.loadImage();

    },

    /**
     * 初始化图片信息
     * 获取图片内容，并初始化裁剪框
     */
    loadImage: function() {
        var that = this
        wx.showLoading({
            title: '图片加载中...',
            mask:true
        })

        wx.getImageInfo({
            src: that.data.picUrl[0],
            success: function success(res) {
                IMG_REAL_W = res.width
                IMG_REAL_H = res.height
                IMG_RATIO = IMG_REAL_W / IMG_REAL_H
                let minRange = IMG_REAL_W > IMG_REAL_H ? IMG_REAL_W : IMG_REAL_H
                INIT_DRAG_POSITION = minRange > INIT_DRAG_POSITION ? INIT_DRAG_POSITION : minRange
                // 根据图片的宽高显示不同的效果   保证图片可以正常显示
                if (IMG_RATIO >= 1) {
                    that.setData({
                        cropperW: SCREEN_WIDTH,
                        cropperH: SCREEN_WIDTH / IMG_RATIO,
                        // 初始化left right
                        cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2),
                        cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH / IMG_RATIO) / 2),
                        cutL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH + INIT_DRAG_POSITION) / 2),
                        cutT: Math.ceil((SCREEN_WIDTH / IMG_RATIO - (SCREEN_WIDTH / IMG_RATIO - INIT_DRAG_POSITION)) / 2),
                        cutR: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH + INIT_DRAG_POSITION) / 2),
                        cutB: Math.ceil((SCREEN_WIDTH / IMG_RATIO - (SCREEN_WIDTH / IMG_RATIO - INIT_DRAG_POSITION)) / 2),
                        // 图片缩放值
                        scaleP: IMG_REAL_W / SCREEN_WIDTH,
                        qualityWidth: DRAW_IMAGE_W,
                        innerAspectRadio: IMG_RATIO
                    })
                } else {
                    that.setData({
                        cropperW: SCREEN_WIDTH * IMG_RATIO,
                        cropperH: SCREEN_WIDTH,
                        // 初始化left right
                        cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO) / 2),
                        cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2),

                        cutL: Math.ceil((SCREEN_WIDTH * IMG_RATIO - (SCREEN_WIDTH * IMG_RATIO)) / 2),
                        cutT: Math.ceil((SCREEN_WIDTH - INIT_DRAG_POSITION) / 2),
                        cutB: Math.ceil((SCREEN_WIDTH - INIT_DRAG_POSITION) / 2),
                        cutR: Math.ceil((SCREEN_WIDTH * IMG_RATIO - (SCREEN_WIDTH * IMG_RATIO)) / 2),
                        // 图片缩放值
                        scaleP: IMG_REAL_W / SCREEN_WIDTH,
                        qualityWidth: DRAW_IMAGE_W,
                        innerAspectRadio: IMG_RATIO
                    })
                }
                that.setData({
                    isShowImg: true
                })
                wx.hideLoading()
            }
        })
    },

    /**
     * 拖动时候触发的touchStart事件
     */
    contentStartMove(e) {
        PAGE_X = e.touches[0].pageX
        PAGE_Y = e.touches[0].pageY
    },

    /**
     * 拖动时候触发的touchMove事件
     */
    contentMoveing(e) {
        var that = this
        var dragLengthX = (PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
        var dragLengthY = (PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO

        /**
         * 这里有一个小的问题
         * 移动裁剪框 ios下 x方向没有移动的差距
         * y方向手指移动的距离远大于实际裁剪框移动的距离
         * 但是在有些机型上又是没有问题的，小米4测试没有上下移动产生的偏差，模拟器ok，但是iphone8p确实是有的，虽然模拟器也ok
         * 小伙伴有兴趣可以找找原因
         */

        // 左移右移
        if (dragLengthX > 0) {
            if (this.data.cutL - dragLengthX < 0) dragLengthX = this.data.cutL
        } else {
            if (this.data.cutR + dragLengthX < 0) dragLengthX = -this.data.cutR
        }


        // 上移下移
        if (dragLengthY > 0) {
            if (this.data.cutT - dragLengthY < 0) dragLengthY = this.data.cutT
        } else {
            if (this.data.cutB + dragLengthY < 0) dragLengthY = -this.data.cutB
        }
        this.setData({
            cutL: this.data.cutL - dragLengthX,
            cutT: this.data.cutT - dragLengthY,
            cutR: this.data.cutR + dragLengthX,
            cutB: this.data.cutB + dragLengthY
        })

        // console.log('cutL', this.data.cutL)
        // console.log('cutT', this.data.cutT)
        // console.log('cutR', this.data.cutR)
        // console.log('cutB', this.data.cutB)

        PAGE_X = e.touches[0].pageX
        PAGE_Y = e.touches[0].pageY
    },

    contentTouchEnd() {

    },

    /**
     * 获取图片
     */
    getImageInfo() {
        var that = this

        that.setData({
            ic: "#34A853"
        })

        setTimeout(function() {
            //要延时执行的代码
            that.setData({
                ic: "#09BB07"
            })
        }, 150) 
        wx.showLoading({
            title: '图片裁剪中...',
            mask: true
        })
        console.log("D1");
        // 将图片写入画布
        const ctx = wx.createCanvasContext('myCanvas')
        console.log("D2");
        ctx.drawImage(that.data.picUrl[0], 0, 0, IMG_REAL_W, IMG_REAL_H);
        console.log("D3");
        console.log(that.data.picUrl[0]);


        var canvasW = ((that.data.cropperW - that.data.cutL - that.data.cutR) / that.data.cropperW) * IMG_REAL_W
        var canvasH = ((that.data.cropperH - that.data.cutT - that.data.cutB) / that.data.cropperH) * IMG_REAL_H
        var canvasL = (that.data.cutL / that.data.cropperW) * IMG_REAL_W
        var canvasT = (that.data.cutT / that.data.cropperH) * IMG_REAL_H

        ctx.draw(true, setTimeout(function (){
            console.log("D4");
            // 获取画布要裁剪的位置和宽度   均为百分比 * 画布中图片的宽度    保证了在微信小程序中裁剪的图片模糊  位置不对的问题
            
            // 生成图片
            wx.canvasToTempFilePath({
                x: canvasL,
                y: canvasT,
                width: canvasW,
                height: canvasH,
                destWidth: canvasW,
                destHeight: canvasH,
                quality: 0.5,
                fileType:"jpg",
                canvasId: 'myCanvas',
                success: function (res) {
                    console.log("D5");
                    wx.hideLoading()
                    console.log(res);
                    that.setData({
                        image: res.tempFilePath
                    })

                    wx.setStorage({
                        key: 'pic',
                        data: res.tempFilePath,
                    })

                    wx.getStorage({
                        key: 'isAccu',
                        success: function (res) {
                            console.log("D6");
                            console.log("getStorage(isAccu):" + res.data);
                            if (res.data == false) {
                                console.log("是否精度模式?:" + res.data);
                                console.log("调用that.baidu()");
                                that.baidu()
                            } else if (res.data == true) {
                                console.log("是否精度模式?:" + res.data);
                                console.log("调用that.baidu_accu()");
                                that.baidu_accu()
                            }
                        }
                    })

                    /******************生成后执行的代码********************/
                },
                fail: (res) => {
                    fundebug.notifyError(res);
                    console.log(res);
                    wx.showModal({
                        title: '当前系统版本或机型不支持裁剪',
                        content: '有待微信团队优化, 点击取消自行裁剪, 点击确定识别原图',
                        success:(res)=> {
                            if (res.confirm == true) {
                                wx.hideLoading()
                                console.log(res);
                                
                                that.setData({
                                    image:that.data.image[0]
                                })

                                wx.getStorage({
                                    key: 'isAccu',
                                    success: function (res) {
                                        console.log("D6");
                                        console.log("getStorage(isAccu):" + res.data);
                                        if (res.data == false) {
                                            console.log("是否精度模式?:" + res.data);
                                            console.log("调用that.baidu()");
                                            that.baidu()
                                        } else if (res.data == true) {
                                            console.log("是否精度模式?:" + res.data);
                                            console.log("调用that.baidu_accu()");
                                            that.baidu_accu()
                                        }
                                    }
                                })
                            } else {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        },fail:(res)=> {
                            console.log(res);
                        }

                    })
                }, complete: (res) => {
                    console.log(res);
                }
            },that)
        }, 300))
    },

    /**
     * 设置大小的时候触发的touchStart事件
     * 存数据
     */
    dragStart(e) {
        T_PAGE_X = e.touches[0].pageX
        T_PAGE_Y = e.touches[0].pageY
        CUT_L = this.data.cutL
        CUT_R = this.data.cutR
        CUT_B = this.data.cutB
        CUT_T = this.data.cutT
    },

    /**
     * 设置大小的时候触发的touchMove事件
     * 根据dragType判断类型
     * 4个方向的边线拖拽效果
     * 右下角按钮的拖拽效果
     */
    dragMove(e) {
        var that = this
        var dragType = e.target.dataset.drag
        switch (dragType) {
            case 'right':
                var dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
                if (CUT_R + dragLength < 0) dragLength = -CUT_R
                this.setData({
                    cutR: CUT_R + dragLength
                })
                break;
            case 'left':
                var dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
                if (CUT_L - dragLength < 0) dragLength = CUT_L
                if ((CUT_L - dragLength) > (this.data.cropperW - this.data.cutR)) dragLength = CUT_L - (this.data.cropperW - this.data.cutR)
                this.setData({
                    cutL: CUT_L - dragLength
                })
                break;
            case 'top':
                var dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
                if (CUT_T - dragLength < 0) dragLength = CUT_T
                if ((CUT_T - dragLength) > (this.data.cropperH - this.data.cutB)) dragLength = CUT_T - (this.data.cropperH - this.data.cutB)
                this.setData({
                    cutT: CUT_T - dragLength
                })
                break;
            case 'bottom':
                var dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
                if (CUT_B + dragLength < 0) dragLength = -CUT_B
                this.setData({
                    cutB: CUT_B + dragLength
                })
                break;
            case 'rightBottom':
                var dragLengthX = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
                var dragLengthY = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
                if (CUT_B + dragLengthY < 0) dragLengthY = -CUT_B
                if (CUT_R + dragLengthX < 0) dragLengthX = -CUT_R
                this.setData({
                    cutB: CUT_B + dragLengthY,
                    cutR: CUT_R + dragLengthX
                })
                break;
            default:
                break;
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    baidu_accu: function() {
        console.log("进入baidu_accu()");
        var url
        var strWithN = ""
        var strWithoutN = ""
        var base64
        var that = this
        //   console.log(that.data.picUrl);
        var a = wx.getFileSystemManager()
        if (that.data.isHand == false) {
            url = "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token="
        } else {
            url = "https://aip.baidubce.com/rest/2.0/ocr/v1/handwriting?access_token="
        }
        a.readFile({
            filePath: that.data.image,
            encoding: "base64",
            success: (res) => {
                // console.log(res);
                base64 = res.data

                //   console.log("a:" + base64);

                var q = base64
                wx.showLoading({
                    title: '识别中...',
                    mask: true
                })
                wx.request({
                    url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=qQL514Y31Em0V8pFLajY8CfC&client_secret=LEjRu03p3HUub1t2qlm35Xp6GZ8Pz8tE',
                    success: (res) => {
                        //   console.log(res.data.access_token);
                        access_token = res.data.access_token
                        // console.log(access_token);

                        url = url + access_token
                        console.log("模式:精度模式");
                        console.log("手写开关:" + that.data.isHand);
                        console.log("请求的URL:" + url);
                        wx.request({
                            url: url,
                            method: "POST",
                            header: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            data: {
                                image: encodeURI(q)
                            },
                            success: (res) => {
                                console.log(res);
                                wx.hideLoading()

                                that.setData({
                                    content: res.data.words_result
                                })
                                for (var index = 0; index < that.data.content.length; index++) {
                                    strWithN = strWithN + that.data.content[index].words + " \n "
                                    strWithoutN = strWithoutN + that.data.content[index].words
                                }
                                console.log("有换行:" + strWithN);
                                console.log("无换行:" + strWithoutN);
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
                                    },
                                    fail: (res) => {
                                        console.log(res);
                                    },
                                    complete: (res) => {}
                                })
                                wx.setStorage({
                                    key: 'strWithoutN',
                                    data: strWithoutN,
                                    success: (res) => {
                                        // console.log(res);
                                    },
                                    fail: (res) => {
                                        console.log(res);
                                    },
                                    complete: (res) => {}
                                })

                                wx.navigateTo({
                                    url: '/pages/ocr/ocr',
                                })
                            },
                            fail: (res) => {
                                console.log(res);
                                fundebug.notifyError(res);
                            },
                            complete: (res) => {}
                        })

                    },
                    fail: (res) => {
                        console.log(res);
                        fundebug.notifyError(res);
                    },
                    complete: (res) => {}
                })
            },
            fail: (res) => {
                console.log(res);
            },
            complete: (res) => {}
        })


    },

    baidu: function() {
        console.log("进入baidu");
        var url
        var strWithN = ""
        var strWithoutN = ""
        var base64
        var that = this
        if (that.data.isHand == true) {
            console.log("跳转手写");
            that.baidu_accu()
            return
        } else {
            var language_type = ""
            wx.getStorage({
                key: 'engine',
                success: function(res) {
                    language_type = res.data
                    console.log("语言:" + language_type);
                },
            })
            //   console.log(that.data.picUrl);
            var a = wx.getFileSystemManager()
            url = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token="
            a.readFile({
                filePath: that.data.image,
                encoding: "base64",
                success: (res) => {
                    // console.log(res);
                    base64 = res.data

                    //   console.log("a:" + base64);

                    var q = base64
                    wx.showLoading({
                        title: '识别中...',
                        mask: true
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
                                    detect_language: 'true'
                                },
                                success: (res) => {
                                    console.log(res);
                                    wx.hideLoading()
                                    that.setData({
                                        content: res.data.words_result
                                    })
                                    for (var index = 0; index < that.data.content.length; index++) {
                                        strWithN = strWithN + that.data.content[index].words + " \n "
                                        var s1 = that.data.content[index].words[that.data.content[index].words.length-1]  
                                        console.log(s1);
                                        if((s1>='a'&&s1<='z')||s1==','||s1=='.'||s1=='?'||s1=="!") {
                                            // console.log("s!");
                                            strWithoutN = strWithoutN + that.data.content[index].words+" "
                                        } else{
                                        strWithoutN = strWithoutN + that.data.content[index].words
                                        }
                                    }
                                    console.log("有换行:" + strWithN);
                                    console.log("无换行:" + strWithoutN);
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
                                        },
                                        fail: (res) => {
                                            console.log(res);
                                        },
                                        complete: (res) => {}
                                    })
                                    wx.setStorage({
                                        key: 'strWithoutN',
                                        data: strWithoutN,
                                        success: (res) => {
                                            // console.log(res);
                                        },
                                        fail: (res) => {
                                            console.log(res);
                                        },
                                        complete: (res) => {}
                                    })

                                    wx.navigateTo({
                                        url: '/pages/ocr/ocr',
                                    })
                                },
                                fail: (res) => {
                                    console.log(res);
                                    fundebug.notifyError(res);
                                },
                                complete: (res) => {}
                            })

                        },
                        fail: (res) => {
                            console.log(res);
                            fundebug.notifyError(res);
                        },
                        complete: (res) => {}
                    })
                },
                fail: (res) => {
                    console.log(res);
                },
                complete: (res) => {}
            })

        }
    },

    createTimeStamp: function() {
        return parseInt(new Date().getTime() / 1000) + ''
    },

    Base64_str: function(str) {

        var Base64 = {

            // private property
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

            // public method for encoding
            encode: function(input) {
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
            decode: function(input) {
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
            _utf8_encode: function(string) {
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
            _utf8_decode: function(utftext) {
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
})