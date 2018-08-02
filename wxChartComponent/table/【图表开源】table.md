# Table

使用 微信小程序 的自定义组件功能，提供画折线图组件

[toc]


## 三分钟上手
1) 下载此代码，放置于代码目录中。

2) 创建或在需要图表组件的页面的json文件添加：（为了方便描述，记改文件路径为：learns/line-chart/line-chart）

 2.1) learns/table/table.json文件，填写组件路径，譬如
```js
{
  "usingComponents": {
    "wxChartComponent-table": "/wxChartComponent/table/table"
  }
}

```
 2.2)  在learns/table/table.js文件中，填写canvasData数据，（具体查看可data），譬如

```js
//...
onReady: function () {
    var canvasData = {
        header: [],
        body: [],
    };

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
            canvasData.body[row].push({
                content: (row + 2) * (col + 5) * Math.pow(10, col + row),
                type: 'number',  // 'text', 'number'
                style: {}
            })
        }
    }
    this.setData({
        'canvasData': canvasData
    })
},

//...
```
2.3) 在learns/table/table.wxml文件中，调用组件，譬如
```xml
<!--learns/table/table.wxml-->
<view>
  <wxChartComponent-table canvas-data="{{canvasData}}" ></wxChartComponent-table>
</view>
```

 2.4) 在开发者工具即可查看到效果
    
    
    

## 调用参数

属性 | 数据类型 | 必填 | 解释
--- | --- | ---- | ----
canvas-data | object | 是 | 画图需要的数据
canvas-option | object | 否 | 画图的功能调控，不填采用默认配置
canvas-style | object | 否 | 画图细节样式，不填采用默认配置

调用方式：

```xml
<!--pages/test/test.wxml-->
<view>
  <wxChartComponent-table canvas-data="{{canvasData}}" canvas-option="{{canvasOption}}" canvas-style="{{canvaStyle}}"></wxChartComponent-table>
</view>
```

> ***如何修改默认配置***：  
查找 wxChartComponent/table/config-file.js 配置文件，在文件中修改对应的参数值即可。


------

## canvasData属性

canvasData属性 | 数据类型 | 必填 | 解释
--- | --- | ---- | ----
header | array | 是 | 表格的表头, 内容依次从左到右
body | 二维array | 是 | 表格的主体,body[row][col] 表示 第row行的第col列， 均从0开始标记

canvasData.header的属性| 数据类型 | 必填 | 解释
--- | --- | ---- | ----
content  | string | 是 | 填写的内容，内容为空 ""
type | {'text','number'} | 是 | content的类型，默认为text
style | Object | 否 | 内容的样式，譬如 style.textAlign = 'right' 等；

canvasData.body的属性| 数据类型 | 必填 | 解释
--- | --- | ---- | ----
content  | string | 是 | 填写的内容，内容为空 ""
type | {'text','number'} | 是 | content的类型，默认为text
style | Object | 否 | 内容的样式，譬如 style.textAlign = 'right' 等；


> style支持的属性可查询下面表格，属性值级表现可以参照css

样式style | 解释
-- | --
height | 高度
width | 宽度
textAlign | 内容居中方式：'left','center','right'
fontSize | 字体大小
fontFamily | 字体样式
fontWeight | 字体比重
wordBreak | 单词换行，譬如：'normal', 'break-all', 'keep-all'
overflow | 内容溢出, 譬如：'hidden'
textOverflow | 本文溢出, 譬如：'ellipsis'
lineHeight | 行高
verticalAlign | 垂直位置, 譬如：'middle', ''
color | 字体颜色
backgroundColor | 背景颜色, body不同行的颜色可以在 canvasOption.rowBackgroundColor 控制，详情见下文
margin | 外边距， 同理支持 'marginTop', 'marginLeft', 'marginBotton', 'marginRight',
padding | 内边距，同理支持 'paddingTop', 'paddingLeft', 'paddingBotton', 'paddingRight',
borderRadius | 边框弧度， 譬如：100% 圆

```js
//调用示例：
var canvasData = {
    header: [],
    body: [],
};

var bodyRowCount = 4;
var bodyColCount = 6;

for (var col = 0; col < bodyColCount; col++) {
    canvasData.header.push({
        content: '标题' + col,
        type: 'text',  //'text', 'number'
        style: {
            fontSize: '24rpx',
        }
    })
}

for (var row = 0; row < bodyRowCount; row++) {
    canvasData.body[row] = [];
    for (var col = 0; col < bodyColCount; col++) {
        canvasData.body[row].push({
            content: (row + 2) * (col + 5) * Math.pow(10, col + row),
            type: 'number',  // 'text', 'number'
            style: {}
        })
    }
}
return canvasData;
```


