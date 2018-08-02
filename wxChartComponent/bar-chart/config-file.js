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
        seriesColor: ['#7587DB', '#FFAA00', '#00C5DC'], //系列颜色
        legendCanControlShow: true, //图例可以控制系列的展示与否
        yCoordinateFixedMax: undefined, //y坐标固定最大值
        yCoordinateFixedMin: 0, //y坐标固定最小值

        yCoordinateFixedCount: 5, //几个y轴坐标, 必须2个起步，否则默认4个。以及几条平行x轴的网格线。不填或小于2则不展示

        valueToFixed: 1, //数据含小数，规整为几位小数
        valueToCollated: [
            {rangeStart: 0, rangeEnd: 1e3, base: 1, wording: ''},
            {rangeStart: 1e3, rangeEnd: 1e5, base: 1e3, wording: '千'},   //range: {x | 1000 <= x < 10000}  9999 -> 9.99千
            {rangeStart: 1e5, rangeEnd: 1e8, base: 1e4, wording: '万'},
            {rangeStart: 1e8, rangeEnd: 1e9, base: 1e7, wording: '千万'},
            {rangeStart: 1e9, rangeEnd: Infinity, base: 1e8, wording: '亿'},
        ],      //数据规整
        valueUsdComma: true, //数据是否加千位分隔符

        sizeUnit: 'rpx', //只支持 px 或 rpx 俩种边距单位, 调控style里面各种边距
    },
    style: {
        screen: {
            w: 750,
            h: 500,
            margin: {
                top: 24,
                right: 11,
                bottom: 24,
                left: 11,
            }, //单位受option.sizeUnit 控制
        },
        legend: {   //css
            show: true,      //true or false;
            icon: {          //图例的图标 强调：颜色受对应的canvasOption.seriesColor控制
                style: 'circle',  // circle rect
                size: '30rpx',
                defaultColor: '#c1c0c3',   //当图例被取消的时候
                margin: '2rpx 8rpx 2rpx 10rpx',    //css
            },
            text: {
                fontSize: '24rpx',
                fontFamily: 'PingFangSC-Light; Microsoft Yahei',
                fontWeight: '',
                color: '#888888',
                margin: '2rpx',    //css
            },
            margin: '5rpx 20rpx 5rpx 30rpx',  //css
        },
        grid: {
            parallelX: { //平行x轴的网格线
                show: true,
                color: '#e8e8e8',
                width: 1,
            },
        },
        coordinateSystem: { //坐标系
            xAxis: {
                show: true,
                color: '#C6C6C6',
                width: 1,
            }, //x轴
            yAxis: {
                show: false,
                color: '#C6C6C6',
                width: 1,
            },
            xCoordinate: {
                show: true, //datasets.xCoordinate.length == 0 强制改为false

                fontSize: 24,
                fontFamily: 'xxx',
                fontWeight: '',
                rotateRadio: 45, // 横坐标的旋转角度（度）

                color: '#222222',
                marginTop: 10,
                marginBottom: 10,

            }, //横坐标
            yCoordinate: {
                show: true,
                fontSize: 24,
                fontFamily: 'xxx',
                fontWeight: 12,
                textAlign: 'right', //文字水平位置 left center right
                textBaseline: 'middle', //文字垂直位置: top、middle、bottom

                color: '#222222',
                marginLeft: 10,
                marginRight: 10,
            }, //纵坐标
        },

        // 跟据条形柱的条数 + 横坐标宽度自适应间隔，当bar的数据过多，或柱子宽度过大，可能实际宽度不会被满足；
        bar: {
            width: 40, // 柱子宽度
            activeColor: '#8EE153', // 选中后变色，再次选中变回原来的颜色。不填则不变色。
            percentageNumber: { // 柱子上的百分比
                show: false,
                fontSize: 15,
                fontFamily: 'xxx',
                fontWeight: '',
                textAlign: 'center',
                color: '#222277',
                marginTop: 0,
                marginBottom: 10,
                valueToFixed: 0, // 不填的话，则用option中的
            },
            number: { // 柱子上的数字
                show: true,
                fontSize: 16,
                fontFamily: 'xxx',
                fontWeight: '',
                textAlign: 'center',
                color: '#222222',
                marginTop: 0,
                marginBottom: 10,
            }
        },

    },
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
    return Utils.deepCopy(config.data);
}

function getOption() {
    return Utils.deepCopy(config.option);
}

function getStyle() {
    return Utils.deepCopy(config.style);
}

function getERRWording(errorCode) {
    var word = config.statusWording[errorCode];
    if (!word) word = '未知错误：[' + errorCode + ']'
    return word;
}

/*
{
    series: [{
        legend: '',
        hidden: false,
        bar: [{
            value: 0,
            extra: {},
        }],
        extra: {},
    }],
    xCoordinate: [],
}

*/
function _createCanvasData() {
    var canvasData = {
        series: [],
        xCoordinate: []
    };

    var seriesCount = 3;
    var barCount = 4;

    for (var i = 0; i < seriesCount; ++i) {
        var series = {
            legend: `系列${i + 1}`,
            hidden: false,
            bar: [],
            extra: {}, // 业务用，触发点击事件时，会把整个bar对象返回回去。
        }
        for (var j = 0; j < barCount; ++j) {
            series.bar.push({
                value: Math.random() * 1e4,
                extra: {}, // 业务用，触发点击事件时，会把整个bar对象返回回去。
            })
        }
        canvasData.series.push(series);
    }

    for (var i = 0; i < barCount; i++) {
        canvasData.xCoordinate.push(`2017年${i + 1}季度`);
    }

    return canvasData;
}
