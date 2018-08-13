module.exports = {

    deepCopy: deepCopy,
    getWordWidth: getWordWidth,
    getWordHeight: getWordHeight,

    getSystemInfo: getSystemInfo,
    getSysWindowWidth: getSysWindowWidth,


    drawWord: drawWord,
    drawLine: drawLine,
    drawCircle: drawCircle,
    drawRect: drawRect,

    fillConvex: fillConvex, //涂一个多边形
    drawConvex: drawConvex,


    toCssStyle: toCssStyle,  //转化为css style

    formatStyleSize: formatStyleSize,    //统一更改canvasStyle的边距数值 rpx->px
    formatNumber: formatNumber,   //数字修改：加单位，加千位分隔符

    deg2rad: deg2rad, // 度数转弧度
    textOverflow: textOverflow, // 超过长度的部分字符串用其他符号代替
};

function getWordHeight(str, fontSize) {
    return fontSize;
}

/* @params
 * str          待处理的字符串
 * fontSize     字体大小
 * allowWidth   允许的最大长度
 * replaceStr   若超长，则用这个代替，默认是"..."
 */
function textOverflow(str, fontSize, allowWidth, replaceStr) {
    if (replaceStr == undefined) replaceStr = '...';

    var result = str;
    while (getWordWidth(result, fontSize) > allowWidth && str.length > 0) {
        str = str.substr(0, str.length - 1);
        result = str + replaceStr;
    }
    return result;
}

function deg2rad(degree) {
    return degree / 180 * Math.PI;
}

function formatNumber(number, option) {
    function isNumber(a) {
        return parseFloat(a).toString() == a
    }

    if (isNaN(parseFloat(number)) || !isNumber(number)) {
        return number;
    }
    if (isNaN(option.valueToFixed)) option.valueToFixed = 2;

    //1.小数fixed
    if (number.toString().indexOf('.') !== -1) {
        number = parseFloat(number).toFixed(option.valueToFixed || 3);
    }

    //2. 带单位
    var {_number, _unit} = _toCalcUnit(number, option.valueToCollated);

    //3. 如果是小数，精确小数位
    if (_number % 1 != 0) {

        _number = option.valueToFixed !== undefined ?
         _number.toFixed(option.valueToFixed) : _number.toFixed(2);
    }


    //4. 千位分隔符
    if (option.valueUseComma) {
        var source = _number.toString();
        var decimalPointIdx = source.indexOf('.');
        if (decimalPointIdx == -1) decimalPointIdx = source.length;

        var result = [];
        result.push(source.slice(decimalPointIdx));

        var array = source.split('');
        var idx = 0;
        for (var cnt = decimalPointIdx - 1; cnt >= 0; cnt--) {
            idx++;
            result.push(array[cnt]);
            if (idx % 3 == 0 && cnt != 0) result.push(',');
        }
        result.reverse();
        _number = result.join("");
    }

    return _number + _unit;

    function _toCalcUnit(number, valueToCollated) {
        if (valueToCollated == undefined || valueToCollated.length == 0) return {_number: number, _unit: ''}

        valueToCollated.sort(function (targetA, targetB) {
            return targetA.base - targetB.base;
        });
        var base = 1;
        var unit = '';

        for (var cnt = 0; cnt < valueToCollated.length; cnt++) {
            if (valueToCollated[cnt].rangeStart == null) valueToCollated[cnt].rangeStart = -Infinity;
            if (valueToCollated[cnt].rangeEnd == null) valueToCollated[cnt].rangeEnd = Infinity;

            if (Math.abs(number) >= valueToCollated[cnt].rangeStart && Math.abs(number) < valueToCollated[cnt].rangeEnd) {
                base = valueToCollated[cnt].base;
                unit = valueToCollated[cnt].wording;
                break;
            }
        }
        return {_number: number / base, _unit: unit};
    }
}

//统一更改canvasStyle的边距数值, unit:换算为px的单位比例
function formatStyleSize(target, unit) {
    if (unit == 0) {
        console.error("ERR: unit can't equal 0");
        throw 'error';
    }

    if (unit == 1) return target;

    if (typeof (target) == 'object') {
        for (var key in target) {
            if (typeof(target[key]) == 'object') {
                formatStyleSize(target[key], unit);
            } else {
                var keyword = [
                    'top', 'right', 'bottom', 'left',
                    'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
                    'paddingTop', 'paddingLeft', 'paddingBotton', 'paddingRight',
                    'r', 'R', 'size',
                    'width', 'height', 'h', 'w',
                    'fontSize', 'wordsPadding'];

                if (keyword.indexOf(key) != -1) {
                    target[key] *= unit;
                }
            }
        }
    } else {
        target = target * unit;
    }
    return target;
}