## canvasOption属性
canvasOption属性 | 数据类型 | 解释 | 强调
--- | --- | ---- | ---- | ---
rowBackgroundColor | array | 表格每行的颜色 | 每行依次轮询填色
valueToFixed | int | 如果数据含小数，保留几位小数 | 默认2位
valueUseComma | bool | 是否使用千位分隔符标记数据,譬如 4,321
valueToCollated | array | 数据规整 | 不需要时，可传入[] 或 [{1, ''}]
valueToColor | object | 在选择范围内，根据表格数值大小涂渐变颜色 | 不需要时，可传入{} 或 undefined

canvasOption.valueToColor属性 | 数据类型 | 解释 | 强调
--- | --- | ---- | ---- | ---
rowStart | int | 数值加颜色的起始行号（包含当前行） | 第一行编号为0
rowEnd | int | 数值加颜色的终止行号（不包含当前行） | 默认最后一行可写 '-'
colStart | int | 数值加颜色的起始列号 （包含当前列） | 第一列编号为0
colEnd| int | 数值加颜色的终列行号 （不包含当前列）| 默认最后一列可写 '-'
colorStart | color |在涂色范围最小数值表格涂的颜色 | --
colorEnd | color | 在涂色范围最大数值表格涂的颜色 | --

> 附加解释：  
> 1) 只有canvasData[i][j].type 设置为'number’ 时，才有valueToXX的效果。    
> 2) 解释valueToCollated作用  
> 前提：valueToCollated = [{value: 1e3, name: '千'}, {value: 1e4, name: '万'}, {value: 1e7, name: '千万'}, {value: 1e9, name: '亿'}] 且  valueToFixed=2
当 body[i][j].content=1234, 因为1e3 <= body[i][j].content < 1e4，规整为1.234千，又因为valueToFixed=2，只保留2位小数，四舍五入后展示为1.23千。    
> 3) 解释valueToColor作用  
> 前提：valueToColor={rowStart: 0, rowEnd: 2, colStart: 1, colEnd: 3, colorStart: '#FEF1EC', colorEnd: '#FDD0C8'} ，在 { body[i][j] | rowStart <= i < rowEnd, colStart <= j < colEnd,  body[i][j].type==number} 表格范围，根据且数值大小自动涂背景颜色color(colorStart <= color <= colorEnd)。方便直观展示表格数据间大小关系。

```js
option: {
    rowBackgroundColor: ['#ffffff', '#F9F8F9'],  //依次次填充颜色
    valueToFixed: 2,                             //数据含小数，规整为几位小数
    valueToCollated: [{value: 1e3, name: '千'}, {value: 1e4, name: '万'}, {value: 1e7, name: '千万'}, {
        value: 1e9,
        name: '亿'
    }],   //数据规整
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
```
对应效果：
![image]( http://mmbiz.qpic.cn/mmbiz_jpg/2lu3uoD1k98ARYjUleTD4mCtBanmSRbPhMLXCQsOiaN51Pckk5JJVQPARNMoopVQjEfQB76hUTsnbknOic0ibOsQA/0)

----------

## canvaStyle属性
canvasStyle属性 | 数据类型 | 解释 
--- | --- | ---- | ---- 
table | object | 表格整体样式 
header | object | 表格的表头样式
body | object | 表格的主体样式
text | object | 当主体内容为 text 的样式
number | object |当主体内容为 number 的样式

> 样式冲突时:
> canvasData.body[i][j].style 优先于 text/number > body > table   
> canvasData.header[i].style 优先于 text/number > header > table     
  
 
```js
style: {
    table: {
        margin: "30rpx 30rpx",
        width: '690rpx',   //如果适配屏幕 需要750rpx-margin.left-margin.right

        fontSize: '24rpx',
        fontFamily: '',
        fontWeight: '',
        textAlign: 'center',

        lineHeight: '76rpx',
        verticalAlign: 'middle',
    },
    header: {
        fontSize: '24rpx',
        fontFamily: '',
        fontWeight: '',
        textAlign: 'right',

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
        padding: '0 5rpx',
    },
    number: {
        fontFamily: '',
        textAlign: 'right',
        wordBreak: 'normal',
        padding: '0 5rpx',
    },
},
```
    
------
      