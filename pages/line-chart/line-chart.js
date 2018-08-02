// learns/line-chart/line-chart.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
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
        this.createCanvasData();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    createCanvasData: function () {
        var canvasData = {line: [], commFlag: [], xCoordinate: []};

        var lineCount = 3;  //一共三条折线
        var linePointCount = 100;    //每条线20个点
        for (var li = 0; li < lineCount; li++) {
            var line = {
                legend: '图例' + li,
                hidden: (li == 0 ? true: false),
                point: [],
            };
            for (var cnt = 0; cnt < linePointCount; cnt++) {
                // var val = cnt * (li + 1);
                var val = __getNumber();
                line.point.push({
                    value: val,
                    flag: '标签:' + val
                })
            }
            canvasData.line.push(line);
        }

        for (var cnt = 0; cnt < linePointCount; cnt++) {
            canvasData.commFlag.push("公共浮层--" + cnt);
        }
        for (var cnt = 0; cnt < linePointCount; cnt++) {
            canvasData.xCoordinate.push(cnt);
        }

        var Config = require('../../wxChartComponent/line-chart/config-file.js');


        this.setData({
            'canvasData': canvasData,
            "canvasOption": Config.getOption()
        });
        function __getNumber() {
            var x = Math.random();
            var y = parseInt(Math.random() * 10);
            var num = parseInt(x * Math.pow(10, y));
            return num;
        }
    },

    change: function(){
        var option = this.data.canvasOption;
        if(option.seriesColor[0] == '#7587DB'){
            option.seriesColor[0] = '#43b548';
        }else{
            option.seriesColor[0] = '#7587DB';
        }
        this.setData({
            "canvasOption": option
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

    }
})