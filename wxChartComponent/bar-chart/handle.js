var Utils = require('../utils.js');

var DEFINE_ERR = -1;
var DEFINE_PARAMETER_ERROR = -2;
var DEFINE_GET_SYSTEM_SIZE_ERROR = -1001;
var DEFINE_LINE_EMPTY_ERROR = -3;

module.exports = Handle;

function Handle(componentData, ctx) {
    this.componentData = {
        data: Utils.deepCopy(componentData.canvasData),
        option: Utils.deepCopy(componentData.canvasOption),
        style: Utils.deepCopy(componentData.canvasStyle),
    };
    this.drawData = { // 绘图用的数据
        area: {},
        bar: {},
        yCoordinate: {},
    };

    this.ctx = ctx;
}

Handle.prototype.draw = function (componentData) {
    if (componentData) {
        this.componentData = {
            data: Utils.deepCopy(componentData.canvasData),
            option: Utils.deepCopy(componentData.canvasOption),
            style: Utils.deepCopy(componentData.canvasStyle),
        };
    }

    var ret;
    //1. 检查config 必填信息
    ret = this._privateCheckConfig();
    if (ret != 0) return ret;

    //2. 单位转换，整理绘画区域长宽
    ret = this._privateInitScreen();
    if (ret != 0) return ret;

    //3. 图例
    this._privateInitLegend();

    //5. 处理图表数据
    this._privateInitChartData();
    // console.log('after _privateInitChartData', this);

    //3. 处理y坐标
    this._privateInitYCoordinateData();
    // console.log('after _privateInitYCoordinateData', this);

    //4. 处理x坐标
    this._privateInitXCoordinateData();
    // console.log('after _privateInitXCoordinateData', this);

    // this._testArea();

    //6. 画y坐标
    this._privateDrawYCoordinate();

    //7. 画x坐标
    this._privateDrawXCoordinate();

    //8. 画图表
    this._privateDrawChart();
    // console.log('after _privateDrawChart', this);

    this.ctx.draw();

    return 0;
};

Handle.prototype._privateCheckConfig = function () {
    var {data, style, option} = this.componentData;
    if (data == undefined || style == undefined) return DEFINE_PARAMETER_ERROR;

    if (data.series.length == 0) {
        console.error('no data, data.series.length == 0')
        return DEFINE_PARAMETER_ERROR;
    }

    if (data.series.reduce((a, b)=>Math.min(a, b.bar.length), Infinity) == 0) {
        console.error('有一个系列中没有柱子');
        return DEFINE_PARAMETER_ERROR;
    }

    if (data.series.reduce((a, b)=>Math.max(a, b.bar.length), 0) != data.xCoordinate.length) {
        console.error('横坐标数目不等于最大柱子数');
        return DEFINE_PARAMETER_ERROR;
    }

    /* ... */
    return 0;
}

Handle.prototype._privateInitScreen = function () {
    var option = this.componentData.option;
    if (option.sizeUnit == 'rpx') {
        this.sysWidth = Utils.getSysWindowWidth();
        if (this.sysWidth == 0) {
            console.error("getSysWindowWidth error: ", this.sysWidth);
            return DEFINE_GET_SYSTEM_SIZE_ERROR;
        }
        this.sysUnit = this.sysWidth / 750;
        option.sizeUnit = 'px';
    } else {
        this.sysUnit = 1;
    }

    this.sourceStyle = Utils.deepCopy(this.componentData.style);
    this.componentData.style = Utils.formatStyleSize(this.componentData.style, this.sysUnit);
    this.componentData.style.legend = this.sourceStyle.legend;

    var screen = this.componentData.style.screen;
    if (screen.w == 0 || screen.h == 0) {
        console.error("screen.w == 0 or screen.h == 0, maybe something wrong");
        return DEFINE_GET_SYSTEM_SIZE_ERROR;
    }

    this.drawData.area.screen = {
        maxH: screen.h,
        maxW: screen.w,
        x: screen.margin.left,
        y: screen.margin.top,
        w: screen.w - screen.margin.left - screen.margin.right,
        h: screen.h - screen.margin.top - screen.margin.bottom,
    };
    return 0;
}

