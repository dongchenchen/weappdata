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
        // hasSortFunc: false,
        // defaultSortColIdx: 1,   //默认排序的列Idx， 从0开始标记,
        // defaultSortType: 'up',  //up: 升序， down: 降序
        // defaultSortOrder: 'dictionary',  //dictionary:字典序, number:数值大小

        rowBackgroundColor: ['#ffffff', '#F9F8F9'],  //依次次填充颜色
        valueToFixed: 2,                             //数据含小数，规整为几位小数
        valueToCollated: [
            {rangeStart: 0, rangeEnd: 1e4, base: 1, wording: ''},
            {rangeStart: 1e4, rangeEnd: 1e5, base: 1e3, wording: '千'},   //range: {x | 1000 <= x < 10000}  9999 -> 9.99千
            {rangeStart: 1e5, rangeEnd: 1e8, base: 1e4, wording: '万'},
            {rangeStart: 1e8, rangeEnd: 1e9, base: 1e7, wording: '千万'},
            {rangeStart: 1e9, rangeEnd: Infinity, base: 1e8, wording: '亿'},
        ],      //数据规整
        valueUseComma: true,                         //数据是否加千位分隔符
        valueToColor: {
            rowStart: 0,    //第一行编号为0
            rowEnd: '-',    //默认最后一行可写 '-'
            colStart: 1,    //第一列编号为0
            colEnd: '-',    //默认最后一列可写 '-'
            colorStart: '#FEF1EC',  //在涂色范围最小数值表格涂的颜色
            colorEnd: '#FDD0C8'     //在涂色范围最大数值表格涂的颜色
        }, //在{ body[i][j] | rowStart <= i < rowEnd, colStart <= j < colEnd, body[i][j].type == number } 范围内，根据且数值大小自动涂背景颜色color
    },
    style: {
        table: {
            padding: "30rpx 30rpx",
            width: '',
            minWidth: '690rpx',   //如果适配屏幕 需要750rpx-margin.left-margin.right

            fontSize: '24rpx',
            fontFamily: '',
            fontWeight: '',
            textAlign: 'center',

            lineHeight: '76rpx',
            verticalAlign: 'middle',
        },
        ceil: {
            padding: '0 10rpx',
            border: '1px solid #5b5b5b',
            whiteSpace: 'nowrap',
            // maxWidth: '180rpx',
            // overflow: 'hidden',
            // textOverflow: 'ellipsis',
        },
        header: {
            fontSize: '',
            fontFamily: '',
            fontWeight: '',
            textAlign: 'center',

            color: 'rgba(57, 69, 78, 0.3)',
            backgroundColor: '#F9F8F9',

            lineHeight: '76rpx',
            verticalAlign: 'middle',

            wordBreak: 'break-all',
        },
        body: {
            fontSize: '24rpx',
            fontFamily: '',
            fontWeight: '',
            textAlign: 'left',
            wordBreak: 'break-all',
            color: '#888888',
        },
        text: {
            fontFamily: '',
            wordBreak: 'break-all',
        },
        number: {
            fontFamily: '',
            textAlign: 'right',
            wordBreak: 'normal',
        },
    },
    /**
     data: {
        table: {
            header: [],
            body: [],
        },             //数据
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
    console.log("!!!1: ", config.option);
    var b = Utils.deepCopy(config.option);
    console.log("!!!2: ", b);
    return b;

    // return Utils.deepCopy(config.option);


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
    var canvasData = {
        header: [],
        body: [],
    };


    _create1();

    function _create3() {
        var bodyRowCount = 4;
        var bodyColCount = 20;

        for (var col = 0; col < bodyColCount; col++) {
            canvasData.header.push({
                content: '标题' + col,
                type: 'text',  //'text', 'number'
                style: {}
            })
        }
        for (var row = 0; row < bodyRowCount; row++) {
            canvasData.body[row] = [];
            for (var col = 0; col < bodyColCount; col++) {
                if (col == 0) {
                    canvasData.body[row].push({
                        content: '第' + row + '列',
                        type: 'text',  // 'text', 'number'
                        style: {
                            // 'paddingLeft': '20rpx'
                        }
                    })
                } else {
                    canvasData.body[row].push({
                        content: '387419374013840',
                        type: 'number',  // 'text', 'number'
                        style: {}
                    })
                }
            }
        }
    }


    //百分数ok！！
    function _create2() {
        var bodyRowCount = 4;
        var bodyColCount = 6;

        for (var col = 0; col < bodyColCount; col++) {
            canvasData.header.push({
                content: '标题' + col,
                type: 'text',  //'text', 'number'
                style: {}
            })
        }
        for (var row = 0; row < bodyRowCount; row++) {
            canvasData.body[row] = [];
            for (var col = 0; col < bodyColCount; col++) {
                if (col == 0) {
                    canvasData.body[row].push({
                        content: '第' + row + '列',
                        type: 'text',  // 'text', 'number'
                        style: {
                            // 'paddingLeft': '20rpx'
                        }
                    })
                } else {
                    canvasData.body[row].push({
                        content: row + '.' + '2%',
                        type: 'number',  // 'text', 'number'
                        style: {}
                    })
                }
            }
        }
    }


    //均匀的数据
    function _create1() {
        var bodyRowCount = 4;
        var bodyColCount = 6;

        for (var col = 0; col < bodyColCount; col++) {
            canvasData.header.push({
                content: '标题' + col,
                type: 'text',  //'text', 'number'
                style: {}
            })
        }
        for (var row = 0; row < bodyRowCount; row++) {
            canvasData.body[row] = [];
            for (var col = 0; col < bodyColCount; col++) {
                if (col == 0) {
                    canvasData.body[row].push({
                        content: '第' + row + '列',
                        type: 'text',  // 'text', 'number'
                        style: {
                            // 'paddingLeft': '20rpx'
                        }
                    })
                } else {
                    canvasData.body[row].push({
                        content: (row + 2) * (col + 5) * Math.pow(10, col + row),
                        type: 'number',  // 'text', 'number'
                        style: {}
                    })
                }
            }
        }
    }

    return canvasData
}