function toCssStyle(target) {
    var style = "";
    if (target.show !== undefined && target.show == false) return 'display:none;';
    if (target.hidden !== undefined && target.hidden == true) return 'display:none;';


    var keyList = ['height', 'width', 'minWidth', 'maxWidth',
        'textAlign', 'fontSize', 'fontFamily', 'fontWeight',
        'wordBreak', 'overflow', 'textOverflow', 'whiteSpace',
        'lineHeight', 'verticalAlign',
        'color', 'backgroundColor',
        'margin', 'padding',
        'marginTop', 'marginLeft', 'marginBotton', 'marginRight',
        'paddingTop', 'paddingLeft', 'paddingBotton', 'paddingRight',
        'border', 'borderRadius'];
    var mapCssKey = {
        'height': 'height',
        'width': 'width',
        'minWidth': 'min-width',
        'maxWidth': 'max-width',
        'wordBreak': 'word-break',
        'textAlign': 'text-align',
        'fontSize': 'font-size',
        'fontFamily': 'font-family',
        'fontWeight': 'font-weight',
        'lineHeight': 'line-height',
        'overflow': 'overflow',
        'textOverflow': 'text-overflow',
        'whiteSpace': 'white-space',
        'verticalAlign': 'vertical-align',
        'color': 'color',
        'backgroundColor': 'background-color',
        'margin': 'margin',
        'padding': 'padding',
        'marginTop': 'margin-top',
        'marginLeft': 'margin-left',
        'marginBottom': 'margin-bottom',
        'marginRight': 'margin-right',
        'paddingTop': 'padding-top',
        'paddingLeft': 'padding-left',
        'paddingBottom': 'padding-bottom',
        'paddingRight': 'padding-right',
        'border': 'border',
        'borderRadius': 'border-radius',
    };


    for (var key in target) {
        if (!target[key]) continue;
        if (key == 'style') {
            style += 'width:' + target.size + ';';
            style += 'height:' + target.size + ';';
        }
        else if (key == 'style') {
            if (target.style == 'rect') {
                style += 'border-radius:' + '0px' + ';';
            } else if (target.style == 'circle') {
                style += 'border-radius:' + '100%' + ';';
            }
        } else {
            if (keyList.indexOf(key) == -1) continue;
            var csskey = mapCssKey[key];
            style += csskey + ':' + target[key] + ';';
        }
    }
    return style;
}

function deepCopy(o) {
    if(o == undefined) return undefined;
    if (typeof(o) === 'object') {
        let obj = (o.constructor === Array) ? [] : {};
        for (let key in o) {
            obj[key] = deepCopy(o[key]);
        }
        return obj;
    } else return o;
}


function getWordWidth(val, fontSize) {
    if (val == null) return 0;
    val = String(val);
    var totLength = 0;
    for (var i = 0; i < val.length; i++) {
        var strCode = val.charCodeAt(i);
        if (strCode > 128) {
            // if((strCode>65248)||(strCode==12288)) {
            totLength += fontSize;
        }
        else {
            totLength += fontSize / 2;
        }
    }
    return Math.ceil(totLength);

}

function getSystemInfo() {
    var info = {windowWidth: 0, screenWidth: 0};

    for (var cnt = 0; cnt < 3; cnt++) {
        info = wx.getSystemInfoSync();
        if (info == {} || info == undefined || info.length == 0) continue;

        if (info.windowWidth == undefined || info.windowWidth == 0) {
            if (info.screenWidth == undefined || info.screenWidth == 0) {
                continue;
            }
            info.windowWidth = info.screenWidth;
            break;
        }

        if (info.screenWidth == undefined || info.screenWidth == 0) {
            if (info.windowWidth == undefined || info.windowWidth == 0) {
                continue;
            }
            info.screenWidth = info.windowWidth;
            break;
        }
    }

    if (info == undefined) info = {windowWidth: 0, screenWidth: 0};
    if (info.windowWidth == undefined)info.windowWidth = 0;
    if (info.screenWidth == undefined)info.screenWidth = 0;

    if (info.screenWidth != 0) {
        //获取成功 && 存储下来info;
        wx.setStorageSync('systemInfo', info);
    } else {
        //尝试获取存储的info;
        info = wx.getStorageSync('systemInfo');
        if (info == undefined) info = {windowWidth: 0, screenWidth: 0};
    }
    return info;
}