Handle.prototype._privateInitLegend = function () {
    var targetStyle = this.componentData.style.legend;
    var targetSeries = this.componentData.data.series;

    this.legend = {
        show: false, value: [], style: {}
    };

    if (targetStyle.show != true)  return;

    this.legend.show = true;

    for (var cnt = 0; cnt < targetSeries.length; cnt++) {
        var item = {
            text: targetSeries[cnt].legend,
        };

        if (targetSeries[cnt].hidden) item.color = targetStyle.icon.defaultColor;
        else item.color = this.componentData.option.seriesColor[cnt];

        this.legend.value.push(item);
    }


    //legend  legend_item   legend_icon  legend_text
    var legendStyle = this.legend.style;
    legendStyle.legend = Utils.toCssStyle(targetStyle.margin);
    legendStyle.legend_text = Utils.toCssStyle(targetStyle.text);
    legendStyle.legend_icon = Utils.toCssStyle(targetStyle.icon);
}

Handle.prototype._privateInitChartData = function () {
    var {data, style} = this.componentData;

    // 算最大最小值
    this.drawData.bar.max = -Infinity;
    this.drawData.bar.min = Infinity;
    this.drawData.bar.maxBarNum = 0;
    this.drawData.bar.hasFloatValue = false;
    data.series.forEach((series)=> {
        this.drawData.bar.maxBarNum = Math.max(this.drawData.bar.maxBarNum, series.bar.length);
        if (series.hidden) return;
        series.bar.forEach((bar)=> {
            this.drawData.bar.max = Math.max(this.drawData.bar.max, bar.value);
            this.drawData.bar.min = Math.min(this.drawData.bar.min, bar.value);
            if (bar.value % 1 !== 0) this.drawData.bar.hasFloatValue = true;
        })
    })

    // 看看柱子上要展示多少字，以决定y轴区域
    if (!this.drawData.area.yCoordinate) this.drawData.area.yCoordinate = {};
    this.drawData.area.yCoordinate.y = this.drawData.area.screen.y;
    if (style.bar.number && style.bar.number.show == true) {
        this.drawData.area.yCoordinate.y += Utils.getWordHeight('', style.bar.number.fontSize); // 就当做是字符串的高度
        this.drawData.area.yCoordinate.y += style.bar.number.marginTop + style.bar.number.marginBottom;
    }
    if (style.bar.percentageNumber && style.bar.percentageNumber.show == true) {
        this.drawData.area.yCoordinate.y += Utils.getWordHeight('', style.bar.percentageNumber.fontSize); // 就当做是字符串的高度
        this.drawData.area.yCoordinate.y += style.bar.percentageNumber.marginTop + style.bar.percentageNumber.marginBottom;
    }


}

Handle.prototype._privateInitYCoordinateData = function () {
    var {option, style} = this.componentData;

    var getYCoordinateData = () => {
        var max = this.drawData.bar.max;
        if (option.yCoordinateFixedMax != undefined) max = option.yCoordinateFixedMax;
        var min = this.drawData.bar.min;
        if (option.yCoordinateFixedMin != undefined) min = option.yCoordinateFixedMin;
        var realSection = this._privateGetYCoordinate(max, min, option.yCoordinateFixedCount);
        this.drawData.yCoordinate.max = realSection.max;
        this.drawData.yCoordinate.min = realSection.min;
        this.drawData.yCoordinate.unit = (realSection.max - realSection.min) / option.yCoordinateFixedCount;
        this.drawData.yCoordinate.values = [];
        var maxYCoorLength = -Infinity;
        var maxWordWidth = -Infinity;
        for (var i = 0; i <= option.yCoordinateFixedCount; ++i) {
            var value = this.drawData.yCoordinate.min + i * this.drawData.yCoordinate.unit;
            var name = Utils.formatNumber(value, option);
            this.drawData.yCoordinate.values.push({
                value: value,
                name: name,
            })

            var curLength = Utils.getWordWidth(name, style.coordinateSystem.yCoordinate.fontSize);
            maxWordWidth = Math.max(maxWordWidth, curLength);
            curLength += style.coordinateSystem.yCoordinate.marginLeft + style.coordinateSystem.yCoordinate.marginRight;
            maxYCoorLength = Math.max(maxYCoorLength, curLength);
        }
        return {maxWordWidth: maxWordWidth, maxYCoorLength: maxYCoorLength};
    }

    if (!this.drawData.area.yCoordinate) this.drawData.area.yCoordinate = {};
    this.drawData.area.yCoordinate.x = this.drawData.area.screen.x;
    // y在_privateInitChartData中算出
    // this.drawData.area.yCoordinate.y = his.drawData.area.screen.y;

    if (!this.drawData.area.chart) this.drawData.area.chart = {};

    this.drawData.area.yCoordinate.w = 0;
    // 不绘制y坐标的情况
    if (option.yCoordinateFixedCount < 2 || !style.coordinateSystem.yCoordinate.show) {
        // 但要画y坐标轴
        if (style.coordinateSystem.yAxis.show && style.coordinateSystem.yAxis.width) {
            this.drawData.area.yCoordinate.w = style.coordinateSystem.yAxis.width;
        }
        this.drawData.area.chart.x = this.drawData.area.yCoordinate.x + this.drawData.area.yCoordinate.w;
        this.drawData.area.chart.w = this.drawData.area.screen.w - this.drawData.area.yCoordinate.w;
        this.drawData.area.chart.y = this.drawData.area.screen.y;
        getYCoordinateData();
        return 0;
    }
    if (style.coordinateSystem.yAxis.show && style.coordinateSystem.yAxis.width) {
        this.drawData.area.yCoordinate.w += style.coordinateSystem.yAxis.width;
    }

    var {maxWordWidth, maxYCoorLength} = getYCoordinateData();
    this.drawData.yCoordinate.maxWordWidth = maxWordWidth;
    this.drawData.area.yCoordinate.w += maxYCoorLength;

    // 根据这个，可以得到图表区域的x和w
    this.drawData.area.chart.x = this.drawData.area.yCoordinate.x + this.drawData.area.yCoordinate.w;
    this.drawData.area.chart.w = this.drawData.area.screen.w - this.drawData.area.yCoordinate.w;
    this.drawData.area.chart.y = this.drawData.area.screen.y;
}

