Page({

    /**
     * 页面的初始数据
     */
    data: {
        Text: "",
        int: 0,
        maxlength:1023
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            Text: options.Text,
            int: options.int
        })
        if (this.data.int == -1) {
            this.setData({
                maxlength: 1023
            })
        } else {
            this.setData({
                maxlength: 16
            })
        }
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

    OK: function(event) {
        console.log(event);
        var tran = event.detail.value
        console.log("OK");
        let pages = getCurrentPages(); //当前页面
        let prevPage = pages[pages.length - 2]; //上一页面
        if (this.data.int == -1) {
            console.log(this.data.maxlength);
            prevPage.setData({
                message: tran,
                fgx: true
            })
            prevPage.test(tran);
        } else {
            var that = this
            wx.getStorage({
                key: 'List',
                success: function(res) {
                    var a = res.data
                    a[that.data.int].name = tran
                    wx.setStorage({
                        key: 'List',
                        data: a,
                    })
                    prevPage.onShow()
                },
                fail: (res) => {
                    console.log(res);
                },
                complete: (res) => {}
            })


        }

        wx.navigateBack({
            delta: 1,
        })
    }
})