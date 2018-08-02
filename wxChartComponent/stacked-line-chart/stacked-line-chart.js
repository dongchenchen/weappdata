var ConfigFile = require('config-file.js');
var Handle = require('handle.js');


Component({
    behaviors: [],
    properties: {
        canvasData: {
            type: Object,
            value: ConfigFile.getData(), 
            observer: function (newVal, oldVal) {
                console.log("here: canvasData", newVal, oldVal);
                if (newVal) this.draw();
            } 
        },
        canvasOption: {
            type: Object,
            value: ConfigFile.getOption(),
            observer: function (newVal, oldVal) {
                console.log("here: canvasOption", newVal, oldVal);
                if (newVal) this.draw();
            }
        },
        canvasStyle: {
            type: Object,
            value: ConfigFile.getStyle(),
            observer: function (newVal, oldVal) {
                console.log("here: canvasStyle", newVal, oldVal);
                if (newVal) this.draw();
            }
        }
    },
    data: {
        baseCanvasID: 'wxChartComponent_stackedlinechart_base',
        floatCanvasID: 'wxChartComponent_stackedlinechart_float',
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

            if (!this.chartHandle)
                this.chartHandle = new Handle(this.data, this.baseCtx, this.floatCtx);

            var errorCode = this.chartHandle.draw(this.data);
            if (errorCode == 0) {
                console.log("draw result:", this.chartHandle);
                this.setData({
                    chartStatus: '0',
                    w: this.chartHandle.borderScreen.maxW,
                    h: this.chartHandle.borderScreen.maxH,
                    legend: this.chartHandle.legend
                })
            } else {
                this.setData({
                    chartStatus: ConfigFile.getERRWording(errorCode)
                })
            }
            console.log("draw:", this.chartHandle);
        },

        //点击图例
        tapLegend: function (e) {
            let targetIdx = e.currentTarget.dataset.idx;
            var errorCode = this.chartHandle.tapLegend(targetIdx);
            if (errorCode == 0) {
                this.setData({
                    chartStatus: '0',
                    w: this.chartHandle.borderScreen.maxW,
                    h: this.chartHandle.borderScreen.maxH,
                    legend: this.chartHandle.legend
                })
            } else {
                this.setData({
                    chartStatus: ConfigFile.getERRWording(errorCode)
                })
            }
        },

        bindtouchstart: function (e) {
            this.chartHandle.bindtouchstart(e);
        },
        bindtouchmove: function (e) {
            this.chartHandle.bindtouchmove(e);
        },
        bindtouchend: function (e) {
            this.chartHandle.bindtouchend(e);
        },
    }
});