Handle.prototype._privateInitXCoordinateData = function () {
    var {style, data} = this.componentData;
    if (!this.drawData.area.xCoordinate) this.drawData.area.xCoordinate = {};

    this.drawData.area.xCoordinate.w = this.drawData.area.chart.w;
    this.drawData.area.xCoordinate.x = this.drawData.area.chart.x;
    this.drawData.area.xCoordinate.h = 0;
    // 不绘制x坐标的情况
    if (!style.coordinateSystem.xCoordinate.show) {
        // 但要画y坐标轴
        if (style.coordinateSystem.xAxis.show && style.coordinateSystem.xAxis.width) {
            this.drawData.area.xCoordinate.h = style.coordinateSystem.xAxis.width;
        }
        this.drawData.area.xCoordinate.y = this.drawData.area.screen.h - this.drawData.area.xCoordinate.h + this.drawData.area.screen.y;
        this.drawData.area.yCoordinate.h = this.drawData.area.screen.h - this.drawData.area.xCoordinate.h - this.drawData.area.yCoordinate.y + this.drawData.area.screen.y;
        this.drawData.area.chart.h = this.drawData.area.screen.h - this.drawData.area.xCoordinate.h;
        return 0;
    }
    if (style.coordinateSystem.xAxis.show && style.coordinateSystem.xAxis.width) {
        this.drawData.area.xCoordinate.h += style.coordinateSystem.xAxis.width;
    }

    // chart区域的宽度跟横坐标区域宽度等宽；
    // 那么可以算出每个横坐标wording能占的宽度
    // 结合“rotateDegree”，进而得到最大wordwidth
    // 进而限制横坐标wording长度（用省略号代替）
    var count = data.series.reduce((a, b)=>Math.max(a, b.bar.length), 0); // 在CheckConfig的时候确保了这个值不为零
    var allowWordWidth = this.drawData.area.chart.w / count;

    // 注：allowWordWidth = realWordWidth * Math.cos(rotateRadio) + realWordHeight * Math.sin(rotateRadio)
    // allowWordHight = realWordWidth * Math.sin(rotateRadio) + realWordHeight * Math.cos(rotateRadio)
    var realWordHeight = Utils.getWordHeight('', style.coordinateSystem.xCoordinate.fontSize);
    var rotateRadio = style.coordinateSystem.xCoordinate.rotateRadio;
    var realWordWidth;
    if (rotateRadio == 90 || rotateRadio == 270) realWordWidth = Infinity;
    else realWordWidth = ( allowWordWidth - realWordHeight * Math.abs(Math.sin(Utils.deg2rad(rotateRadio))) ) / Math.abs(Math.cos(Utils.deg2rad(rotateRadio)));

    // 把value生成好
    if (!this.drawData.xCoordinate) this.drawData.xCoordinate = {};
    this.drawData.xCoordinate.values = data.xCoordinate.reduce((a, b)=>a.concat(Utils.textOverflow(b, style.coordinateSystem.xCoordinate.fontSize, realWordWidth)), []);
    var maxWordWidth = this.drawData.xCoordinate.values.reduce((a, b)=>Math.max(a, Utils.getWordWidth(b, style.coordinateSystem.xCoordinate.fontSize)), 0);

    // 计算area
    var allowWordHight = maxWordWidth * Math.abs(Math.sin(Utils.deg2rad(rotateRadio))) + realWordHeight * Math.abs(Math.cos(Utils.deg2rad(rotateRadio)));
    this.drawData.area.xCoordinate.h += allowWordHight;
    this.drawData.area.xCoordinate.h += style.coordinateSystem.xCoordinate.marginTop + style.coordinateSystem.xCoordinate.marginBottom;
    this.drawData.area.xCoordinate.y = this.drawData.area.screen.h - this.drawData.area.xCoordinate.h + this.drawData.area.screen.y;

    this.drawData.area.yCoordinate.h = this.drawData.area.screen.h - this.drawData.area.xCoordinate.h - this.drawData.area.yCoordinate.y + this.drawData.area.screen.y;
    this.drawData.area.chart.h = this.drawData.area.screen.h - this.drawData.area.xCoordinate.h;

    this.drawData.xCoordinate.allowWordHight = allowWordHight;
    this.drawData.xCoordinate.allowWordWidth = allowWordWidth;

    console.log("bar here:", this, this.drawData.xCoordinate);
}

