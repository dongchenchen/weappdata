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
                // console.log("here: canvasOption", newVal, oldVal);
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
        canvasID: 'wxChartComponent_barChart',
        w: '300',
        h: '200',
        chartStatus: '0',
        legend: {show: false}
    }, // 私有数据，可用于模版渲染
    ready: function () {     //在组件布局完成后执行，此时可以获取节点信息
    },

    methods: {
        draw: function () {
            if (!this.ctx)
                this.ctx = wx.createCanvasContext(this.data.canvasID, this);

            if (!this.barChartHandle)
                this.barChartHandle = new Handle(this.data, this.ctx);

            var errorCode = this.barChartHandle.draw(this.data);
            if (errorCode == 0) {
                this.setData({
                    chartStatus: '0',
                    w: this.barChartHandle.drawData.area.screen.maxW,
                    h: this.barChartHandle.drawData.area.screen.maxH,
                    legend: this.barChartHandle.legend
                })
            } else {
                console.error('barChartHandle.draw fail', errorCode);
                this.setData({
                    chartStatus: ConfigFile.getERRWording(errorCode)
                })
            }
            console.log("vk draw:", this.barChartHandle);
        },

        //点击图例
        tapLegend: function (e) {
            let targetIdx = e.currentTarget.dataset.idx;
            var errorCode = this.barChartHandle.tapLegend(targetIdx);
            if (errorCode == 0) {
                this.setData({
                    chartStatus: '0',
                    w: this.barChartHandle.drawData.area.screen.maxW,
                    h: this.barChartHandle.drawData.area.screen.maxH,
                    legend: this.barChartHandle.legend
                })
            } else {
                this.setData({
                    chartStatus: ConfigFile.getERRWording(errorCode)
                })
            }
        },

        bindtouchstart: function (e) {
            var result = this.barChartHandle.bindtouchstart(e);
            this.triggerEvent('touchbar', result);
        },
        bindtouchmove: function (e) {
            this.barChartHandle.bindtouchmove(e);
        },
        bindtouchend: function (e) {
            this.barChartHandle.bindtouchend(e);
        },
    }
});
