//logs.js

var fundebug = require('../../libs/fundebug.0.8.2.min.js')
fundebug.init(
    {
        apikey: "5811e8c7dc9ee21a8380a27164f5d73c6eafbe574f6bdea8f89b7d1aba7c918f",
        silentInject: true
    })


const util = require('../../utils/util.js')
const index = require('../index/index.js')
const app = getApp()
var a
const innerAudioContext = wx.createInnerAudioContext()
var stack
var hasBeen = 0
var left = 0
var duration = 0
Array.prototype.remove = function(obj) {
    for (var i = 0; i < this.length; i++) {
        var temp = this[i];
        if (!isNaN(obj)) {
            temp = i;
        }
        if (temp == obj) {
            for (var j = i; j < this.length; j++) {
                this[j] = this[j + 1];
            }
            this.length = this.length - 1;
        }
    }
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        recordList: [],
        timeName: [],
        isis: true,
        maxlength: 16,
        icon: '/images/icons8-play_filled.png',
        isplay: false,
        time_a_min: 'xx',
        time_a_sec: 'xx',
        time_b_min: 'xx',
        time_b_sec: 'xx',
        currency: 0,
        can: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        innerAudioContext.obeyMuteSwitch = false
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function(event) {

        var that = this
        wx.getStorage({
            key: 'List',
            success: function(res) {
                console.log(res);
                that.setData({
                    recordList: res.data,
                })

                a = that.data.recordList
                for (var id = 0; id < that.data.recordList.length; id++) {
                    // 彩红颜色
                    if (id % 7 == 0) {
                        a[id].color = "#FF0050"
                    } else if (id % 7 == 1) {
                        a[id].color = "#F0883B"
                    } else if (id % 7 == 2) {
                        a[id].color = "#FFDF46"
                    } else if (id % 7 == 3) {
                        a[id].color = "#77DF7D"
                    } else if (id % 7 == 4) {
                        a[id].color = "#538AFF"
                    } else if (id % 7 == 5) {
                        a[id].color = "#71FBFD"
                    } else if (id % 7 == 6) {
                        a[id].color = "#D794E8"
                    }
                }

                if (a.length == 0) {
                    that.setData({
                        isis: true
                    })
                } else {
                    that.setData({
                        isis: false
                    })
                }

                that.setData({
                    timeName: a
                })

            },
            fail: (res) => {
                fundebug.notifyError(res);
                console.log(res);
            },
            complete: (res) => {}
        })

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        innerAudioContext.stop()
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

    getLocalTime: function(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    },

    funct: function(event) {
        var that = this
        var id = event.currentTarget.dataset.id
        that.setData({
            currency: 0
        })
        innerAudioContext.src = that.data.recordList[id].path
        console.log(innerAudioContext.duration);
        console.log(innerAudioContext.src);
        this.setData({
            icon: '/images/icons8-play_filled.png',
            isplay: false,
            time_b_min: '0',
            time_b_sec: '00',
            time_a_sec: '00',
            time_a_min: '0',
        })
        var temp = that.data.timeName;
        if (stack != undefined) {
            if (temp[stack].isPlay != undefined) {
                temp[stack].isPlay = false
            }
        }
        if (temp[id].isPlay == false) {
            temp[id].isPlay = true
        } else {
            temp[id].isPlay = false
        }
        stack = id
        // console.log(temp);
        // console.log("id:" + id);

        that.setData({
            timeName: temp
        })

    },

    xplay: function() {
        var that = this
        that.setData({
            can: false
        })
        if (this.data.isplay == false) {
            this.setData({
                icon: '/images/icons8-pause_filled-ios.png',
                isplay: true
            })
            //逻辑代码
            innerAudioContext.play()

            setTimeout(() => {
                innerAudioContext.currentTime
                innerAudioContext.onTimeUpdate(() => {
                    // console.log(innerAudioContext.duration)  //总时长
                    console.log(innerAudioContext.currentTime) //当前播放进度              
                    hasBeen = innerAudioContext.currentTime
                    left = innerAudioContext.duration - innerAudioContext.currentTime
                    duration = innerAudioContext.duration
                    this.setData({
                        time_b_min: that.getMinutes(left),
                        time_b_sec: that.getSeconds(left),
                        time_a_sec: that.getSeconds(hasBeen),
                        time_a_min: that.getMinutes(hasBeen),
                        currency: (innerAudioContext.currentTime / innerAudioContext.duration) * 100
                    })
                })
            }, 100)

            // console.log(innerAudioContext.duration);
        } else {
            this.setData({
                icon: '/images/icons8-play_filled.png',
                isplay: false
            })
            //逻辑代码
            // console.log(innerAudioContext.duration);
            innerAudioContext.pause()
        }

        innerAudioContext.onEnded(() => {
            this.setData({
                icon: '/images/icons8-play_filled.png',
                isplay: false,
                currency: 100
            })
            innerAudioContext.stop()
        })

    },

    getMinutes: function(du) {
        return parseInt(du / 60).toString()
    },

    getSeconds: function(du) {
        if (parseInt(du % 60) < 10) {
            return ('0' + parseInt(du % 60).toString())
        } else {
            return parseInt(du % 60).toString()
        }
    },

    slided: function(e) {
        console.log(e.detail.value);
        var percent = e.detail.value / 100
        var now = duration * percent
        console.log("now:" + now)
        innerAudioContext.seek(now)
        this.xplay()
    },

    sliding: function() {
        innerAudioContext.pause()
        this.setData({
            icon: '/images/icons8-play_filled.png',
            isplay: false
        })
    },

    choise: function(event) {
        var that = this
        var id = event.currentTarget.dataset.id;
        console.log("id:" + id);
        wx.showActionSheet({
            itemList: ["查看信息", "重命名"],
            success: function(e) {
                if (e.tapIndex == 0) {
                    var show = "录音时间:" + that.getLocalTime(that.data.recordList[id].createTime)
                    wx.showModal({
                        title: '录音信息',
                        content: show,
                        showCancel: false,
                        confirmText: "我知道了"
                    })
                }
                if (e.tapIndex == 1) {
                    var changed = that.data.timeName[id].name
                    wx.navigateTo({
                        url: "/pages/edit/edit?Text=" + changed + "&int=" + id,
                    })
                }
            }
        })
    },

    Delete: function(event) {
        var that = this
        var id = event.currentTarget.dataset.id;
        console.log("id:" + id);
        if (id == a.length - 1) {
            stack = 0
        }
        wx.showModal({
            title: '确认删除此录音',
            content: '此操作没后悔药吃',
            confirmColor: "#FF0000",
            success: (res) => {
                console.log(res);
                if (res.confirm == true) {
                    a.remove(id)
                    wx.setStorage({
                        key: 'List',
                        data: a,
                    })
                    that.onShow()
                }
            },
            fail: (res) => {
                console.log(res);
            },
            complete: (res) => {}
        })

    }
})