Handle.prototype._testArea = function () {
    {
        var {maxH, maxW} = this.drawData.area.screen;
        this.ctx.setFillStyle('#EEEEEE');
        this.ctx.fillRect(0, 0, maxW, maxH);
    }
    {
        var {x, y, w, h} = this.drawData.area.screen;
        this.ctx.setFillStyle('#DDDDDD');
        this.ctx.fillRect(x, y, w, h);
    }
    {
        var {x, y, w, h} = this.drawData.area.chart;
        this.ctx.setFillStyle('#BBFFFF');
        this.ctx.fillRect(x, y, w, h);
    }
    {
        var {x, y, w, h} = this.drawData.area.xCoordinate;
        this.ctx.setFillStyle('#FFBBFF');
        this.ctx.fillRect(x, y, w, h);
    }
    {
        var {x, y, w, h} = this.drawData.area.yCoordinate;
        this.ctx.setFillStyle('#FFFFBB');
        this.ctx.fillRect(x, y, w, h);
    }

    // this.ctx.draw();
}

Handle.prototype._privateDrawYCoordinate = function () {
    var option = this.componentData.option;
    var area = this.drawData.area.yCoordinate;
    var chartArea = this.drawData.area.chart;
    var data = this.drawData.yCoordinate;

    var drawYCoordinate = (style)=> {
        if (!style.show) return;

        if (!style.marginLeft) style.marginLeft = 0;
        var x = area.x + style.marginLeft;
        var y = area.y + area.h;
        if (!style.textAlign) style.textAlign = 'left';
        this.ctx.setTextAlign(style.textAlign);
        if (style.textAlign == 'center') x = area.x + data.maxWordWidth / 2 + style.marginLeft;
        else if (style.textAlign == 'right') x = area.x + data.maxWordWidth + style.marginLeft;

        if (!style.textBaseline) style.textBaseline = 'middle';
        this.ctx.setTextBaseline(style.textBaseline);
        this.ctx.setFontSize(style.fontSize);
        this.ctx.setFillStyle(style.color);
        var delta = area.h / option.yCoordinateFixedCount;
        for (var i = 0; i < data.values.length; i++) {
            this.ctx.fillText(data.values[i].name, x, y);
            y -= delta;
        }
    }
    var drawYAxis = (style)=> {
        if (!style.show) return;

        this.ctx.setStrokeStyle(style.color);
        this.ctx.setLineWidth(style.width);
        var x = area.x + area.w - style.width / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, chartArea.y);
        this.ctx.lineTo(x, chartArea.y + chartArea.h);
        this.ctx.stroke();
    }
    var drawGrid = (style)=> {
        if (!style.show) return;
        this.ctx.setStrokeStyle(style.color);
        this.ctx.setLineWidth(style.width);
        var x = area.x + area.w;
        var y = area.y + area.h;
        var delta = area.h / option.yCoordinateFixedCount;
        for (var i = 0; i < data.values.length; i++) {
            if (i > 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x + chartArea.w, y);
                this.ctx.stroke();
            }
            y -= delta;
        }

    }

    var yCoordinateStyle = this.componentData.style.coordinateSystem.yCoordinate;
    var yAxisStyle = this.componentData.style.coordinateSystem.yAxis;
    var gridStyle = this.componentData.style.grid.parallelX;

    drawYCoordinate(yCoordinateStyle);
    drawYAxis(yAxisStyle);
    drawGrid(gridStyle);
}