function getSysWindowWidth() {
    var utilSysInfo = getApp().systemInfo;
    if (utilSysInfo == null || utilSysInfo.screenWidth == undefined || utilSysInfo.screenWidth == 0) {
        utilSysInfo = getSystemInfo();
        if (utilSysInfo.screenWidth == 0) {
            console.error("获取设备屏幕宽度失败");
        }
        return utilSysInfo.screenWidth;
    }
    return utilSysInfo.screenWidth;
}


function drawWord(ctx, word) {
    if (word.value == undefined) return;

    ctx.beginPath();
    if (isNaN(word.fontSize)) word.fontSize = 12;
    ctx.setFontSize(word.fontSize);

    if (word.color)ctx.setFillStyle(word.color);

    if (word.textAlign) ctx.setTextAlign(word.textAlign);
    if (word.textBaseline) ctx.setTextBaseline(word.textBaseline);

    if (typeof(word.value) == "number")
        word.value = word.value.toString();
    ctx.fillText(word.value, word.x, word.y);
    ctx.stroke();
    ctx.closePath();
}


function drawLine(ctx, line) {
    ctx.beginPath();
    if (isNaN(line.width))  line.width = 1;
    ctx.setLineWidth(line.width);

    if (line.color) ctx.setStrokeStyle(line.color);

    if (line.stPos && line.edPos) {
        ctx.moveTo(line.stPos.x, line.stPos.y);
        ctx.lineTo(line.edPos.x, line.edPos.y);
    }

    ctx.stroke();
    ctx.closePath();
}

function fillConvex(ctx, convex) {
    ctx.beginPath();

    if (convex.bgColor) ctx.setFillStyle(convex.bgColor);
    else return;

    for (var cnt = 0; cnt < convex.position.length; cnt++) {
        if (cnt == 0) {
            ctx.moveTo(convex.position[cnt].x, convex.position[cnt].y);
        } else {
            ctx.lineTo(convex.position[cnt].x, convex.position[cnt].y);
        }
    }
    ctx.fill();
    ctx.closePath();
}

function drawConvex(ctx, convex, st, ed) {
    ctx.beginPath();

    if (isNaN(convex.width)) convex.width = 1;
    ctx.setLineWidth(convex.width);

    if (convex.strokeColor) ctx.setStrokeStyle(convex.strokeColor);

    var stIdx = st || 0;
    var edIdx = ed || convex.position.length;
    edIdx = Math.min(edIdx, convex.position.length);


    for (var cnt = stIdx; cnt < edIdx; cnt++) {
        if (cnt == 0) {
            ctx.moveTo(convex.position[cnt].x, convex.position[cnt].y);
        } else {
            ctx.lineTo(convex.position[cnt].x, convex.position[cnt].y);
        }
    }
    ctx.stroke();
    ctx.closePath();
}

function drawCircle(ctx, circle) {
    if (isNaN(circle.r) || circle.r == 0) return;

    ctx.beginPath();
    ctx.moveTo(circle.x, circle.y);

    if (circle.color) {
        ctx.setFillStyle(circle.color);
        ctx.setStrokeStyle(circle.color);
    }
    if (circle.fillColor) ctx.setFillStyle(circle.fillColor);
    if (circle.strokeColor) ctx.setStrokeStyle(circle.strokeColor);


    if (isNaN(circle.startDu)) circle.startDu = 0;
    if (isNaN(circle.endDu)) circle.endDu = 2 * Math.PI;

    // circle.startDu = 0;
    //  circle.endDu = 2 * Math.PI;

    ctx.arc(circle.x, circle.y, circle.r, circle.startDu, circle.endDu);
    ctx.fill();
    ctx.closePath();
}

function drawRect(ctx, rect) {
    ctx.beginPath();
    if (rect.color) {
        ctx.setStrokeStyle(rect.color);
        ctx.setFillStyle(rect.color);
    }
    if (rect.strokeColor) ctx.setStrokeStyle(rect.strokeColor);
    if (rect.fillColor) ctx.setFillStyle(rect.fillColor);

    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.closePath();
}
