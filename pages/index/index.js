//index.js
//获取应用实例

var fundebug = require('../../libs/fundebug.0.8.2.min.js')
fundebug.init(
    {
        apikey: "5811e8c7dc9ee21a8380a27164f5d73c6eafbe574f6bdea8f89b7d1aba7c918f",
        silentInject: true
    })


const app = getApp()
var utilMd5 = require('../../utils/md5utf-8.js')
var plugin = requirePlugin("WechatSI")
var manager = plugin.getRecordRecognitionManager()
var _animation;
var _animationIndex
const _ANIMATION_TIME = 500;
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext()
const bgm = wx.createInnerAudioContext()
var _loadImagePathIndex = 0;
var _animationIntervalId;
var dirc = 1;
var List = []
var json = {
    name: "",
    path: "",
    createTime: ""
}
const options = {
    duration: 60000,
    sampleRate: 16000,
    numberOfChannels: 1,
    encodeBitRate: 36000,
    format: 'mp3',
    frameSize: 50
};
var option1 = {
    duration: 60000,
    lang: "zh_CN"
};
var option2 = {
    duration: 60000,
    lang: "en_US"
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        animation: '',
        src: "/images/cs_wheel.png",
        iconSrc1: "/images/metal.jpg",
        iconSrc2: "/images/metal.jpg",
        iconSrc3: "/images/metal.jpg",
        iconSrc4: "/images/metal.jpg",
        biRecord: "/images/icons8-record.png",
        biStop: "/images/icons8-stop.png",
        biStart: "/images/icons8-play.png",
        biPause: "/images/icons8-pause.png",
        margintop1: 50,
        margintop2: 50,
        margintop3: 50,
        margintop4: 50,
        bs1: " 4rpx 4rpx 4rpx 4rpx #575757",
        bs2: " 4rpx 4rpx 4rpx 4rpx #575757",
        bs3: " 4rpx 4rpx 4rpx 4rpx #575757",
        bs4: " 4rpx 4rpx 4rpx 4rpx #575757",
        Switch1: false,
        Switch2: false,
        Switch3: false,
        Switch4: false,
        fc1: "black",
        fc2: "#ccc",
        fc3: "#ccc",
        fc4: "#ccc",
        tempVoice: "",
        trans_bg_cn: "/images/knob.jpg",
        bs_t_cn: "0rpx 20rpx 20rpx 0rpx",
        trans_bg_en: "/images/knob.jpg",
        bs_t_en: "0rpx 20rpx 20rpx 0rpx",
        trans_bg_voi: "/images/knob.jpg",
        bs_t_voi: "0rpx 20rpx 20rpx 0rpx",
        message: "轻击record录音, 按住「中文听写」并说话识别中文, 按住「英文听写」并说话识别英文",
        translate: "",
        fgx: false,
        filter: "",
        isCN: true,
        status: 1,
        fy: "普通话"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            tempVoice: ""
        })
        bgm.src = '/audios/switch.mp3';
        var that = this
        wx.getStorage({
            key: 'isPTH',
            success: function(res) {
                if (res.data == true) {
                    option1.lang = 'zh_CN'
                    that.setData({
                        fy: "普通话"
                    })
                } else {
                    option1.lang = 'zh_HK'
                    that.setData({
                        fy: "粤语"
                    })
                }
            },
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this
        wx.getStorage({
            key: 'List',
            success: function(res) {
                List = res.data
            },
        })

        _animation = wx.createAnimation({
            duration: _ANIMATION_TIME,
            timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
            delay: 0,
            transformOrigin: '50% 50% 0'
        })
        this.StartREC_cn();
        this.StopREC_cn();

        wx.getStorage({
            key: 'isPTH',
            success: function(res) {
                if (res.data == true) {
                    option1.lang = 'zh_CN'
                    that.setData({
                        fy: "普通话"
                    })
                } else {
                    option1.lang = 'zh_HK'
                    that.setData({
                        fy: "粤语"
                    })
                }
            },
        })
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

    Record: function() {
        if (this.data.Switch1 == false && this.data.Switch3 == false) {
            wx.vibrateShort({
                success: (res) => {
                    console.log(res);
                },
                fail: (res) => {
                    console.log(res);
                },
                complete: (res) => {}
            })
            dirc = -1;
            console.log("l1");
            this.setData({
                Switch1: true,
                Switch2: false,
                Switch3: false,
                Switch4: false,
                iconSrc1: "/images/metal_dark.jpg",
                iconSrc2: "/images/metal.jpg",
                iconSrc3: "/images/metal.jpg",
                iconSrc4: "/images/metal.jpg",
                biRecord: "/images/icons8-record 2.png",
                biStop: "/images/icons8-stop.png",
                biStart: "/images/icons8-play.png",
                biPause: "/images/icons8-pause_filled.png",
                margintop1: 59,
                margintop2: 50,
                margintop3: 50,
                margintop4: 50,
                bs1: " 0 0 0 0",
                bs2: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs3: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs4: " 4rpx 4rpx 4rpx 4rpx #575757",
                fc1: "black",
                fc2: "black",
                fc3: "#ccc",
                fc4: "black",
                message: "Recording..."
            })
            bgm.play();
            this.startAnimationInterval();
            /**************代码区***************/
            recorderManager.start(options);
            recorderManager.onStart(() => {
                console.log('recorder start')
            })
            /**************代码区***************/

        }
    },

    Stop: function() {
        if (this.data.tempVoice != "" || this.data.Switch1 != false) {
            wx.vibrateShort({
                success: (res) => {
                    console.log(res);
                },
                fail: (res) => {
                    console.log(res);
                },
                complete: (res) => {}
            })
            console.log("l2");
            /**************代码区***************/
            if (this.data.Switch1 == true) {
                bgm.play();
                recorderManager.stop();
                recorderManager.onStop((res) => {
                    console.log('recorder stop', res)
                    var TF = res.tempFilePath;
                    this.setData({
                        tempVoice: TF
                    })
                    console.log("tempVoice-Stop:" + this.data.tempVoice);
                    innerAudioContext.src = this.data.tempVoice;
                })
            }
            if (this.data.Switch3 == true) {
                bgm.play();
                innerAudioContext.stop();
                innerAudioContext.onStop(() => {
                    console.log('播放停止')
                })
                innerAudioContext.onError((res) => {
                    console.log(res.errMsg)
                    console.log(res.errCode)
                })
            }

            /**************代码区***************/
            this.setData({
                Switch1: false,
                Switch2: true,
                Switch3: false,
                Switch4: false,
                iconSrc1: "/images/metal.jpg",
                iconSrc2: "/images/metal_dark.jpg",
                iconSrc3: "/images/metal.jpg",
                iconSrc4: "/images/metal.jpg",
                biStop: "/images/icons8-stop_filled.png",
                biRecord: "/images/icons8-record.png",
                biStart: "/images/icons8-play.png",
                biPause: "/images/icons8-pause.png",
                margintop1: 50,
                margintop2: 59,
                margintop3: 50,
                margintop4: 50,
                bs1: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs2: " 0 0 0 0",
                bs3: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs4: " 4rpx 4rpx 4rpx 4rpx #575757",
                fc1: "black",
                fc2: "black",
                fc3: "black",
                fc4: "black",
                message: "轻击record录音, 按住「中文听写」并说话识别中文, 按住「英文听写」并说话识别英文"
            })
            this.stopAnimationInterval();

            var that = this;
            setTimeout(function() {
                //要延时执行的代码
                console.log("timeout")
                bgm.play();
                that.setData({
                    Switch1: false,
                    Switch2: false,
                    Switch3: false,
                    Switch4: false,
                    iconSrc1: "/images/metal.jpg",
                    iconSrc2: "/images/metal.jpg",
                    iconSrc3: "/images/metal.jpg",
                    iconSrc4: "/images/metal.jpg",
                    biStop: "/images/icons8-stop.png",
                    biRecord: "/images/icons8-record.png",
                    biStart: "/images/icons8-play.png",
                    biPause: "/images/icons8-pause.png",
                    margintop1: 50,
                    margintop2: 50,
                    margintop3: 50,
                    margintop4: 50,
                    bs1: " 4rpx 4rpx 4rpx 4rpx #575757",
                    bs2: " 4rpx 4rpx 4rpx 4rpx #575757",
                    bs3: " 4rpx 4rpx 4rpx 4rpx #575757",
                    bs4: " 4rpx 4rpx 4rpx 4rpx #575757"
                })
            }, 200) //延迟时间 这里是0.2秒
        }
    },
    Start: function() {
        if (this.data.Switch3 == false && this.data.Switch1 == false && this.data.tempVoice != "") {
            wx.vibrateShort({
                success: (res) => {
                    console.log(res);
                },
                fail: (res) => {
                    console.log(res);
                },
                complete: (res) => {}
            })
            bgm.play();
            innerAudioContext.src = this.data.tempVoice;
            dirc = 1;
            console.log("l3");
            this.setData({
                Switch1: false,
                Switch2: false,
                Switch3: true,
                Switch4: false,
                iconSrc1: "/images/metal.jpg",
                iconSrc2: "/images/metal.jpg",
                iconSrc3: "/images/metal_dark.jpg",
                iconSrc4: "/images/metal.jpg",
                biStart: "/images/icons8-play 2.png",
                biRecord: "/images/icons8-record.png",
                biStop: "/images/icons8-stop.png",
                biPause: "/images/icons8-pause.png",
                margintop1: 50,
                margintop2: 50,
                margintop3: 59,
                margintop4: 50,
                bs1: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs2: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs3: " 0 0 0 0",
                bs4: " 4rpx 4rpx 4rpx 4rpx #575757",
                fc1: "#ccc",
                fc2: "black",
                fc3: "black",
                fc4: "black",
                message: "Playing..."
            })
            this.startAnimationInterval();
            /**************代码区***************/
            // innerAudioContext.autoplay = true;
            innerAudioContext.play();
            innerAudioContext.onPlay(() => {
                console.log('开始播放')
            })
            innerAudioContext.onEnded(() => {
                this.Stop()
            })
            innerAudioContext.onError((res) => {
                console.log(res.errMsg)
                console.log(res.errCode)
            })

            /**************代码区***************/

        }

    },

    Pause: function() {
        if (this.data.Switch3 == false && this.data.Switch1 == true && this.data.Switch2 == false && this.data.Switch4 == false) {
            wx.vibrateShort({
                success: (res) => {
                    console.log(res);
                },
                fail: (res) => {
                    console.log(res);
                },
                complete: (res) => {}
            })
            console.log("l4_3");
            bgm.play();
            this.setData({
                Switch1: true,
                Switch2: false,
                Switch3: false,
                Switch4: true,
                iconSrc1: "/images/metal_dark.jpg",
                iconSrc2: "/images/metal.jpg",
                iconSrc3: "/images/metal.jpg",
                iconSrc4: "/images/metal_dark.jpg",
                biPause: "/images/icons8-pause_filled.png",
                biRecord: "/images/icons8-record.png",
                biStop: "/images/icons8-stop.png",
                biStart: "/images/icons8-play.png",
                margintop1: 59,
                margintop2: 50,
                margintop3: 50,
                margintop4: 59,
                bs1: " 0 0 0 0",
                bs2: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs3: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs4: " 0 0 0 0",
                fc1: "black",
                fc2: "black",
                fc3: "#ccc",
                fc4: "black",
                message: "Pause. Tap again to resume"
            })
            this.stopAnimationInterval();
            /**************代码区***************/
            recorderManager.pause();
            recorderManager.onPause(() => {
                console.log('recorder pause')
            })
            /**************代码区***************/
        } else if (this.data.Switch3 == false && this.data.Switch1 == true && this.data.Switch2 == false && this.data.Switch4 == true) {
            wx.vibrateShort({
                success: (res) => {
                    console.log(res);
                },
                fail: (res) => {
                    console.log(res);
                },
                complete: (res) => {}
            })
            console.log("l4_4");
            bgm.play();
            this.setData({
                Switch1: true,
                Switch2: false,
                Switch3: false,
                Switch4: false,
                iconSrc1: "/images/metal_dark.jpg",
                iconSrc2: "/images/metal.jpg",
                iconSrc3: "/images/metal.jpg",
                iconSrc4: "/images/metal.jpg",
                biPause: "/images/icons8-pause.png",
                biRecord: "/images/icons8-record 2.png",
                biStop: "/images/icons8-stop.png",
                biStart: "/images/icons8-play.png",
                margintop1: 59,
                margintop2: 50,
                margintop3: 50,
                margintop4: 50,
                bs1: " 0 0 0 0",
                bs2: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs3: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs4: " 4rpx 4rpx 4rpx 4rpx #575757",
                fc1: "black",
                fc2: "black",
                fc3: "#ccc",
                fc4: "black",
                message: "Recording..."
            })
            this.startAnimationInterval();
            /**************代码区***************/
            recorderManager.resume();
            /**************代码区***************/
        }
        if (this.data.Switch3 == true && this.data.Switch1 == false && this.data.Switch2 == false && this.data.Switch4 == false && this.data.tempVoice != "") {
            wx.vibrateShort({
                success: (res) => {
                    console.log(res);
                },
                fail: (res) => {
                    console.log(res);
                },
                complete: (res) => {}
            })
            bgm.play();
            console.log("l4_1");
            this.setData({
                Switch1: false,
                Switch2: false,
                Switch3: true,
                Switch4: true,
                iconSrc1: "/images/metal.jpg",
                iconSrc2: "/images/metal.jpg",
                iconSrc3: "/images/metal_dark.jpg",
                iconSrc4: "/images/metal_dark.jpg",
                biPause: "/images/icons8-pause_filled.png",
                biRecord: "/images/icons8-record.png",
                biStop: "/images/icons8-stop.png",
                biStart: "/images/icons8-play 2.png",
                margintop1: 50,
                margintop2: 50,
                margintop3: 59,
                margintop4: 59,
                bs1: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs2: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs3: " 0 0 0 0",
                bs4: " 0 0 0 0",
                fc1: "#ccc",
                fc2: "black",
                fc3: "black",
                fc4: "black",
                message: "Pause. Tap again to resume"
            })
            this.stopAnimationInterval();
            /**************代码区***************/
            innerAudioContext.pause();
            innerAudioContext.onPause(() => {
                console.log('播放暂停')
            })
            innerAudioContext.onError((res) => {
                console.log(res.errMsg)
                console.log(res.errCode)
            })

            /**************代码区***************/
        } else if (this.data.Switch3 == true && this.data.Switch1 == false && this.data.Switch2 == false && this.data.Switch4 == true && this.data.tempVoice != "") {
            wx.vibrateShort({
                success: (res) => {
                    console.log(res);
                },
                fail: (res) => {
                    console.log(res);
                },
                complete: (res) => {}
            })
            bgm.play();
            console.log("l4_2");
            var that = this;
            that.setData({
                Switch1: false,
                Switch2: false,
                Switch3: true,
                Switch4: false,
                iconSrc1: "/images/metal.jpg",
                iconSrc2: "/images/metal.jpg",
                iconSrc3: "/images/metal_dark.jpg",
                iconSrc4: "/images/metal.jpg",
                biStop: "/images/icons8-stop.png",
                biRecord: "/images/icons8-record.png",
                biStart: "/images/icons8-play 2.png",
                biPause: "/images/icons8-pause.png",
                margintop1: 50,
                margintop2: 50,
                margintop3: 59,
                margintop4: 50,
                bs1: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs2: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs3: " 0rpx 0rpx 0rpx 0rpx",
                bs4: " 4rpx 4rpx 4rpx 4rpx #575757",
                message: "Playing..."
            })
            /**************代码区***************/
            innerAudioContext.play();
            this.startAnimationInterval();
            /**************代码区***************/
        }
    },
    rotateAni: function(n) {

        _animation.rotate(-120 * dirc * (n)).step()
        this.setData({
            animation: _animation.export()
        })
    },

    startAnimationInterval: function() {
        var that = this;
        that.rotateAni(++_loadImagePathIndex); // 进行一次旋转
        _animationIntervalId = setInterval(function() {
            that.rotateAni(++_loadImagePathIndex);
        }, _ANIMATION_TIME); // 没间隔_ANIMATION_TIME进行一次旋转
    },

    stopAnimationInterval: function() {
        if (_animationIntervalId > 0) {
            clearInterval(_animationIntervalId);
            _animationIntervalId = 0;
        }
    },

    createNonceStr: function() {
        return Math.round(Math.random() * 100);
    },

    createTimeStamp: function() {
        return parseInt(new Date().getTime() / 1000) + ''
    },

    StartREC_cn: function() {
        manager.start(option1);
        manager.onStart = function(res) {
            console.log("成功开始录音识别", res)
        }
        manager.onRecognize = function(res) {
            console.log("current result1:", res.result)
        }
    },

    StopREC_cn: function() {
        var that = this
        manager.stop();
        manager.onStop = function(res) {
            console.log("record file path", res.tempFilePath)
            that.setData({
                tempVoice: res.tempFilePath,
                Switch1: false,
                Switch2: false,
                Switch3: false,
                Switch4: false,
                iconSrc1: "/images/metal.jpg",
                iconSrc2: "/images/metal.jpg",
                iconSrc3: "/images/metal.jpg",
                iconSrc4: "/images/metal.jpg",
                biStop: "/images/icons8-stop.png",
                biRecord: "/images/icons8-record.png",
                biStart: "/images/icons8-play.png",
                biPause: "/images/icons8-pause.png",
                margintop1: 50,
                margintop2: 50,
                margintop3: 50,
                margintop4: 50,
                bs1: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs2: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs3: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs4: " 4rpx 4rpx 4rpx 4rpx #575757",
                fc1: "black",
                fc2: "black",
                fc3: "black",
                fc4: "black",
            })
            console.log("...TV:" + that.data.tempVoice);
            console.log("result:", res.result)
            if (res.result == "") {
                wx.showToast({
                    title: "说话鸭",
                    icon: 'success',
                    image: '/images/no_voice.png',
                    duration: 1000,
                    success: function(res) {

                    },
                    fail: function(res) {
                        console.log(res);
                    }
                });
            }
            that.setData({
                message: res.result.substring(0, res.result.length - 1)
            })
            console.log("翻译前(cn_en):" + that.data.message);
            that.setData({
                fgx: true,
                isCN: false
            })
            setTimeout(function() {
                //要延时执行的代码
                console.log("timeout_trans")
                plugin.translate({
                    lfrom: "zh_CN",
                    lto: "en_US",
                    content: that.data.message,
                    success: function(res) {
                        if (res.retcode == 0) {
                            console.log("翻译后(cn_en):", res.result)
                            that.setData({
                                translate: res.result,
                                fgx: true
                            })
                        } else {
                            console.warn("翻译失败", res)
                        }
                    },
                    fail: function(res) {
                        fundebug.notifyError(res);
                        console.log("网络失败", res)
                    }
                })
            }, 500)
        }
        manager.onError = function(res) {
            console.error("error msg", res.msg)
        }
        manager.onRecognize = function(res) {
            console.log("current result2:", res.result)
            that.setData({
                message: res.result.substring(0, res.result.length - 1)
            })
        }
    },

    cnStart: function() {
        if (this.data.Switch1 == true) {
            wx.showModal({
                title: '翻译与录音无法同时进行',
                content: '请先「Stop」结束录音后按住「中文听写」/「英文听写」并说话进行实时翻译',
                showCancel: false,
                confirmText: "我知道了",
            })
            if (this.data.Switch4 == false) {
                this.Pause();
            }
            return;
        }
        wx.vibrateShort({
            success: (res) => {
                console.log(res);
            },
            fail: (res) => {
                console.log(res);
            },
            complete: (res) => {}
        })
        this.setData({
            trans_bg_cn: "/images/knob_tap.jpg",
            bs_t_cn: "0rpx 7rpx 7rpx 0rpx",
            message: "Recording..."
        })
        this.StartREC_cn();
        this.startAnimationInterval();
        bgm.play();
    },

    cnEnd: function() {
        if (this.data.Switch1 == true) {
            return;
        }
        this.setData({
            trans_bg_cn: "/images/knob.jpg",
            bs_t_cn: "0rpx 20rpx 20rpx 0rpx",
        })
        this.StopREC_cn();
        this.stopAnimationInterval();
        bgm.play();
    },

    StartREC_en: function() {
        manager.start(option2);
        manager.onStart = function(res) {
            console.log("成功开始录音识别", res)
        }
        manager.onRecognize = function(res) {
            console.log("current result3:", res.result)
        }
    },

    StopREC_en: function() {
        var that = this
        manager.stop();
        manager.onStop = function(res) {
            console.log("record file path", res.tempFilePath)
            that.setData({
                tempVoice: res.tempFilePath,
                Switch1: false,
                Switch2: false,
                Switch3: false,
                Switch4: false,
                iconSrc1: "/images/metal.jpg",
                iconSrc2: "/images/metal.jpg",
                iconSrc3: "/images/metal.jpg",
                iconSrc4: "/images/metal.jpg",
                biStop: "/images/icons8-stop.png",
                biRecord: "/images/icons8-record.png",
                biStart: "/images/icons8-play.png",
                biPause: "/images/icons8-pause.png",
                margintop1: 50,
                margintop2: 50,
                margintop3: 50,
                margintop4: 50,
                bs1: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs2: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs3: " 4rpx 4rpx 4rpx 4rpx #575757",
                bs4: " 4rpx 4rpx 4rpx 4rpx #575757",
                fc1: "black",
                fc2: "black",
                fc3: "black",
                fc4: "black",
            })
            console.log("...TV:" + that.data.tempVoice);
            console.log("result:", res.result)
            if (res.result == "") {
                wx.showToast({
                    title: "说话鸭",
                    icon: 'success',
                    image: '/images/no_voice.png',
                    duration: 1000,
                    success: function(res) {

                    },
                    fail: function(res) {
                        console.log(res);
                    }
                });
            }
            that.setData({
                message: res.result.substring(0, res.result.length - 1)
            })
            console.log("翻译前(en_cn):" + that.data.message);
            that.setData({
                fgx: true,
                isCN: true
            })
            setTimeout(function() {
                //要延时执行的代码
                console.log("timeout_trans")
                plugin.translate({
                    lfrom: "en_US",
                    lto: "zh_CN",
                    content: that.data.message,
                    success: function(res) {
                        if (res.retcode == 0) {
                            console.log("翻译后(en_cn):", res.result)
                            that.setData({
                                translate: res.result,
                                fgx: true
                            })
                        } else {
                            console.warn("翻译失败", res)
                        }
                    },
                    fail: function(res) {
                        fundebug.notifyError(res);
                        console.log("网络失败", res)
                    }
                })
            }, 500)


        }
        manager.onError = function(res) {
            console.error("error msg", res.msg)
        }
        manager.onRecognize = function(res) {
            console.log("current result4:", res.result)
            that.setData({
                message: res.result.substring(0, res.result.length - 1)
            })
        }
    },

    enStart: function() {
        if (this.data.Switch1 == true) {
            wx.showModal({
                title: '翻译与录音无法同时进行',
                content: '请先「Stop」结束录音后按住「中文听写」/「英文听写」并说话进行实时翻译',
                showCancel: false,
                confirmText: "我知道了",
            })
            if (this.data.Switch4 == false) {
                this.Pause();
            }
            return;
        }
        wx.vibrateShort({
            success: (res) => {
                console.log(res);
            },
            fail: (res) => {
                console.log(res);
            },
            complete: (res) => {}
        })
        this.setData({
            trans_bg_en: "/images/knob_tap.jpg",
            bs_t_en: "0rpx 7rpx 7rpx 0rpx",
            message: "Recording..."
        })
        this.StartREC_en();
        this.startAnimationInterval();
        bgm.play();
    },

    enEnd: function() {
        if (this.data.Switch1 == true) {
            return;
        }
        this.setData({
            trans_bg_en: "/images/knob.jpg",
            bs_t_en: "0rpx 20rpx 20rpx 0rpx",
        })
        this.StopREC_en();
        this.stopAnimationInterval();
        bgm.play();
    },

    voiceMake: function() {
        if (this.data.Switch1 == true) {
            wx.showModal({
                title: '翻译与录音无法同时进行',
                content: '请先「Stop」结束录音后按住「中文听写」/「英文听写」进行实时翻译',
                showCancel: false,
                confirmText: "我知道了",
            })
            if (this.data.Switch4 == false) {
                this.Pause();
            }
            return;
        }
        wx.vibrateShort({
            success: (res) => {
                console.log(res);
            },
            fail: (res) => {
                console.log(res);
            },
            complete: (res) => {}
        })
        var that = this
        that.setData({
            trans_bg_voi: "/images/knob_tap.jpg",
            bs_t_voi: "0rpx 7rpx 7rpx 0rpx",
        })
        bgm.play();
        /**************代码***************/
        var lan = ""
        if (that.data.isCN == true) {
            lan = "zh_CN"
        } else {
            lan = "en_US"
        }
        plugin.textToSpeech({
            lang: lan,
            tts: true,
            content: that.data.translate,
            success: function(res) {
                console.log("succ tts", res.filename)
                var fan = wx.createInnerAudioContext()
                fan.src = res.filename
                fan.play()
                that.StartREC_cn();
                that.StopREC_cn();
            },
            fail: function(res) {
                console.log("fail tts", res)
                wx.showToast({
                    title: "不港怎么翻译鸭",
                    icon: 'success',
                    image: '/images/no_voice.png',
                    duration: 1500,
                    success: function(res) {

                    },
                    fail: function(res) {
                        console.log(res);
                    }
                })
            }
        })
        /**************代码***************/
        setTimeout(function() {
            console.log("timeout");
            //要延时执行的代码
            that.setData({
                trans_bg_voi: "/images/knob.jpg",
                bs_t_voi: "0rpx 20rpx 20rpx 0rpx",
            })
        }, 50)
    },

    copy: function() {
        var that = this
        if (that.data.Switch1 == true || that.data.Switch3 == true) {
            return
        }
        wx.showActionSheet({
            itemList: ['复制转换文字', '复制翻译文字', '编辑转换文字'],
            success: function(e) {
                if (e.tapIndex == 0) {
                    wx.setClipboardData({
                        data: that.data.message,
                    })
                }
                if (e.tapIndex == 1) {
                    wx.setClipboardData({
                        data: that.data.translate,
                    })
                }
                if (e.tapIndex == 2) {
                    var pas = that.data.message
                    console.log("pas:" + pas);
                    var int = 0 - 1
                    console.log(int);
                    wx.navigateTo({
                        url: "/pages/edit/edit?Text=" + pas + "&int=" + int,
                    })
                }
            }
        })
    },

    showSaveFileToast: function() {
        var that = this
        wx.showModal({
            title: '保存当前录音',
            content: '录音将被保存到「保存记录中」',
            success: (res) => {
                if (that.data.Switch1 == true) {
                    wx.showModal({
                        title: '正在录音中',
                        content: '请先结束录音再保存',
                        showCancel: false
                    })
                    return
                }
                console.log(res);
                if (res.confirm == true) {
                    if (this.data.tempVoice != "") {
                        this.saveRecord();
                    } else {
                        wx.showToast({
                            title: '先录音鸭',
                            image: "/images/no_voice.png"
                        })
                    }
                }
            },
            fail: (res) => {
                console.log(res);
            },
            complete: (res) => {}
        })
    },

    getLocalTime: function(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    },

    saveRecord: function() {

        wx.saveFile({
            tempFilePath: this.data.tempVoice,
            success: (res) => {
                console.log(res);
                var shit = res.savedFilePath
                console.log(shit)
                wx.getSavedFileInfo({
                    filePath: shit,
                    success: (res) => {
                        console.log(res);
                        var json = {
                            name: this.getLocalTime(res.createTime) + "保存的录音",
                            color: "",
                            path: shit,
                            createTime: res.createTime,
                            isPlay: false
                        }
                        List.push(json)
                        console.log("List.length:" + List.length);
                        wx.setStorage({
                            key: 'List',
                            data: List,
                            success: (res) => {
                                console.log(res);
                                wx.showToast({
                                    title: '保存成功!',
                                })
                            },
                            fail: (res) => {
                                console.log(res);
                            },
                            complete: (res) => {}
                        })
                    },
                    fail: (res) => {
                        fundebug.notifyError(res);
                        console.log(res);
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

    fy: function() {
        wx.showModal({
            title: '切换中文听写方言',
            content: '当前支持普通话和粤语',
            cancelText: '普通话',
            confirmText: '粤语',
            cancelColor: "#000000",
            confirmColor: "#000000",
            success: (res) => {
                console.log(res);
                if (res.cancel == true) {
                    wx.setStorage({
                        key: 'isPTH',
                        data: true,
                    })
                    this.setData({
                        fy: '普通话'
                    })
                    option1.lang = "zh_CN"
                } else {
                    wx.setStorage({
                        key: 'isPTH',
                        data: false,
                    })
                    this.setData({
                        fy: '粤语'
                    })
                    option1.lang = "zh_HK"
                }
            },
            fail: (res) => {
                console.log(res);
            },
            complete: (res) => {}
        })
    }
})