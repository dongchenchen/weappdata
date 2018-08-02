var Utils = require('../utils.js');

var DEFINE_ERR = -1;
var DEFINE_PARAMETER_ERROR = -2;
var DEFINE_GET_SYSTEM_SIZE_ERROR = -1001;
var DEFINE_PIE_EMPTY_ERROR = -3;

module.exports = Handle;

function Handle(componentData, baseCtx, floatCtx) {
    this.componentData = {
        data: Utils.deepCopy(componentData.canvasData),
        option: Utils.deepCopy(componentData.canvasOption),
        style: Utils.deepCopy(componentData.canvasStyle),
    };
    this.baseCtx = baseCtx;
    this.floatCtx = floatCtx;
}
Handle.prototype.tapLegend = function (targetIdx) {
    let option = this.componentData.option;
    if (option.legendCanControlShow == false) return 0;


    //如果只剩一个展示的，就不可取消
    var onShowCnt = 0;
    let targetData = this.componentData.data.pie;
    for (var cnt = 0; cnt < targetData.length; cnt++) {
        if (targetData[cnt].hidden == false) onShowCnt++;
    }
    if (onShowCnt == 1 && targetData[targetIdx].hidden == false) {
        console.warn("only one pie on show, can't hidden");
        return 0;
    }
    targetData[targetIdx].hidden = !targetData[targetIdx].hidden;

    //3. 整理线段数据: 计算percentage
    var ret = this._privateInitPieValue();
    if (ret != 0) return ret;

    //6. 整理图标
    this._privateInitLegend();

    //7. realDraw
    this._privateDrawBase();
    return 0;
};
Handle.prototype.draw = function (componentData) {
    if (componentData) {
        this.componentData = {
            data: Utils.deepCopy(componentData.canvasData),
            option: Utils.deepCopy(componentData.canvasOption),
            style: Utils.deepCopy(componentData.canvasStyle),
        };
    }

    //1. 检查config 必填信息
    var ret = this._privateCheckConfig();
    if (ret != 0) return ret;


    //2. 获取屏幕数据: 整理长宽
    var ret = this._privateInitScreen();
    if (ret != 0) return ret;

    //3. 整理线段数据: 计算percentage
    var ret = this._privateInitPieValue();
    if (ret != 0) return ret;

    //6. 整理图标
    this._privateInitLegend();

    //7. realDraw
    this._privateDrawBase();

    return 0;
};

Handle.prototype._privateCheckConfig = function () {
    try {
        let {data, style, option} = this.componentData;
        if (data == undefined || style == undefined || option == undefined) return DEFINE_PARAMETER_ERROR;
        {
            var onShow = false;
            data.pie.forEach(function (targetPie) {
                if (targetPie.hidden) return;
                onShow = true;
            });

            if (onShow == false) {
                console.error("all pie hidden");
                return DEFINE_PIE_EMPTY_ERROR;
            }
        }

        if (option.moveCanShowDataFlag != false) option.moveCanShowDataFlag = true;
        if (option.legendCanControlShow != false) option.legendCanControlShow = true;


        option.seriesColor.length = data.pie.length;
        return 0;
    } catch (err) {
        console.error("_privateCheckConfig: ", err);
        return DEFINE_PARAMETER_ERROR;
    }
};
Handle.prototype._privateInitScreen = function () {
     let option = this.componentData.option;
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

    //开始更新this.componentData.style
    this.sourceStyle = Utils.deepCopy(this.componentData.style);
    this.componentData.style = Utils.formatStyleSize(this.componentData.style, this.sysUnit);
    this.componentData.style.legend = this.sourceStyle.legend;
    return 0;
};

Handle.prototype._privateInitPieValue = function () {
    let targetPieData = this.componentData.data.pie;
    let seriesColor = this.componentData.option.seriesColor;

    this.hasFloatValue = false;
    this.sum = 0;
    let that = this;
    targetPieData.forEach(function (item) {
        if (item.hidden == true) return;
        that.sum += item.value;

        if(item.value % 1 !== 0){
            that.hasFloatValue = true;
        }
    });


    if (this.sum == 0) return DEFINE_PIE_EMPTY_ERROR;

    this.rate = 2.0 * Math.PI / this.sum;

    var startDu = Utils.deepCopy(this.componentData.option.firstStartDu);
    for (var cnt = 0; cnt < targetPieData.length; cnt++) {
        var item = targetPieData[cnt];

        item.color = seriesColor[cnt];

        if (item.hidden == true) {
            item.percentage = '--';
        } else {
            item.percentage = ( item.value / this.sum * 100).toFixed(this.componentData.option.valueToFixed) + '%';
            item.startDu = startDu;
            item.endDu = startDu + item.value * this.rate;
            startDu = startDu + item.value * this.rate;
        }

        if(this.hasFloatValue)
            item.value = item.value.toFixed(this.componentData.option.valueToFixed);
    }

    return 0;
};

Handle.prototype._privateInitLegend = function () {
    let targetPieData = this.componentData.data.pie;

    this.legend = {
        show: false, value: [], style: {}
    };

    let targetStyle = this.componentData.style.legend;
    if (targetStyle.show == false) return;

    this.legend.show = true;

    let that = this;
    targetPieData.forEach(function (item) {
        var currItem = {
            text: item.legend,
            value:  Utils.formatNumber(item.value, that.componentData.option),
            percentage: item.percentage,
        };
        if (item.hidden) currItem.color = targetStyle.icon.defaultColor;
        else currItem.color = item.color;

        that.legend.value.push(currItem);
    });

    var legendStyle = this.legend.style;
    legendStyle.legend = Utils.toCssStyle(targetStyle.margin);
    legendStyle.legend_text = Utils.toCssStyle(targetStyle.text);
    legendStyle.legend_value = Utils.toCssStyle(targetStyle.value);
    legendStyle.legend_percentage = Utils.toCssStyle(targetStyle.percentage);
    legendStyle.legend_icon = Utils.toCssStyle(targetStyle.icon);

};


Handle.prototype._privateDrawBase = function () {
    this.borderPie = this.componentData.style.pie;
    this.borderPie.x = this.borderPie.R + this.borderPie.margin.left;
    this.borderPie.y = this.borderPie.R + this.borderPie.margin.top;

    // 单位px;
    this.borderScreen = {
        maxW: this.borderPie.R * 2 + this.borderPie.margin.left + this.borderPie.margin.right,
        maxH: this.borderPie.R * 2 + this.borderPie.margin.top + this.borderPie.margin.bottom,
    };
    
    // start draw R
    let targetPieData = this.componentData.data.pie;
    for (var cnt = 0; cnt < targetPieData.length; cnt++) {
        if (targetPieData[cnt].hidden == true) continue;

        Utils.drawCircle(this.baseCtx, {
            x: this.borderPie.x,
            y: this.borderPie.y,
            r: this.borderPie.R,
            color: targetPieData[cnt].color || this.borderPie.defaultColor,
            startDu: targetPieData[cnt].startDu,
            endDu: targetPieData[cnt].endDu,
        })
    }

    //start draw r;
    Utils.drawCircle(this.baseCtx, {
        x: this.borderPie.x,
        y: this.borderPie.y,
        r: this.borderPie.r,
        color: this.borderPie.centerColor
    });

    this.baseCtx.draw();
};




