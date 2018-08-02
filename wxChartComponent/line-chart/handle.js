var Utils = require('../utils.js');

var DEFINE_ERR = -1;
var DEFINE_PARAMETER_ERROR = -2;
var DEFINE_GET_SYSTEM_SIZE_ERROR = -1001;
var DEFINE_LINE_EMPTY_ERROR = -3;

module.exports = Handle;

function Handle(componentData, baseCtx, floatCtx) {
    this.componentData = {
        data: Utils.deepCopy(componentData.canvasData),
        option: Utils.deepCopy(componentData.canvasOption),
        style: Utils.deepCopy(componentData.canvasStyle),

        // data:componentData.canvasData,
        // option: componentData.canvasOption,
        // style: componentData.canvasStyle,
    };

    this.floatCtx = floatCtx;
    this.baseCtx = baseCtx;

}

Handle.prototype.draw = function (componentData) {
    if (componentData) {
        this.componentData = {
            data: Utils.deepCopy(componentData.canvasData),
            option: Utils.deepCopy(componentData.canvasOption),
            style: Utils.deepCopy(componentData.canvasStyle),
        };
    }

    //1. 检查 config 必填信息
    var ret = this._privateCheckConfig();
    if (ret != 0) return ret;


    //2. 获取屏幕数据: 整理长宽
    var ret = this._privateInitScreen();
    if (ret != 0) return ret;


    //3. 整理线段数据: 得到y轴的值，从而知道 ycoordinante.w, 以及this.lineFixedMaxPointCount
    var ret = this._privateInitChartData();
    if (ret != 0) return ret;


    //4. 整理x轴坐标：screen.h - xcoordinante.h = grid.h
    this._privateInitXCoordinante();

    //5. 整理Y轴坐标
    this._privateInitYCoordinante();

    //6. 确定互相依赖的border
    this._privateDecidePosition();

    //7. realDraw
    this._privateDrawBase();

    //6. 整理图标
    this._privateInitLegend();

    return 0;
};

Handle.prototype.tapLegend = function (targetIdx) {
    let option = this.componentData.option;
    if (option.legendCanControlShow == false) return 0;


    //如果只剩一个展示的，就不可取消
    var onShowCnt = 0;
    let targetData = this.componentData.data.line;
    for (var cnt = 0; cnt < targetData.length; cnt++) {
        if (targetData[cnt].hidden == false) onShowCnt++;
    }
    if (onShowCnt == 1 && targetData[targetIdx].hidden == false) {
        console.warn("only one line on show, can't hidden");
        return 0;
    }

    targetData[targetIdx].hidden = !targetData[targetIdx].hidden;

    if (option.yCoordinateDependOnShowData) {
        var ret = this._privateInitChartData();
        if (ret != 0) return ret;

        //4. 整理x轴坐标：screen.h - xcoordinante.h = grid.h
        this._privateInitXCoordinante();

        //5. 整理Y轴坐标
        this._privateInitYCoordinante();

        //6. 确定互相依赖的border
        this._privateDecidePosition();
    } else {
        this.line[targetIdx].hidden != this.line[targetIdx].hidden;
    }

    //7. realDraw
    this._privateDrawBase();

    //6. 整理图标
    this._privateInitLegend();


    //1.更改
    return this.draw();
};
Handle.prototype.bindtouchstart = function (e) {
    var touchXPosition = e.touches[0].x;
    if (touchXPosition == undefined) return;

    if(this.componentData.option.moveCanShowDataFlag == false) return;
    this._privateDrawFloat(touchXPosition);
    this.floatCtx.draw();
};
Handle.prototype.bindtouchmove = function (e) {
    var touchXPosition = e.touches[0].x;
    if (touchXPosition == undefined) return;

    if(this.componentData.option.moveCanShowDataFlag == false) return;
    this._privateDrawFloat(touchXPosition);
    this.floatCtx.draw();
};
Handle.prototype.bindtouchend = function (e) {
    this.floatCtx.draw();
};


