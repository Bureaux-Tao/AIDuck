//logs.js
const util = require('../../utils/util.js')
const index = require('../index/index.js')
const app = getApp()
var a
const innerAudioContext = wx.createInnerAudioContext()
var getTime = wx.createInnerAudioContext()
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
        //获取保存文件
        wx.getSavedFileList({
            success: (res) => {
                console.log(res);
                this.setData({
                    recordList: res.fileList,
                })

                //改名
                a = this.data.recordList
                for (var id = 0; id < this.data.recordList.length; id++) {
                    var timeStamp = this.data.recordList[id].createTime
                    console.log(timeStamp);
                    a[id].createTime = this.getLocalTime(this.data.recordList[id].createTime) + "保存的录音"
                    console.log(a[id].createTime);
                    // 彩红颜色
                    if (id % 7 == 0) {
                        a[id].size = "#FF0050"
                    } else if (id % 7 == 1) {
                        a[id].size = "#F0883B"
                    } else if (id % 7 == 2) {
                        a[id].size = "#FFDF46"
                    } else if (id % 7 == 3) {
                        a[id].size = "#77DF7D"
                    } else if (id % 7 == 4) {
                        a[id].size = "#538AFF"
                    } else if (id % 7 == 5) {
                        a[id].size = "#71FBFD"
                    } else if (id % 7 == 6) {
                        a[id].size = "#D794E8"
                    }

                }

                if (res.fileList.length == 0) {
                    this.setData({
                        isis: true
                    })
                } else {
                    this.setData({
                        isis: false
                    })
                }


                this.setData({
                    timeName: a
                })
            }, fail: (res) => {
                console.log(res);
            },
            complete: (res) => { }
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
            itemList: ["播放","查看信息", "删除"],
            success: function (e) {
                if (e.tapIndex == 0) {
                    console.log("id:" + id);
                    innerAudioContext.stop();
                    innerAudioContext.src = that.data.recordList[id].filePath;
                    innerAudioContext.play()

                    //获取时长
                    a[id].filePath = innerAudioContext.duration
                    console.log("a[filePath]:" + a[id].filePath);
                }
                if (e.tapIndex == 1) {
                    innerAudioContext.src = that.data.recordList[id].filePath;
                    console.log("time:" + innerAudioContext.duration);
                    var show = that.data.timeName[id].createTime + "     录音时长: " + innerAudioContext.duration + " s" + "     「Tips:O秒为不到一秒哦」"
                    wx.showModal({
                        title: '录音信息',
                        content: show,
                        showCancel: false,
                        confirmText: "我知道了"
                    })
                }
                if (e.tapIndex == 2) {
                    wx.getSavedFileList({
                        success: function (res) {
                            if (res.fileList.length > 0) {
                                wx.removeSavedFile({
                                    filePath: res.fileList[id].filePath,
                                    success: (res) => {
                                        console.log(res)
                                        that.onShow()
                                    }, fail: (res) => {
                                        console.log(res)
                                    }, complete: (res) => { }
                                })
                            }
                        }
                    })
                }
            }
        })
    },

    view: function (id) {

    },

    rename: function (id) {

    }
})