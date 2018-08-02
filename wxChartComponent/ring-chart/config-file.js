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
        //方案1
        // everyStrokeColor：['#42C642', '#FFAA00', '#00C0C8'],
        // everyFillColor：['rgba(66, 198, 66, 0.2)', 'rgba(255, 170, 0, 0.1)', 'rgba(0, 192, 200, 0.1)'],

        //配色方案二：
        //everyStrokeColor：['#7587DB', '#FFAA00', '#00C5DC'],
        //everyFillColor：['rgba(117, 135, 219, 0.2)', 'rgba(255, 170, 0, 0.1)', 'rgba(0, 197, 220, 0.1)'],

        seriesColor: ['#7587DB', '#FFAA00', '#00C5DC', '#75DB77', '#E67272', '#00C5DC', '#FFAA00', '#75DB77', '#E67272'],      //颜色

        legendCanControlShow: true,     //图例可以控制线段的展示与否
        // moveCanShowDataFlag: true,      //手机滑动可以查看对应数据标签

        valueToFixed: 2,                //数据含小数，规整为几位小数
         valueToCollated: [
            {rangeStart: 0, rangeEnd: 1e4, base: 1, wording: ''},
            {rangeStart: 1e4, rangeEnd: 1e5, base: 1e3, wording: '千'},   //range: {x | 1000 <= x < 10000}  9999 -> 9.99千
            {rangeStart: 1e5, rangeEnd: 1e8, base: 1e4, wording: '万'},
            {rangeStart: 1e8, rangeEnd: 1e9, base: 1e7, wording: '千万'},
            {rangeStart: 1e9, rangeEnd: Infinity, base: 1e8, wording: '亿'},
        ],      //数据规整
        valueUseComma: true,

        firstStartDu: 0,                     //第一个元素起始角度
        sizeUnit: 'rpx',                 //只支持 px 或 rpx 俩种边距单位
    },
    style: {
        pie: {
            r: 70,
            R: 140,
            centerColor: '#FFFFFF',     //当r != 0 时，中心涂的颜色
            defaultColor: '#888888',    //当没有写color时候
            margin: {
                top: 10, right: 10, bottom: 10, left: 10
            },  // 内边距
        },
        legend: {
            show: true,   //true or false;
            icon: {       //图例的图标,颜色受对应的canvasOption.seriesColor 控制
                style: 'rect',  // circle rect
                size: '30rpx',
                defaultColor: '#888888',
                margin: '10rpx',
            },
            text: {
                show: true,
                fontSize: '24rpx',
                fontFamily: '',
                fontWeight: '',
                color: '#888888',
                margin: '10rpx',

            },
            value: {
                show: true,
                fontSize: '24rpx',
                fontFamily: '',
                fontWeight: '',
                color: '#888888',
                margin: '10rpx',
            },
            percentage: {
                show: true,
                fontSize: '24rpx',
                fontFamily: '',
                fontWeight: '',
                color: '#888888',
                margin: '10rpx',
            },
            margin: '0rpx 20rpx 0rpx 0rpx',
        },

        flagInfo: {    //数据详情, 手机滑动可以查看的
            parallelYLine: {
                show: true,
                color: '#FFFFFF',
                width: 0.5, //px
            },
            box: {
                strokeColor: 'rgba(136, 136, 136, 0.8)',
                fillColor: 'rgba(136, 136, 136, 0.8)',
                padding: {top: 10, right: 8, bottom: 10, left: 10},  //单位 canvasOption.sizeUnit 
                margin: {top: 2, left: 5, right: 5}
            },
            text: {   //图例后面的文字
                color: '#FFFFFF',
                fontSize: 11,
                fontFamily: '',
                fontWeight: '',
                wordsPadding: 8,  //文字的间隔
                margin: {top: 4, right: 3, bottom: 2, left: 3},
            },
            icon: {
                show: true,
                color: '#e8e8e8',
                style: 'circle',   //rect , circle
                size: 11,
                margin: {top: 4, right: 3, bottom: 2, left: 3},
            },  //带图例

        },
    },
    /**
     data: {
        pie: [{
            legend: '图例1',          //该扇形对应的图例
            hidden: false,
            value: 223,
            percentage: ,   //内部计算

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
    if (!word)  word = '未知错误：[' + errorCode + ']'
    return word;
}


function _createCanvasData() {
    var canvasData = {pie: []};
    var PieCount = 5;  //一共三条折线
    for (var li = 0; li < PieCount; li++) {
        var pie = {
            legend: '图例' + li,
            hidden: false,
            // value: (li + 1) * (li + 2),
            value: (li + 4) * (li * 100) * (li + 3),
        };
        canvasData.pie.push(pie);
    }
    return canvasData
}