Handle.prototype._privateDrawBase = function () {
    this.yCoordinate.forEach((_target)=>{Utils.drawWord(this.baseCtx, _target)});
    this.xCoordinate.forEach((_target)=>{Utils.drawWord(this.baseCtx, _target)});

    this._privateDrawGrid();
    this._privateDrawLine();
    this.baseCtx.draw();
};

Handle.prototype._privateDrawGrid = function () {
    let border = this.borderGird;
    let gridStyle = this.componentData.style.grid;

    if (gridStyle.parallelX.show) {
        this.gridPosY.forEach((target)=>{
            Utils.drawLine(this.baseCtx, {
                stPos: {x: border.x, y: target},
                edPos: {x: border.x + border.w, y: target},
                width: gridStyle.parallelX.width,
                color: gridStyle.parallelX.color
            });
        });
    }

    if (gridStyle.parallelY.show) {
        this.gridPosX.forEach((target)=>{
            Utils.drawLine(this.baseCtx, {
                stPos: {x: target, y: border.y},
                edPos: {x: target, y: border.y + border.h},
                width: gridStyle.parallelY.width,
                color: gridStyle.parallelY.color
            });
        });
    }

    let xAxisStyle = this.componentData.style.coordinateSystem.xAxis;
    if (xAxisStyle.show) {
        Utils.drawLine(this.baseCtx, {
            stPos: {x: border.x, y: border.y + border.h},
            edPos: {x: border.x + border.w, y: border.y + border.h},
            width: xAxisStyle.width,
            color: xAxisStyle.color
        });
    }

    let yAxisStyle = this.componentData.style.coordinateSystem.yAxis;
    if (yAxisStyle.show) {
        Utils.drawLine(this.baseCtx, {
            stPos: {x: border.x, y: border.y - 11},   //文字的高度
            edPos: {x: border.x, y: border.y + border.h},
            width: yAxisStyle.width,
            color: yAxisStyle.color
        });
    }


};

Handle.prototype._privateDrawLine = function () {
    let style = this.componentData.style.line;
    let grid = this.borderGird;

    if (style.zIndexChange == 'decrease') this.line = this.line.reverse();

    if (this.lineFixedMaxPointCount > this.componentData.option.lineExceedPointCountNoJoinStyle) {
        this.noJoinStyle = true;
    } else {
        this.noJoinStyle = false;
    }

    //画线
    this.line.forEach((_targetline, index)=>{
      if (_targetline.hidden) return;

      var convex = Utils.deepCopy(_targetline);
      convex.position.splice(0, 0, {
          x: grid.x, y: grid.y + grid.h
      });

      //最后一个
      {
          var lastx = convex.position[convex.position.length - 1].x;
          convex.position.push({
              x: lastx, y: grid.y + grid.h
          });
      }


      convex.strokeColor = convex.strokeColor || style.strokeColor;
      convex.width = convex.width || style.width;
      convex.bgColor = convex.bgColor || style.bgColor;


      if (convex.bgColor) {
          Utils.fillConvex(this.baseCtx, convex);
      }

      Utils.drawConvex(this.baseCtx, convex, 1, convex.position.length - 1);

      if (this.noJoinStyle) return;

      convex.position.forEach((_targetpoint, index)=>{
        if(index < 1) return;
        var circle = Utils.deepCopy(_targetpoint);
        if (style.point.R) {
            circle.r = style.point.R;
            circle.color = _targetline.strokeColor;
            Utils.drawCircle(this.baseCtx, circle);
        }
        if (style.point.r) {
            circle.r = style.point.r;
            circle.color = style.point.centerColor;
            Utils.drawCircle(this.baseCtx, circle);
        }
      })
    });
    if (style.zIndexChange == 'decrease') this.line = this.line.reverse();
};


