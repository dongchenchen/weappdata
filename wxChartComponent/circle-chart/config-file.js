var Utils = require('../utils.js');


module.exports = {
    get: get,
    getData: getData,
    getOption: getOption,
    getStyle: getStyle,

    getERRWording: getERRWording,

};


var config = {
    option: {
        seriesColor: ['#7587DB', '#FFAA00', '#00C5DC', '#75DB77', '#E67272', '#00C5DC', '#FFAA00', '#75DB77', '#E67272'],      //线段颜色
        legendCanControlShow: true,     //图例可以控制线段的展示与否

        firstStartDu: 0,                    //第一个元素起始角度
        sizeUnit: 'rpx',                    //只支持 px 或 rpx 俩种边距单位

        valueToFixed: 1,                //数据含小数，规整为几位小数
        valueToCollated: [
            {rangeStart: 0, rangeEnd: 1e4, base: 1, wording: ''},
            {rangeStart: 1e4, rangeEnd: 1e5, base: 1e3, wording: '千'},   //range: {x | 1000 <= x < 10000}  9999 -> 9.99千
            {rangeStart: 1e5, rangeEnd: 1e8, base: 1e4, wording: '万'},
            {rangeStart: 1e8, rangeEnd: 1e9, base: 1e7, wording: '千万'},
            {rangeStart: 1e9, rangeEnd: Infinity, base: 1e8, wording: '亿'},
        ],      //数据规整
        // valueToCollated: undefined,
        valueUseComma: true,
    },
    style: {
        pie: {   //默认位于正中间
            r: 0,
            R: 140,
            centerColor: '#FFFFFF',     //当r != 0 时，中心涂的颜色
            defaultColor: '#888888',    //当canvasOption.seriesColor没有对应颜色时使用
            flagInfo: {                 //数据标签
                show: true,
                line: {
                    r: 160,     //必须大于ring.R
                    width: 2,
                    horizontalLineLength: 20,
                },
                text: {   //图例后面的文字
                    color: '#888888',
                    fontSize: 24,
                    fontFamily: '',
                    fontWeight: '',
                },
            },
            margin: {
                top: 10, right: 200, bottom: 10, left: 200  //单位受canvasOption.sizeUnit控制，left、right不能绝对控制
            }
        },
        legend: {
            show: true,   //true or false;
            icon: {   //图例的图标 强调：颜色受对应的canvasOption.everyLineStrokeColor控制
                style: 'rect',  // circle rect
                size: '30rpx',
                defaultColor: '#888888',
                margin: '10rpx 10rpx 10rpx 30rpx',
            },
            text: {
                show: true,
                fontSize: '24rpx',
                fontFamily: '',
                fontWeight: '',
                color: '#888888',
                margin: '10rpx 10rpx 10rpx 8rpx'
            },
            value: {
                show: true,
                fontSize: '24rpx',
                fontFamily: '',
                fontWeight: '',
                color: '#888888',
                margin: '10rpx 10rpx 10rpx 8rpx'
            },
            percentage: {
                show: true,
                fontSize: '24rpx',
                fontFamily: '',
                fontWeight: '',
                color: '#888888',
                margin: '10rpx 10rpx 10rpx 8rpx'
            },
            margin: '20rpx 20rpx 0 0',
        },
    },
    /**
     data: {
        pie: [{
            legend: '图例1',  //该扇形对应的图例
            hidden: false,   //该扇形是否隐藏
            value: 223,      //该扇形的数值大小
        }],             //数据
    },
     **/
    data: _createCanvasData(),
    statusWording: {
        '0': 'succ',
        '-1': '系统失败',
        '-2': '参数错误',
        '-3': '暂无线段数据',

        '-1001': '获取屏幕参数失败，暂时无法显示图表'
    }
};
function get() {
    return Utils.deepCopy(config);
}
function getData() {
    return _createCanvasData();
}
function getOption() {
    return Utils.deepCopy(config.option);
}
function getStyle() {
    return Utils.deepCopy(config.style);
}
function getERRWording(errorCode) {
    var word = config.statusWording[errorCode];
    if (!word)  word = '未知错误：[' + errorCode + ']';
    return word;
}


function _createCanvasData() {
    var canvasData = {pie: []};
    var PieCount = 5;  //一共三条折线
    for (var li = 0; li < PieCount; li++) {
        var pie = {
            legend: '图例' + li,              //该扇形对应的图例
            hidden: false,                  //该扇形对应的图例
            // value: (li + 3132422311) * (li + 4243),     //该扇形的数值大小

            value: (li * 100) * (li + 1) * (li + 1),     //该扇形的数值大小
        };
        canvasData.pie.push(pie);
    }
    return canvasData
}
