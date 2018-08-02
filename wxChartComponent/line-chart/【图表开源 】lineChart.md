# Line-Chart

使用 微信小程序 的自定义组件功能，提供画折线图组件

[toc]


## 三分钟上手
1) 下载此代码，放置于代码目录中。

2) 创建或在需要图表组件的页面的json文件添加：（为了方便描述，记改文件路径为：learns/line-chart/line-chart）

 2.1) learns/line-chart/line-chart.json文件，填写组件路径，譬如
```js
{
  "usingComponents": {
    "wxChartComponent-line-chart": "/wxChartComponent/line-chart/line-chart"
  }
}


```
 2.2)  在learns/line-chart/line-chart.js文件中，填写canvasData数据，（具体查看可data），譬如

```js
    //...

    onReady: function () {
        var canvasData = {line: [], commFlag: [], xCoordinate: []};

        var allcount = 20;
        for (var li = 0; li < 3; li++) {
            var line = {
                legend: '图例' + li,
                hidden: false,
                point: [],
            };
            for (var cnt = 0; cnt < allcount; cnt++) {
                var val = cnt * (li + 1);
                line.point.push({
                    val: val, flag: '标签(flag) --' + val
                })
            }
            canvasData.line.push(line);
        }

        for (var cnt = 0; cnt < allcount; cnt++) {
            canvasData.commFlag.push("公共浮层(commFlag)--" + cnt);
        }
        for (var cnt = 0; cnt < allcount; cnt++) {
            canvasData.xCoordinate.push(cnt);
        }
        this.setData({
            'canvasData': canvasData
        });
    },

    //...
```
2.3) 在learns/line-chart/line-chart.wxml文件中，调用组件，譬如
```xml
<!--learns/line-chart/line-chart.wxml-->
<view>
  <wxChartComponent-line-chart canvas-data="{{canvasData}}" ></wxChartComponent-line-chart>
</view>
```

 2.4) 在开发者工具即可查看到效果
 ![image](http://mmbiz.qpic.cn/mmbiz_png/2lu3uoD1k999Y8KJyx6MXfUV8UdjvrGicKQK2ibcibgzC49zItYmicSkeKu12Zd8rb2C08axfcUicaB89OeluUlwdJA/0)


-------------


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
  <wxChartComponent-line-chart canvas-data="{{canvasData}}" canvas-option="{{canvasOption}}" canvas-style="{{canvaStyle}}"></wxChartComponent-line-chart>
</view>
```


> ***如何修改默认配置***：  
查找 wxChartComponent/line-chart/config-file.js 配置文件，在文件中修改对应的参数值即可。


------

## canvasData属性

canvasData属性 | 数据类型 | 必填 | 解释
--- | --- | ---- | ----
line | array | 是 | line[idx] 代表第idx条折线的线数据
commFlag | array | 否 | 多条线段的公共flag标签
xCoordinate | array | 否 | 填写展示x轴坐标值，如果不填写不展示


canvasData.line的属性| 数据类型 | 必填 | 解释
--- | --- | ---- | ----
legend | string | 是 | 该折线的图例
hidden | bool | 否 | 该折线是否隐藏
point | array | 是 | 该折线的所有数据点


canvasData.point的属性| 数据类型 | 必填 | 解释
--- | --- | ---- | ----
value | number | 是 | 该折线点的数据大小, 当为小数时，受canvasOption.valueToFixed 控制保留多少位小数
flag | string | 否 | 该折线点的数据标签，当在canvasOption属性中关闭了数据标签，则可以不填


 >- 手指滑动查看的数据详情，记标签
 >- xCoordinate 最好与 line[idx] 的数量对应，否则会展示异常，x轴坐标的个数在canvasOption控制


```js
//调用示例：
var canvasData = {
    line: [],       //线段数据
    commFlag: [],   //多条线段公共的flag标签
    xCoordinate: [] //x轴坐标数据
}

canvasData.line.push({
    legend: '图例1',    //该折线的图例
    hidden: 'false',    //该折线是否隐藏
    point:[             //该折线的所有数据点
        {
             val: 123,              //该折线点的数据大小
             flag: 'xx日 xx次数',   //该点的数据标签
        }
    ]
})  //第一条折线, 同理可放入第二条、等三条、等等……
```

-----

## canvasOption属性
canvasOption属性 | 数据类型 | 解释 | 强调
--- | --- | ---- | ---- | ---
seriesColor | array | 线段、图例等对应的颜色 |   数据不够时 或 为空，使用style.line.defaultColor
everyLineBgColor | array | 折线背景颜色 | 不填写，则不涂背景颜色
lineFixedMaxPointCount | int | 线段固定数据点的最多个数 | 填写undefined 或 <=0，自动根据数据画图
lineExceedPointCountNoJoinStyle | int | 线段上的数据点超过多少个点后无交点样式（可见常见问题3） |建议填写30
legendCanControlShow | bool | 图例可以控制对应的线段的展示与否 | 默认true
moveCanShowDataFlag | bool | 手指滑动可否查看对应的数据标签 | 默认true
valueToFixed | int | 数据含小数，规整为几位小数 | 建议取值[0 , 4)
xCoordinateFixedCount | int | x轴坐标期望固定多少个 | 建议可被实际数据整除, undefine 即不处理
yCoordinateFixedCount | int | y轴坐标固定多少个 | 建议填写范围[4, 6], 当数值小于2个或不合法，默认按4个处理
yCoordinateFixedMax | number | y坐标固定最大值 | 填写undefined时，自动根据数据判读合适的最大值
yCoordinateFixedMin | number | y坐标固定最小值 | 填写undefined时，自动根据数据判读合适的最小值
yCoordinateDependOnShowData | bool | y坐标依赖于只展示的线段 | 点击图例取消或展示折线时，是否期望y轴值动态变化
sizeUint | {'px', 'rpx'} | style的属性（除canvasStyle.legend外）的边距单位 | 当为'rpx'时，会使用wx.getSystemInfoSync()接口获取设备屏幕宽度


-----
> 1) lineFixedMaxPointCount  
> 希望数据从0时时刻，展示到24时时刻，但是数据点尚未完全够24个点，所以可以在这些配置最大数据点24个；效果如下图所示：  

![image](http://mmbiz.qpic.cn/mmbiz_png/2lu3uoD1k999Y8KJyx6MXfUV8UdjvrGicicpsCxtPAHM5iavLt84wvYjqgqyhou256phscdYSII9gicr7k4V8ukfqQ/0)


> 2) lineExceedPointCountNoJoinStyle  
> 线段默认有交点样式，但是画布数据点过多时候，不适易保留交代样式，区别如下图所示：   

![image]( http://mmbiz.qpic.cn/mmbiz_png/2lu3uoD1k999Y8KJyx6MXfUV8UdjvrGicY0eiclicRDJEED5BGLfPiaiaX7miag5Wsmma62baI0bib6zTBeqrOKdhbyQA/0)


> 3) yCoordinateDependOnShowData
> 折线图可能存在多条数据线，取消或展示某条数据线时，希望Y轴坐标保持不变，此时可以将该属性设置为flase；
> 同份数据，yCoordinateDependOnShowData=false，效果如下图1；yCoordinateDependOnShowData=false，效果如下图2  

![image](http://mmbiz.qpic.cn/mmbiz_png/2lu3uoD1k999Y8KJyx6MXfUV8UdjvrGicdNgzOswlJam7U1YugmuwKo9HVx2RibiaGfASLuWusqYGrKuRn7kcadRw/0)
![image](http://mmbiz.qpic.cn/mmbiz_png/2lu3uoD1k999Y8KJyx6MXfUV8UdjvrGicbsibCOicRnGAiav2ouapvF5BeTjH46kZkccUhibAWCjicBseyvrJe1mjYWg/0)

----------

## canvaStyle属性
canvasStyle属性 | 数据类型 | 解释 | 强调
--- | --- | ---- | ---- | ---
screen | object | 不包含图例的画布范围样式 |
legend | object |  图列样式 |
grid | object | 网格线样式 |
coordinateSystem | object | 坐标系样式  |
flagInfo | object | 数据标签样式 |
line | object | 折线线段样式 |


canvasStyle.screen属性|  数据类型 | 解释 | 强调
--- | --- | ---- | ---- | ---
w | int | 画布宽度 | 为0时，出错
h | int | 画布高度 | 为0时，出错
margin | object | 画布四周一圈的空隙 | 对应的top、rigth、bottom、left 不填，则为0


canvasStyle.legend属性|  数据类型 | 解释 | 强调
--- | --- | ---- | ---- | ---
show | bool | 是否展示图例 | --
icon | object | 图例的图标 | 颜色受对应的canvasOption.seriesColor控制
text | object | 图例的文字 | --
margin | object | 图例的外边距 | 支持css的边距单位，边距单位不受canvasOption.sizeUint控制

```js
legend: {
    show: true,      //true or false;
    icon: {          //图例的图标, 颜色受对应的canvasOption.seriesColor控制
        style: 'circle',  //取值：'circle' or 'rect'
        size: '30rpx',    //注意：需要填写对应的单位
        defaultColor: '',  //当图例不被选择时，默认颜色；
        margin: {
            top: 2, right: 2, bottom: 2, left: 0, unit: 'rpx'   //不填unit 默认是 px
        }
    },
    text: {          //图例的文字
        fontSize: '24rpx',  //注意：需要填写对应的单位
        fontFamily: '',
        fontWeight: '',
        color: '#888888',   
        margin: {
            top: 2, right: 8, bottom: 2, left: 2, unit: 'rpx'   //不填unit 默认是 px
        }
    },
    margin: {
        top: 5, right: 20, bottom: 5, left: 30, unit: 'rpx'   //不填unit 默认是 px
    }
},
```

canvasStyle.grid属性|  数据类型 | 解释 | 强调
--- | --- | ---- | ---- | ---
parallelX | object | 平行x轴的网格线 | x轴线可在coordinateSystem单独控制
parallelY | object | 平行y轴的网格线 | y轴线可在coordinateSystem单独控制

```js
grid: {
    parallelX: {        //平行x轴的网格线
        show: true,
        color: '#e8e8e8',
        width: 1,      //单位为 canvasOption.sizUint;

    },
    parallelY: {        //平行y轴的网格线
        show: true,
        color: '#e8e8e8',  
        width: 1,      //单位为 canvasOption.sizUint;
    }
},
```

canvasStyle.coordinateSystem属性|  数据类型 | 解释 | 强调
--- | --- | ---- | ---- | ---
xAxis | object | x轴（线） | --
yAxis | object | y轴（线） | --
xCoordinate | object | 横坐标 | --
yCoordinate | oject | 纵坐标 | --

```js
coordinateSystem: {     //坐标系
    xAxis: {
        show: true,
        color: '#C6C6C6',
        width: 2,       //单位为 canvasOption.sizUint;
    },          //x轴
    yAxis: {
        show: true,
        color: '#C6C6C6',
        width: 2,       //单位为 canvasOption.sizUint;
    },
    xCoordinate: {
        show: true,     //datasets.xCoordinate.length == 0 强制改为false

        fontSize: 24,   //单位为 canvasOption.sizUint;
        fontFamily: 'xxx',
        fontWeight: '',
        textAlign: 'center',

        color: '',
        marginTop: 30,      //单位为 canvasOption.sizUint;
        marginBottom: 20,   //单位为 canvasOption.sizUint;
    },    //横坐标
    yCoordinate: {
        show: true,
        fontSize: 24,       //单位为 canvasOption.sizUint;
        fontFamily: 'xxx',
        fontWeight: undefined,
        textAlign: 'left',      //文字水平位置 left center right
        textBaseline: '',       //文字垂直位置: top、middle、bottom

        color: '#B8B8B8',
        marginLeft: 0,      //单位为 canvasOption.sizUint;
        marginRight: 20,    //单位为 canvasOption.sizUint;
    },    //纵坐标
},
```

canvasStyle.line属性|  数据类型 | 解释 | 强调
--- | --- | ---- | ---- | ---
point | object | 折线上的点 | 对应的canvasOption.seriesColor控制  r = 0 时为实心圆 centerColor可不填写
width | number | 折线的宽度 | --
zIndexChange | string | 取值 ['decrease', 'increase'] | 折线的层级变化。decrease：每条折线的z-index递减； increase：：每条折线的z-index递增；

```js
line: {
    point: { //点
        R: 4,    //空心圆外半径, 单位为 canvasOption.sizUint;
        r: 2.8,  //空心圆内半径, 单位为 canvasOption.sizUint;
        centerColor: '#FFFFFF'  //空心填充颜色
    },
    width: 2,   //单位为 canvasOption.sizUint;
    zIndexChange: 'decrease'  //decrease 递减；  increase 递增
},
```
canvasStyle.flagInfo属性|  数据类型 | 解释 | 强调
--- | --- | ---- | ---- | ---
parallelYLine | object | 平行Y轴的线 | --
box | object | 数据标签的背景盒子 | --
commFlag | object | 多条数据线的公共标签样式 | 当canvasData.commFlag为空时，则不展示
text | object | 每条数据折线的数据标签文字样式 | --
icon | object | 每条数据折线的icon | icon.style 目前只支持'rect', 'circle'； 颜色受对应的canvasOption.seriesColor控制

```js
flagInfo: {    //数据详情, 手机滑动可以查看的
    parallelYLine: {
        show: true,
        color: '#FFFFFF',
        width: 1,  //单位为 canvasOption.sizUint;
    },
    box: {
        strokeColor: 'rgba(136, 136, 136, 0.8)',
        fillColor: 'rgba(136, 136, 136, 0.8)',
        padding: {top: 30, right: 16, bottom: 20, left: 20},  //单位为 canvasOption.sizUint;
        margin: {top: 4, left: 10, right: 10}   //单位为 canvasOption.sizUint;
    },
    commFlag: {
        show: true,   //datasets.commFlag.length == 0 会强制改为 false
        color: '#FFFFFF',
        fontSize: 24,       //单位为 canvasOption.sizUint;
        fontFamily: '',
        fontWeight: '',
        wordsPadding: 16,  //文字的间隔，单位为canvasOption.sizUint;
        margin: {top: 10, right: 6, bottom: 10, left: 6},   //单位为 canvasOption.sizUint;
    },
    text: {   //图例后面的文字
        color: '#FFFFFF',
        fontSize: 24,   //单位为 canvasOption.sizUint;
        fontFamily: '',
        fontWeight: '',
        wordsPadding: 16, //文字的间隔，单位为canvasOption.sizUint;
        margin: {top: 8, right: 6, bottom: 4, left: 6},     //单位为 canvasOption.sizUint;
    },
    icon: {
        show: true,
        color: '#e8e8e8',
        style: 'circle',   //rect , circle
        size: 24,   //单位为 canvasOption.sizUint;
        margin: {top: 8, right: 6, bottom: 4, left: 6},   //单位为 canvasOption.sizUint;
    },  //带图例
},
```
-----------