Handle.prototype._privateCheckConfig = function () {
    try {
        let {data, style, option} = this.componentData;
        if (data == undefined || style == undefined) return DEFINE_PARAMETER_ERROR;

        if (data.commFlag.length == 0) {
            style.flagInfo.commFlag.show = false;
        }

        if (data.xCoordinate.length == 0) {
            style.coordinateSystem.xCoordinate.show = false;
        }

        if(option.moveCanShowDataFlag != false) option.moveCanShowDataFlag = true;
        if(option.legendCanControlShow != false) option.legendCanControlShow = true;

        {
            var maxPointCnt = 0, minPointCnt = 0;
            var onShowLine = false;

            data.line.filter((_targetline) => _targetline.hidden == false).map((_targetline)=>{
                onShowLine = true;
                maxPointCnt = Math.max(maxPointCnt, _targetline.point.length);
                minPointCnt = Math.max(minPointCnt, _targetline.point.length);
            })


            if (onShowLine == false) {
                console.error("all line hidden");
                return DEFINE_PARAMETER_ERROR;
            }

            if (minPointCnt == 0) {
                console.error("config has line with empty point");
                return DEFINE_PARAMETER_ERROR;
            }


            if (style.flagInfo.commFlag.show == true  &&  data.commFlag.length < maxPointCnt) {
                console.warn("commFlag count < maxPointCnt, will error");
                return DEFINE_PARAMETER_ERROR;
            }

            if (style.coordinateSystem.xAxis.show == true  &&  data.xCoordinate.length < maxPointCnt) {
                console.warn("xCoordinate count < maxPointCnt, will error");
                return DEFINE_PARAMETER_ERROR;
            }

        }
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



    let screen = this.componentData.style.screen;
    if (screen.w == 0 || screen.h == 0) {
        console.error("screen.w == 0 or screen.h == 0, maybe something wrong");
        return DEFINE_GET_SYSTEM_SIZE_ERROR;
    }

    this.borderScreen = {
        maxW: screen.w,
        maxH: screen.h,
        x: screen.margin.left,
        y: screen.margin.top,
        w: screen.w - screen.margin.left - screen.margin.right,
        h: screen.h - screen.margin.top - screen.margin.bottom,
    };
    return 0;
};


//整理线段数据
Handle.prototype._privateInitChartData = function () {
    let {data, option} = this.componentData;

    data.line.forEach((_targetline, index)=>{_targetline.idx = index});



    let xCoordinate = data.xCoordinate;
    if (option.yCoordinateDependOnShowData == true) {         //去除掉不展示的line
        this.line = [];
        this.line = data.line.filter((_targetline)=>_targetline.hidden == false);
    } else {
        this.line = Utils.deepCopy(data.line);
    }

    let line = this.line;
    if (line.length == 0) return DEFINE_LINE_EMPTY_ERROR;

    //x放心的点固定个数  lineFixedMaxPointCount
    if (isNaN(option.lineFixedMaxPointCount) || option.lineFixedMaxPointCount <= 0) {
        this.lineFixedMaxPointCount = 0;
        this.line.forEach((_targetline)=>{this.lineFixedMaxPointCount = Math.max(this.lineFixedMaxPointCount, _targetline.point.length)});
        this.lineFixedMaxPointCount = Math.max(this.lineFixedMaxPointCount, xCoordinate.length);
    } else {
        this.lineFixedMaxPointCount = parseInt(option.lineFixedMaxPointCount);
    }

    //截断point.length
    line.forEach((target)=>{target.point.length = Math.min(target.point.length, this.lineFixedMaxPointCount)});


    //是否有小数
    this.hasFloatValue = false;

    for (var cnt = 0; cnt < line.length; cnt++) {
        if(this.hasFloatValue == true) break;
        for (var idx = 0; idx < line[cnt].point.length; idx++) {
            if (line[cnt].point[idx].value % 1 === 0) continue;
            this.hasFloatValue = true;
            break;
        }
    }

    //把小数规整为整数 this.beishu
    if (this.hasFloatValue == true) {
        this.beishu = Math.pow(10, option.valueToFixed);
    } else {
        this.beishu = 1;
    }


    //最小值 this.valueMin
    if (option.yCoordinateFixedMin == undefined) {
        this.valueMin = Infinity;
        line.forEach((_targetline)=>{
          _targetline.point.forEach((_targetpoint)=>{
            this.valueMin = Math.min(this.valueMin, _targetpoint.value * this.beishu);
          })
        })
    } else {
        this.valueMin = option.yCoordinateFixedMin * this.beishu;
    }

    //最大值 this.valueMax
    if (option.yCoordinateFixedMax == undefined) {
        this.valueMax = -Infinity;
        line.forEach((_targetline)=>{
          _targetline.point.forEach((_targetpoint)=>{
            this.valueMax = Math.max(this.valueMax, _targetpoint.value * this.beishu);
          })
        })
    } else {
        this.valueMax = option.yCoordinateFixedMax * this.beishu;
    }


    //取整
    this.valueMax = parseInt(this.valueMax);
    this.valueMin = parseInt(this.valueMin);


    //查一下 y轴 等分多少份
    {
        this.yCnt = this.componentData.option.yCoordinateFixedCount - 1;
        if(isNaN(this.yCnt)) this.yCnt = 4;
        if (this.yCnt == undefined || this.yCnt < 1) this.yCnt = 4;
    }

    //计算坐标的起点、单位大小 this.baseValue  this.unitValue
    {
        var {st, unit} = __getYCoordinateList(this.valueMax, this.valueMin, this.yCnt);
        this.unitValue = unit / this.beishu;
        if (this.hasFloatValue) {
            this.unitValue = this.unitValue.toFixed(option.valueToFixed);
            this.baseValue = (st / this.beishu).toFixed(option.valueToFixed);

            this.unitValue = parseFloat(this.unitValue);
            this.baseValue = parseFloat(this.baseValue);
        } else {
            this.unitValue = Math.ceil(this.unitValue);
            this.baseValue = st;
        }
    }
    return 0;
};

//整理Y轴坐标
Handle.prototype._privateInitYCoordinante = function () {
    var coordinateSystemStyle = this.componentData.style.coordinateSystem;
    var targetStyle = coordinateSystemStyle.yCoordinate;
    var valueToFixed = this.componentData.option.valueToFixed;

    this.yCoordinate = [];
    if (!targetStyle.show) {
        this.borderYCoordinate = {x: 0, w: 0, maxW: 0};
        return;
    }

    var maxWordWith = 0;

    for (var cnt = 0; cnt <= this.yCnt; cnt++) {
        var word = Utils.deepCopy(targetStyle);
        word.value = this.baseValue + this.unitValue * cnt;

        if (this.hasFloatValue) {
            word.value = word.value.toFixed(valueToFixed)
        }
        word._value = word.value;
        word.value = Utils.formatNumber(word.value, this.componentData.option);
        word.width = Utils.getWordWidth(word.value, word.fontSize);

        maxWordWith = Math.max(maxWordWith, word.width);
        this.yCoordinate.push(word);
    }


    this.borderYCoordinate = {
        x: this.borderScreen.x + targetStyle.marginLeft,
        w: maxWordWith,
        maxW: maxWordWith + targetStyle.marginLeft + targetStyle.marginRight
    };


};

//整理x轴坐标
Handle.prototype._privateInitXCoordinante = function () {
    let {data, option, style} = this.componentData;

    this.xCoordinate = [];

    let targetValue = Utils.deepCopy(data.xCoordinate);
    let targetStyle = style.coordinateSystem.xCoordinate;


    if (targetStyle.show != true) {
        this.borderXCoordinate = {x: 0, y: 0, w: 0, h: 0, maxH: 0, maxW: 0};
        return;
    }

    //1. 用 lineFixedMaxPointCount 修改 xCoordinate 的长度；
    targetValue.length = Math.min(targetValue.length, this.lineFixedMaxPointCount);


    //2.print x轴坐标的 间隔 x[0], x[0+xCoordinateDis]
    if (isNaN(option.xCoordinateFixedCount) || option.xCoordinateFixedCount < 1) option.xCoordinateFixedCount = 7;
    this.xCoordinateDis = Math.ceil(targetValue.length / (option.xCoordinateFixedCount));

    if (this.xCoordinateDis < 1) this.xCoordinateDis = 1;
    for (var cnt = 0; cnt < targetValue.length; cnt += this.xCoordinateDis) {
        var word = Utils.deepCopy(targetStyle);
        word.cnt = cnt;
        word.value = targetValue[cnt];
        word.width = Utils.getWordWidth(word.value, word.fontSize);
        this.xCoordinate.push(word);
    }

    //3.计算position
    this.borderXCoordinate = {
        x: undefined,
        w: undefined,
        y: this.borderScreen.y + this.borderScreen.h - targetStyle.fontSize - targetStyle.marginBottom,
        h: targetStyle.fontSize,
        maxH: targetStyle.fontSize + targetStyle.marginTop + targetStyle.marginBottom
    };
};

//整理图例
Handle.prototype._privateInitLegend = function () {
    let targetStyle = this.componentData.style.legend;
    let targetLine = this.componentData.data.line;

    this.legend = {
        show: false, value: [], style: {}
    };

    if (targetStyle.show != true)  return;

    this.legend.show = true;

    for (var cnt = 0; cnt < targetLine.length; cnt++) {
        var item = {
             text: targetLine[cnt].legend,
        };

        if(targetLine[cnt].hidden) item.color = targetStyle.icon.defaultColor;
        else item.color = this.componentData.option.seriesColor[cnt];

        this.legend.value.push(item);
    }


    //legend  legend_item   legend_icon  legend_text
    var legendStyle = this.legend.style;
    legendStyle.legend = Utils.toCssStyle(targetStyle.margin);
    legendStyle.legend_text = Utils.toCssStyle(targetStyle.text);
    legendStyle.legend_icon = Utils.toCssStyle(targetStyle.icon);

};

//画浮层
Handle.prototype._privateDrawFloat = function (tapX) {
    var disx = tapX - this.borderGird.x;
    if (disx < 0) disx = 0;

    var targetIdx = Math.round(disx / this.unitW);
    if (targetIdx < 0) targetIdx = 0;
    if (targetIdx > this.lineFixedMaxPointCount - 1) targetIdx = this.lineFixedMaxPointCount - 1;

    var targetPosX = -1;

    var flagList = [];  //flag的集合
    var lineCircle = [];

    //线段上的目标点 涂颜色
    for (var li = 0; li < this.line.length; li++) {
        if (this.line[li].hidden) continue;
        if (this.line[li].position.length <= targetIdx) continue;

        //显示选中的点；
        lineCircle.push({
            x: this.line[li].position[targetIdx].x,
            y: this.line[li].position[targetIdx].y,
            color: this.line[li].strokeColor,
            r: this.componentData.style.line.point.R
        });


        targetPosX = this.line[li].position[targetIdx].x;

        var word = Utils.deepCopy(this.componentData.style.flagInfo.text);
        word.value = this.line[li].point[targetIdx].flag;
        flagList.push(word);
    }

    if (targetPosX == -1) return;

    let targetStyle = this.componentData.style.flagInfo;

    //parallelYLine
    if (targetStyle.parallelYLine.show) {
        Utils.drawLine(this.floatCtx, {
            stPos: {x: targetPosX, y: this.borderGird.y},
            edPos: {x: targetPosX, y: this.borderGird.y + this.borderGird.h},
            color: targetStyle.parallelYLine.color,
            width: targetStyle.parallelYLine.width,
        });
    }

    //lineCircle
    lineCircle.forEach((circle)=>{Utils.drawCircle(this.floatCtx, circle)});


    // 整理flagList -> maxWordWidth;
    var maxWordWidth = 0;
    flagList.forEach(function (word) {
        word.width = Utils.getWordWidth(word.value, word.fontSize);
        maxWordWidth = Math.max(maxWordWidth, word.width);
    });
    maxWordWidth += targetStyle.text.margin.left + targetStyle.text.margin.right;

    if (targetStyle.icon) {
        maxWordWidth += targetStyle.icon.size + targetStyle.icon.margin.left + targetStyle.icon.margin.right;
    }


    var maxWordHigth = 0;

    var commFlag = {};
    if (targetStyle.commFlag.show) {
        if (this.componentData.data.commFlag[targetIdx]) {
            commFlag = Utils.deepCopy(targetStyle.commFlag);
            commFlag.value = this.componentData.data.commFlag[targetIdx];

            commFlag.width = Utils.getWordWidth(commFlag.value, commFlag.fontSize);

            maxWordWidth = Math.max(maxWordWidth,
                commFlag.width + targetStyle.commFlag.margin.left + targetStyle.commFlag.margin.right);

            maxWordHigth += targetStyle.commFlag.fontSize
                + targetStyle.commFlag.margin.top
                + targetStyle.commFlag.margin.bottom;
        }
    }

    maxWordHigth += flagList.length *
        (targetStyle.text.fontSize + targetStyle.text.margin.top + targetStyle.text.margin.bottom);


    //box 先画
    var box = {
        w: maxWordWidth + targetStyle.box.padding.left + targetStyle.box.padding.right,
        h: maxWordHigth + targetStyle.box.padding.top + targetStyle.box.padding.bottom,
        strokeColor: targetStyle.box.strokeColor,
        fillColor: targetStyle.box.fillColor,
    };

    var boxPositionX = targetPosX + targetStyle.box.margin.left;
    if (boxPositionX + box.w > this.borderScreen.x + this.borderScreen.w) {
        boxPositionX = targetPosX - box.w - targetStyle.box.margin.right;
        if (boxPositionX < this.borderScreen.x) {
            console.error("The flag info can not be completely written on the screen, screen:", this.borderScreen);
        }
    }

    box.x = boxPositionX;
    box.y = this.borderGird.y + targetStyle.box.margin.top;
    Utils.drawRect(this.floatCtx, box);

    var startX = box.x + targetStyle.box.padding.left;
    var startY = box.y + targetStyle.box.padding.top;

    //commFlag 画
    if (commFlag.show) {
        commFlag.x = startX + commFlag.margin.left;
        commFlag.y = startY + commFlag.margin.top;
        Utils.drawWord(this.floatCtx, commFlag);

        startY += commFlag.margin.top + commFlag.fontSize + commFlag.margin.bottom;
    }

    //word
    flagList.forEach((word,index)=>{
      var iconStyle = targetStyle.icon;
      var startX = box.x + targetStyle.box.padding.left;
      if (iconStyle.show) {
          if (iconStyle.style == 'rect') {
              Utils.drawRect(this.floatCtx, {
                  x: startX + iconStyle.margin.left,
                  y: startY + (iconStyle.margin.top + iconStyle.size + iconStyle.margin.bottom) * index,
                  w: iconStyle.size,
                  h: iconStyle.size,
                  color: lineCircle[index].color
              })
          } else {
              var r = parseInt(iconStyle.size / 2);
              Utils.drawCircle(this.floatCtx, {
                  x: startX + iconStyle.margin.left + r,
                  y: startY + (iconStyle.margin.top + iconStyle.size + iconStyle.margin.bottom) * index + r,
                  r: r,
                  color: lineCircle[index].color
              })
          }
          startX += iconStyle.margin.left
              + iconStyle.size + iconStyle.margin.right;
      }
      word.x = startX + targetStyle.text.margin.left;
      word.y = startY + (word.margin.top + word.margin.bottom + word.fontSize) * index + parseInt(word.fontSize / 2);
      word.textBaseline = 'middle';
      Utils.drawWord(this.floatCtx, word);
    })

};

//确定位置
Handle.prototype._privateDecidePosition = function () {
    //X轴
    this.borderXCoordinate.x = this.borderScreen.x + this.borderYCoordinate.maxW;
    this.borderXCoordinate.w = this.borderScreen.w + this.borderScreen.x - this.borderXCoordinate.x;

    //gird
    this.borderGird = {
        x: this.borderXCoordinate.x,
        w: this.borderXCoordinate.w,
        y: this.borderScreen.y,
        h: this.borderScreen.h - this.borderXCoordinate.maxH,
    };

    this.unitH = this.borderGird.h / (this.yCnt * this.unitValue);

    if (this.lineFixedMaxPointCount == 1) this.unitW = this.borderGird.w;
    else this.unitW = this.borderGird.w / (this.lineFixedMaxPointCount - 1);


    //Y轴
    this.borderYCoordinate.y = this.borderGird.y;
    this.borderYCoordinate.h = this.borderGird.h;

    //整理x轴坐标
    {
        this.gridPosX = [];
        this.xCoordinate.forEach((target)=>{
          target.x = this.borderXCoordinate.x + target.cnt * this.unitW;
          target.y = this.borderXCoordinate.y;

          this.gridPosX.push(target.x);
        })
    }

    //整理Y轴坐标
    {
        this.gridPosY = [];
        this.yCoordinate.forEach((target)=>{
          target.x = this.borderYCoordinate.x;
          target.y = this.borderYCoordinate.y + this.borderYCoordinate.h - (target._value - this.baseValue) * this.unitH;

          this.gridPosY.push(target.y);
        })
    }

    //line
    this._privateDecidePointPosition();
};


Handle.prototype._privateDecidePointPosition = function () {
    let option = this.componentData.option;
    this.line.forEach((_targetline)=>{
      var _idx = _targetline.idx;
      _targetline.strokeColor = option.seriesColor[_idx];
      _targetline.bgColor = option.everyLineBgColor[_idx];
      _targetline.position = [];

      _targetline.point.forEach((_targetpoint, idx) => {
        _targetline.position.push({
          x: this.borderGird.x + this.unitW * idx,
          y: this.borderGird.y + this.borderGird.h - (_targetpoint.value - this.baseValue) * this.unitH
        })
      })
    })
};

function __getYCoordinateList(max, min, yCnt) {
    if (yCnt == 1 && max == min) {
        return {st: 0, unit: min, ycnt: 3}
    }


    var realDis = max - min;
    if (realDis < yCnt) {    //间隔比y轴个数还少的
        if (min == 0 || realDis == yCnt) {
            return {st: min, unit: 1}
        } else {
            return {st: min - 1, unit: 1}
        }
    }
    var stArr = __regularToArr(min);
    var bestSt = min;
    var bestUint = Math.ceil((max - min) / yCnt);

    var minDis = Infinity;
    for (var cnt = 0; cnt < stArr.length; cnt++) {
        var st = stArr[0];
        if (st == min) continue;
        var uint = Math.ceil((max - st) / yCnt);

        uint = __regular(uint, 1);
        var dis = st + uint * yCnt - max;
        if (dis >= 0 && dis < minDis) {
            minDis = dis;
            bestUint = uint;
            bestSt = st;
        }
    }

    if (bestSt == min && min != 0) {
    }
    return {st: bestSt, unit: bestUint};


    function __regularToArr(number, op) {   //op = 0 or 1
        var flag = 1;
        if (number < 0) {
            flag = -1;
            number = -number;
            op = !op;
        }

        var str = number.toString();
        var arr = str.split('');
        var targetArr = [];
        for (var cnt = arr.length - 1; cnt >= 0; cnt--) {
            arr[cnt] = '0';
            if (op == 1) {
                if (cnt == 0) {
                    arr.unshift(1);
                } else {
                    arr[cnt - 1]++;
                }
            }
            targetArr.push(parseInt(arr.join('')) * flag);
        }
        return targetArr;

    }

    /**
     * 把 123 -> 130;   1211 -> 1300   999 -> 1000
     * @param number
     * @param op
     * @returns {number}
     */
    function __regular(number, op) {  //op = 0 or 1
        var flag = 1;
        if (number < 0) {
            flag = -1;
            number = -number;
            op = !op;
        }
        var str = number.toString();
        var arr = str.split('');
        if (arr.length < 2) return number * flag;

        var st = arr.length - parseInt(arr.length / 2);
        for (var cnt = st; cnt < arr.length; cnt++) {
            arr[cnt] = '0';
        }
        arr[st - 1]++;

        // 防止 9 + 1 的问题
        for (var cnt = st - 1; cnt >= 0; cnt--) {
            if (arr[cnt] == '10' && cnt != 0) {
                arr[cnt] = '0';
                arr[cnt - 1]++;
            }
        }
        return parseInt(arr.join('')) * flag
    }

}
