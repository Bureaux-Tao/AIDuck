//logs.js
const util = require('../../utils/util.js')
const index = require('../index/index.js')
const app = getApp()
var a
const innerAudioContext = wx.createInnerAudioContext()
var getTime = wx.createInnerAudioContext()
// var List=[]

Array.prototype.remove = function (obj) {
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
        isis: true
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
    onShow: function (event) {

        var that=this
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
                
            },fail:(res)=> {
                console.log(res);
            },complete:(res)=>{}
        })

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

    // play: function (event) {
        
    // },

    getLocalTime: function (nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    },

    select: function (event) {
        var that = this
        var id = event.currentTarget.dataset.id;
        console.log("id:" + id);
        wx.showActionSheet({
            itemList: ["播放","查看信息","重命名","删除"],
            success: function (e) {
                if (e.tapIndex == 0) {
                    console.log("id:" + id);
                    innerAudioContext.stop();
                    innerAudioContext.src = that.data.recordList[id].path;
                    innerAudioContext.play()
                }

                if (e.tapIndex == 1) {
                    innerAudioContext.src = that.data.recordList[id].path;
                    console.log("time:" + innerAudioContext.duration);
                    var show = "录音时间:"+that.getLocalTime(that.data.recordList[id].createTime) + " / 录音时长: " + innerAudioContext.duration + " s /" + " 「Tips:O秒为不到一秒哦」"
                    wx.showModal({
                        title: '录音信息',
                        content: show,
                        showCancel: false,
                        confirmText: "我知道了"
                    })
                }

                if (e.tapIndex == 2) {
                    var changed=that.data.timeName[id].name
                    wx.navigateTo({
                        url: "/pages/edit/edit?Text="+changed + "&int=" + id,
                    })
                }

                if (e.tapIndex == 3) {
                    a.remove(id)
                    wx.setStorage({
                        key: 'List',
                        data: a,
                    })
                    that.onShow()
                }
            }
        })
    }
})