Handle.prototype._privateDrawXCoordinate = function () {
    var ctx = this.ctx;
    var area = this.drawData.area.xCoordinate;
    var data = this.drawData.xCoordinate;
    var drawXCoordinate = (style, xAxisStyle)=> {
        if (!style.show) return;
        if (data.values.length == 0) return;

        // var delta = area.x / data.values.length;
        var x = area.x + data.allowWordWidth / 2;
        var y = area.y + style.marginTop + data.allowWordHight / 2;
        if (xAxisStyle.show && xAxisStyle.width) y += xAxisStyle.width;
        for (var i = 0; i < data.values.length; ++i) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Utils.deg2rad(style.rotateRadio));
            ctx.setTextAlign('center');
            ctx.setTextBaseline('middle');
            ctx.setFontSize(style.fontSize);
            ctx.setFillStyle(style.color);
            ctx.fillText(data.values[i], 0, 0);
            ctx.restore();

            x += data.allowWordWidth;
        }
    }
    var drawXAxis = (style)=> {
        if (!style.show) return;

        ctx.setStrokeStyle(style.color);
        ctx.setLineWidth(style.width);
        var x = area.x;
        var y = area.y + style.width / 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + area.w, y);
        ctx.stroke();
    }

    var xCoordinateStyle = this.componentData.style.coordinateSystem.xCoordinate;
    var xAxisStyle = this.componentData.style.coordinateSystem.xAxis;
    drawXCoordinate(xCoordinateStyle, xAxisStyle);
    drawXAxis(xAxisStyle);
}

Handle.prototype._privateDrawChart = function () {
    var ctx = this.ctx;
    var option = this.componentData.option;
    var area = this.drawData.area.chart;
    var yCoordinateArea = this.drawData.area.yCoordinate;
    var style = this.componentData.style.bar;
    var series = this.componentData.data.series;
    var data = this.drawData.bar;
    var yCoordinateData = this.drawData.yCoordinate;

    var seriesCount = series.reduce((a, b)=>a + (b.hidden ? 0 : 1), 0);
    var singleWidth = area.w / data.maxBarNum;
    var marginLeft = (singleWidth - (style.width * seriesCount)) / 2;
    if (marginLeft < 0) marginLeft = 0;
    var i = 0;
    series.forEach((a, idx)=> {
        if (a.hidden) return;

        var sum = a.bar.reduce((c, d)=>c + d.value, 0);
        a.bar.forEach((b, j)=> {
            var x = area.x + marginLeft + i * style.width + j * singleWidth;
            var h = (b.value - yCoordinateData.min) * yCoordinateArea.h / (yCoordinateData.max - yCoordinateData.min);
            var y = area.y + area.h - h;
            var w = style.width;
            b.drawPosition = {x: x, y: y, h: h, w: w};
            // 柱子
            var barColor = (b.active && style.activeColor) ? style.activeColor : option.seriesColor[idx];
            ctx.setFillStyle(barColor);
            ctx.fillRect(x, y, w, h);

            var yBase = y;
            // number
            if (style.number.show) {
                var str = Utils.formatNumber(b.value, option);
                var strWidth = Utils.getWordWidth(str, style.number.fontSize);
                var strHeight = Utils.getWordHeight(str, style.number.fontSize);
                ctx.setFillStyle(style.number.color);
                ctx.setFontSize(style.number.fontSize);
                if (!style.number.textAlign) style.number.textAlign = 'left';
                ctx.setTextAlign(style.number.textAlign);
                ctx.setTextBaseline('top');
                var numberX = x;
                if (style.number.textAlign == 'center') numberX = x + w / 2;
                else if (style.number.textAlign == 'right') numberX = x + w;
                var numberY = yBase - style.number.marginBottom - strHeight;
                ctx.fillText(str, numberX, numberY);

                yBase -= style.number.marginBottom + strHeight + style.number.marginTop;
            }

            // percentageNumber
            if (style.percentageNumber.show) {
                var valueToFixed = option.valueToFixed;
                if (style.percentageNumber.valueToFixed != undefined)
                    valueToFixed = style.percentageNumber.valueToFixed;
                var str = (b.value / sum * 100).toFixed(valueToFixed) + '%';
                var strWidth = Utils.getWordWidth(str, style.percentageNumber.fontSize);
                var strHeight = Utils.getWordHeight(str, style.percentageNumber.fontSize);
                ctx.setFillStyle(style.percentageNumber.color);
                ctx.setFontSize(style.percentageNumber.fontSize);
                if (!style.percentageNumber.textAlign) style.percentageNumber.textAlign = 'left';
                ctx.setTextAlign(style.percentageNumber.textAlign);
                ctx.setTextBaseline('top');
                var numberX = x;
                if (style.percentageNumber.textAlign == 'center') numberX = x + w / 2;
                else if (style.percentageNumber.textAlign == 'right') numberX = x + w;
                var numberY = yBase - style.percentageNumber.marginBottom - strHeight;
                ctx.fillText(str, numberX, numberY);

                yBase -= style.percentageNumber.marginBottom + strHeight + style.percentageNumber.marginTop;
            }
        })
        i++;
    })
}


