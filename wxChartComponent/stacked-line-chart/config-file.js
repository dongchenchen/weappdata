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
        // points：['#42C642', '#FFAA00', '#00C0C8'],
        // bgColor：['rgba(66, 198, 66, 0.2)', 'rgba(255, 170, 0, 0.1)', 'rgba(0, 192, 200, 0.1)'],

        //配色方案二：
        //points：['#7587DB', '#FFAA00', '#00C5DC'],
        //bgColor：['rgba(117, 135, 219, 0.2)', 'rgba(255, 170, 0, 0.1)', 'rgba(0, 197, 220, 0.1)'],

        seriesColor: ['#7587DB', '#FFAA00', '#00C5DC'],      //线段颜色
        everyLineBgColor: ['rgba(117, 135, 219, 1)', 'rgba(255, 170, 0,1)', 'rgba(0, 197, 220,1)'],


        legendCanControlShow: true, //图例可以控制线段的展示与否
        moveCanShowDataFlag: true,      //手机滑动可以查看对应数据标签

        valueToFixed: 2,                //数据含小数，规整为几位小数
           valueToCollated: [
            {rangeStart: 0, rangeEnd: 1e4, base: 1, wording: ''},
            {rangeStart: 1e4, rangeEnd: 1e5, base: 1e3, wording: '千'},   //range: {x | 1000 <= x < 10000}  9999 -> 9.99千
            {rangeStart: 1e5, rangeEnd: 1e8, base: 1e4, wording: '万'},
            {rangeStart: 1e8, rangeEnd: 1e9, base: 1e7, wording: '千万'},
            {rangeStart: 1e9, rangeEnd: Infinity, base: 1e8, wording: '亿'},
        ],      //数据规整
        valueUseComma: true,                         //数据是否加千位分隔符

        yCoordinateFixedMax: undefined,        //y坐标固定最大值
        yCoordinateFixedMin: undefined,        //y坐标固定最小值
        yCoordinateDependOnShowData: true,      //y坐标依赖于只展示的线段

        lineFixedMaxPointCount: undefined,      //线段固定最大点个数  <= 0 自动判断 max{line.points.length，xCoordinate}
        lineExceedPointCountNoJoinStyle: 30,    //线段上的数据点超过30个点后无交点样式


        xCoordinateFixedCount: 10, //几个x轴坐标，最好是可以被 lineFixedMaxCount 整除；以及几条平行y轴的网格线， 默认7个 , 当不能整除时候，只能大概表示稀疏度
        yCoordinateFixedCount: 5,  //几个y轴坐标, 必须2个起步， 否则默认4个。以及几条平行x轴的网格线，

        sizeUnit: 'rpx',           //只支持 px 或 rpx 俩种边距单位, 调控style里面各种边距
    },
    style: {
        screen: {
            w: 750,
            h: 400,
            margin: {
                top: 30, right: 30, bottom: 30, left: 30,
            },    //单位为 option.sizeUnit;
        },
        legend: {   //css
            show: true,   //true or false;
            icon: {   //图例的图标 强调：颜色受对应的canvasOption.seriesColor控制
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
            margin: '5rpx 20rpx 5rpx 30rpx', 
        },
        grid: {
            parallelX: {        //平行x轴的网格线
                show: true,
                color: '#e8e8e8',
                width: 1,       //单位为 option.sizeUnit;

            },
            parallelY: {        //平行y轴的网格线
                show: true,
                color: '#e8e8e8',
                width: 1,       //单位为 option.sizeUnit;
            }
        },
        coordinateSystem: {     //坐标系
            xAxis: {
                show: true,
                color: '#C6C6C6',
                width: 2,       //单位为 option.sizeUnit;
            },          //x轴
            yAxis: {
                show: true,
                color: '#C6C6C6',
                width: 2,       //单位为 option.sizeUnit;
            },
            xCoordinate: {
                show: true,     //datasets.xCoordinate.length == 0 强制改为false

                fontSize: 24,   //单位为 option.sizeUnit;
                fontFamily: 'xxx',
                fontWeight: '',
                textAlign: 'center',

                color: '',
                marginTop: 30,      //单位为 option.sizeUnit;
                marginBottom: 20,   //单位为 option.sizeUnit;
            },    //横坐标
            yCoordinate: {
                show: true,
                fontSize: 24,       //单位为 option.sizeUnit;
                fontFamily: 'xxx',
                fontWeight: undefined,
                textAlign: 'left',      //文字水平位置 left center right
                textBaseline: '',       //文字垂直位置: top、middle、bottom

                color: '#B8B8B8',
                marginLeft: 0,      //单位为 option.sizeUnit;
                marginRight: 20,    //单位为 option.sizeUnit;
            },    //纵坐标
        },

        line: {
            point: { //点
                R: 4,    //空心圆外半径, 单位为 option.sizeUnit;
                r: 2.8,  //空心圆内半径, 单位为 option.sizeUnit;
                centerColor: '#FFFFFF'  //空心填充颜色
            },
            width: 2,   //单位为 option.sizeUnit;
            zIndexChange: 'decrease'  //decrease 递减；  increase 递增
        },
        flagInfo: {    //数据详情, 手机滑动可以查看的
            parallelYLine: {
                show: true,
                color: '#FFFFFF',
                width: 1,  //单位为 option.sizeUnit;
            },
            box: {
                strokeColor: 'rgba(136, 136, 136, 0.8)',
                fillColor: 'rgba(136, 136, 136, 0.8)',
                padding: {top: 30, right: 16, bottom: 20, left: 20},  //单位为 option.sizeUnit;
                margin: {top: 4, left: 10, right: 10}   //单位为 option.sizeUnit;
            },
            commFlag: {
                show: true,   //datasets.commFlag.length == 0 会强制改为 false
                color: '#FFFFFF',
                fontSize: 24,       //单位为 option.sizeUnit;
                fontFamily: '',
                fontWeight: '',
                wordsPadding: 16,  //文字的间隔，单位为option.sizeUnit;
                margin: {top: 10, right: 6, bottom: 10, left: 6},   //单位为 option.sizeUnit;
            },
            text: {   //图例后面的文字
                color: '#FFFFFF',
                fontSize: 24,   //单位为 option.sizeUnit;
                fontFamily: '',
                fontWeight: '',
                wordsPadding: 16, //文字的间隔，单位为option.sizeUnit;
                margin: {top: 8, right: 6, bottom: 4, left: 6},     //单位为 option.sizeUnit;
            },
            icon: {
                show: true,
                color: '#e8e8e8',
                style: 'circle',   //rect , circle
                size: 24,   //单位为 option.sizeUnit;
                margin: {top: 8, right: 6, bottom: 4, left: 6},   //单位为 option.sizeUnit;
            },  //带图例
        },
    },
    /**
     data: {
        line: [{
            legend: '图例1',          //该条先的图例
            hidden: false,             //是否隐藏
            point: [   //线段上的数据点
                {
                    val: 123,           //该点的数据大小
                    flag: 'xx日 xx次数'  //该点的数据标签
                }
            ]
        }],             //线段数据
        commFlag: [],   //多条线段公共的flag标签
        xCoordinate: [] //x轴坐标数据
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
    var canvasData = {line: [], commFlag: [], xCoordinate: []};

    var lineCount = 3;  //一共三条折线
    var linePointCount = 20;    //每条线20个点
    for (var li = 0; li < lineCount; li++) {
        var line = {
            legend: '图例' + li,
            hidden: false,
            point: [],
        };
        for (var cnt = 0; cnt < linePointCount; cnt++) {
            var val = cnt * (li + 1);
            line.point.push({
                value: val,
                flag: '标签 --' + val
            })
        }
        canvasData.line.push(line);
    }

    for (var cnt = 0; cnt < linePointCount; cnt++) {
        canvasData.commFlag.push("公共浮层--" + cnt);
    }
    for (var cnt = 0; cnt < linePointCount; cnt++) {
        canvasData.xCoordinate.push(cnt);
    }
    return canvasData
}
