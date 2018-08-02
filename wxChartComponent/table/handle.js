var Utils = require('../utils.js');

var DEFINE_ERR = -1;
var DEFINE_PARAMETER_ERROR = -2;
var DEFINE_GET_SYSTEM_SIZE_ERROR = -1001;
var DEFINE_PIE_EMPTY_ERROR = -3;

module.exports = Handle;

function Handle(componentData) {
    this.componentData = {
        data: componentData.canvasData,
        option: componentData.canvasOption,
        style: componentData.canvasStyle,
    };
}

Handle.prototype.draw = function (componentData) {
    if (componentData) {
        this.componentData = {
            data: componentData.canvasData,
            option: componentData.canvasOption,
            style: componentData.canvasStyle,
        };
    }
    this.resultTable = {
        header: [],
        body: [],
        style: {},
    };
    this._drawNoSortFunc();
    return 0;
};


Handle.prototype._drawNoSortFunc = function () {
    //1. 处理header:
    let headertData = this.componentData.data.header;
    for (var cnt = 0; cnt < headertData.length; cnt++) {
        this.resultTable.header.push(this._getContentItem(headertData[cnt], 'header'));
    }

    //2. 处理body:
    let bodyData = this.componentData.data.body;

    let rowBgColor = this.componentData.option.rowBackgroundColor;
    let option = this.componentData.option;

    for (var ridx = 0; ridx < bodyData.length; ridx++) {
        var row = bodyData[ridx];
        this.resultTable.body[ridx] = [];
        for (var cidx = 0; cidx < row.length; cidx++) {
            //2.0 合并各个样式
            var ceil = this._getContentItem(row[cidx], 'body');

            //2.1处理body背景颜色
            if (rowBgColor || rowBgColor.length > 0) {
                ceil.mergeStyle.backgroundColor = rowBgColor[ridx % rowBgColor.length];
                ceil.cssStyle = Utils.toCssStyle(ceil.mergeStyle);
            }

            //2.2数据规整
            if (ceil.type == 'number') {
                ceil._content = Utils.deepCopy(ceil.content);
                ceil.content = Utils.formatNumber(ceil.content, option);
            }
            this.resultTable.body[ridx].push(ceil);
        }
    }

    //4. 处理颜色表格
    this._tableToColor();

    //3. 处理 style
    this.resultTable.style.table = Utils.toCssStyle(this.componentData.style.table);
    this.resultTable.style.header = Utils.toCssStyle(this.componentData.style.header);
    this.resultTable.style.body = Utils.toCssStyle(this.componentData.style.body);
};
Handle.prototype._tableToColor = function () {
    let valueToColor = this.componentData.option.valueToColor;
    if (valueToColor == undefined) return;

    //0.处理参数
    if (isNaN(valueToColor.rowStart)) valueToColor.rowStart = 0;
    if (isNaN(valueToColor.rowEnd)) valueToColor.rowEnd = this.resultTable.body.length;

    if (isNaN(valueToColor.colStart)) valueToColor.colStart = 0;
    if (isNaN(valueToColor.colEnd)) valueToColor.colEnd = this.resultTable.body[0].length;

    //1.查询数据个数
    var valueList = [];
    for (var ridx = valueToColor.rowStart; ridx < valueToColor.rowEnd; ridx++) {
        for (var cidx = valueToColor.colStart; cidx < valueToColor.colEnd; cidx++) {
            var ceil = this.resultTable.body[ridx][cidx];

            if (ceil.type != 'number') continue;
            valueList.push(ceil._content);
        }
    }

    valueList.sort();
    var valueSort = [];
    for (var cnt = 0; cnt < valueList.length; cnt++) {
        if (cnt == 0 || valueList[cnt] != valueList[cnt - 1]) valueSort.push(valueList[cnt]);
    }
    
    //2.获取对应的颜色
    var colorArray = this._gradientColors(valueToColor.colorStart, valueToColor.colorEnd, valueSort.length);
    
    //3.放置颜色
      for (var ridx = valueToColor.rowStart; ridx < valueToColor.rowEnd; ridx++) {
        for (var cidx = valueToColor.colStart; cidx < valueToColor.colEnd; cidx++) {
            var ceil = this.resultTable.body[ridx][cidx];

            if (ceil.type != 'number') continue;
            var idx = valueSort.indexOf(ceil._content);

            ceil.mergeStyle.backgroundColor = colorArray[idx];
            ceil.cssStyle = Utils.toCssStyle(ceil.mergeStyle);
        }
    }
};
Handle.prototype._getContentItem = function (target, kind) {
    var styleObj = {};

    //0. 基本类型
    styleObj = Object.assign(styleObj, this.componentData.style[kind]);
    styleObj = Object.assign(styleObj, this.componentData.style.ceil);

    //1. 处理类型对应的样式
    if (target.type == 'text') {
        styleObj = Object.assign(styleObj, this.componentData.style.text);
    } else if (target.type == 'number') {
        styleObj = Object.assign(styleObj, this.componentData.style.number);
    }

    //2. 处理具体的样式
    target.mergeStyle = Object.assign(styleObj, target.style);
    target.cssStyle = Utils.toCssStyle(target.mergeStyle);

    return target;
    
    
};


Handle.prototype._gradientColors = function (start, end, steps, gamma) {
    if(steps < 2) return [start];

    var parseColor = function (hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) {
            return 0x11 * parseInt(s, 16);
        }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) {
            return parseInt(s, 16);
        })
    };

    // zero-pad 1 digit to 2
    var pad = function (s) {
        return (s.length === 1) ? '0' + s : s;
    };

    var ms, me, output = [], so = [];
    gamma = gamma || 1;
    var normalize = function (channel) {
        return Math.pow(channel / 255, gamma);
    };
    start = parseColor(start).map(normalize);
    end = parseColor(end).map(normalize);
    for (var i = 0; i < steps; i++) {
        ms = i / (steps - 1);
        me = 1 - ms;
        for (var j = 0; j < 3; j++) {
            so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
        }
        output.push('#' + so.join(''));
    }
    return output;
};