Handle.prototype._privateGetYCoordinate = function (max, min, cnt) {
    var cal = (curMin) => {
        var unit = Math.ceil((max - curMin) / cnt);
        var curMax = curMin + unit * cnt;
        return curMax;
    }

    var delta = Infinity;
    var realMin, realMax;
    for (var i = 1; ; i *= 10) {

        var curMin = min - (min % i);
        var curMax = cal(curMin);
        if (delta > curMax - max) {
            delta = curMax - max;
            realMin = curMin;
            realMax = curMax;
        }
        if (min < i) break;
    }

    return {
        max: realMax,
        min: realMin,
    }
}


Handle.prototype.bindtouchstart = function (e) {
    // console.log('bindtouchstart', e);

    var x, y;
    try {
        x = e.changeTouches[0].x;
        y = e.changeTouches[0].y;
    } catch (err) {
        x = e.touches[0].x;
        y = e.touches[0].y;
    }

    var result = {
        series: {},
        bar: {},
        xCoordinate: null,
        index: null, // 第几根柱子
        touch: {x: x, y: y},
    };
    var dis = Infinity;
    var selectedBar;
    this.componentData.data.series.forEach(series=> {
        if (series.hidden) return;
        series.bar.forEach((bar, index)=> {
            var barCenter = bar.drawPosition.x + bar.drawPosition.w / 2;
            var curDis = Math.abs(x - barCenter);
            if (dis > curDis) {
                dis = curDis;
                result.series.extra = Utils.deepCopy(series.extra);
                result.series.legend = series.legend;
                result.bar = Utils.deepCopy(bar);
                result.index = index;
                result.xCoordinate = this.componentData.data.xCoordinate[index];
                selectedBar = bar;
            }
        })
    })
    this.componentData.data.series.forEach(series=> {
        series.bar.forEach((bar, index)=> {
            if (selectedBar != bar) bar.active = false;
        })
    })
    selectedBar.active = !selectedBar.active;
    result.active = selectedBar.active;

    this.draw();
    return result;
}

Handle.prototype.bindtouchmove = function (e) {
    // console.log('bindtouchmove', e);
}

Handle.prototype.bindtouchend = function (e) {
    // console.log('bindtouchend', e);
}

Handle.prototype.tapLegend = function (targetIdx) {
    this.componentData.data.series[targetIdx].hidden = !this.componentData.data.series[targetIdx].hidden;
    if (this.componentData.data.series.reduce((a, b)=>a + (b.hidden ? 0 : 1), 0) == 0) { // 不能全隐藏
        this.componentData.data.series[targetIdx].hidden = !this.componentData.data.series[targetIdx].hidden;
        return 0;
    }
    this.draw();
    return 0;
}
