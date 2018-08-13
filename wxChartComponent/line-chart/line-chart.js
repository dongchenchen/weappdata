var ConfigFile = require('config-file.js');
var Handle = require('handle.js');


Component({
    behaviors: [],
    properties: {
        canvasData: {
            type: Object,
            value: ConfigFile.getData(), 
            observer: function (newVal, oldVal) {
                if (newVal) this.draw();
            } 
        },
        canvasOption: {
            type: Object,
            value: ConfigFile.getOption(),
            observer: function (newVal, oldVal) {
                if (newVal) this.draw();
            }
        },
        canvasStyle: {
            type: Object,
            value: ConfigFile.getStyle(),
            observer: function (newVal, oldVal) {
                if (newVal) this.draw();
            }
        }
    },
    data: {
        baseCanvasID: 'wxChartComponent_linechart_base',
        floatCanvasID: 'wxChartComponent_linechart_float',
        w: '300',
        h: '200',
        chartStatus: '0',
        legend: {show: false}
    }, // 私有数据，可用于模版渲染
    ready: function () {     //在组件布局完成后执行，此时可以获取节点信息
    },

    methods: {
        draw: function () {
            if (!this.baseCtx)
                this.baseCtx = wx.createCanvasContext(this.data.baseCanvasID, this);
            if (!this.floatCtx)
                this.floatCtx = wx.createCanvasContext(this.data.floatCanvasID, this);

            if (!this.lineChartHandle)
                this.lineChartHandle = new Handle(this.data, this.baseCtx, this.floatCtx);

            var errorCode = this.lineChartHandle.draw(this.data);
            if (errorCode == 0) {
                this.setData({
                    chartStatus: '0',
                    w: this.lineChartHandle.borderScreen.maxW,
                    h: this.lineChartHandle.borderScreen.maxH,
                    legend: this.lineChartHandle.legend
                })
            } else {
                this.setData({
                    chartStatus: ConfigFile.getERRWording(errorCode)
                })
            }
            // console.log("draw:", this.lineChartHandle);
        },

        //点击图例
        tapLegend: function (e) {
            let targetIdx = e.currentTarget.dataset.idx;
            var errorCode = this.lineChartHandle.tapLegend(targetIdx);
            if (errorCode == 0) {
                this.setData({
                    chartStatus: '0',
                    w: this.lineChartHandle.borderScreen.maxW,
                    h: this.lineChartHandle.borderScreen.maxH,
                    legend: this.lineChartHandle.legend
                })
            } else {
                this.setData({
                    chartStatus: ConfigFile.getERRWording(errorCode)
                })
            }
        },

        bindtouchstart: function (e) {
            this.lineChartHandle.bindtouchstart(e);
        },
        bindtouchmove: function (e) {
            this.lineChartHandle.bindtouchmove(e);
        },
        bindtouchend: function (e) {
            this.lineChartHandle.bindtouchend(e);
        },
    }
});