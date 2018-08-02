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
        chartStatus: '0',
    }, // 私有数据，可用于模版渲染
    ready: function () {     //在组件布局完成后执行，此时可以获取节点信息
    },

    methods: {
        draw: function () {
            if (!this.chartHandle)
                this.chartHandle = new Handle(this.data);
                
            var errorCode = this.chartHandle.draw(this.data);
            if (errorCode == 0) {
                this.setData({
                    chartStatus: '0',
                    style: this.chartHandle.resultTable.style,
                    header: this.chartHandle.resultTable.header,
                    body: this.chartHandle.resultTable.body,
                })
            } else {
                this.setData({
                    chartStatus: ConfigFile.getERRWording(errorCode)
                })
            }
        },
        
        tapTable: function (e) {
            this.triggerEvent('touchtable', e);
        }
    }
});