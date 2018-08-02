# Circle-Chart

使用 微信小程序 的自定义组件功能，提供画饼状图组件

[toc]


## 三分钟上手
1.  下载此代码，放置于代码目录中。

2.  创建或在需要图表组件的页面的json文件添加：（为了方便描述，记改文件路径为：learns/circle-chart/circle-chart）

    2.1 learns/circle-chart/circle-chart.json文件，填写组件路径，譬如
```js
{
  "usingComponents": {
    "wxChartComponent-circle-chart": "/wxChartComponent/circle-chart/circle-chart"
  }
}
```
    2.2 在learns/circle-chart/circle-chart.js文件中，填写canvasData数据，（具体使用方式查看“canvasData属性”），譬如

```js
    onReady: function () {
        var Config = require('../../wxChartComponent/circle-chart/config-file.js');
        var target = Config.getData();

        this.setData({
            'canvasData': target
        })
    },
```
    2.3 在learns/circle-chart/circle-chart.wxml文件中，调用组件，譬如
```xml
<!--learns/circle-chart/circle-chart.wxml-->
<view>
  <wxChartComponent-circle-chart canvas-data="{{canvasData}}" ></wxChartComponent-circle-chart>
</view>
```
  2.4 在开发者工具即可查看到效果
  ![image](http://mmbiz.qpic.cn/mmbiz_png/2lu3uoD1k999Y8KJyx6MXfUV8UdjvrGicVGq8QTGWicXMNzCpUZdAX2CNNkd9H6M9pHRFtPtwYWak1WiaDAWUktlw/0)
  
-------------


## 调用参数

属性 | 数据类型 | 必填 | 解释
--- | --- | ---- | ----
canvas-data | object | 是 | 画图需要的数据
canvas-option | object | 否 | 画图的功能调控，不填采用默认配置
canvas-style | object | 否 | 画图细节样式，不填采用默认配置


```xml
<!--pages/test/test.wxml-->
<view>
  <wxChartComponent-circle-chart canvas-data="{{canvasData}}" canvas-option="{{canvasOption}}" canvas-style="{{canvaStyle}}"></component-tag-name>
</view>
```

> ***如何修改默认配置***：  
查找 wxChartComponent/circle-chart/config-file.js 配置文件，在文件中修改对应的参数值即可。


------

## canvasData属性

canvasData属性 | 数据类型 | 必填 | 解释
--- | --- | ---- | ----
pie | array | 是 | 饼状图的数据、



canvasData.pie| 数据类型 | 必填 | 解释
--- | --- | ---- | ----
legend | string | 是 | 该扇形对应的图例
hidden | bool | 否 | 该扇形是否隐藏
value | number | 是 | 该扇形的数值大小


```js
//调用示例：
    var canvasData = {pie: []};
    var PieCount = 5;  //一共三条折线
    for (var li = 0; li < PieCount; li++) {
        var pie = {
            legend: '图例' + li,        //该扇形对应的图例
            hidden: false,              //该扇形对应的图例
            value: (li + 1) * (li + 2), //该扇形的数值大小
        };
        canvasData.pie.push(pie);
    }
```

-----

## canvasOption属性
canvasOption属性 | 数据类型 | 解释 | 强调
--- | --- | ---- | ---- | ---
seriesColor | array | 扇形、图例等对应的颜色 |  数据不够时 或 为空，使用style.pie.defaultColor 颜色
legendCanControlShow | bool | 图例可以控制对应的扇形的展示与否 | 默认true
valueToFixed | int | 数据含小数，规整为几位小数 | 建议取值[0 , 4)
firstStartDu | number | 第一个元素的对应的扇形的起始角度 | --
sizeUint | {'px', 'rpx'} | style里面数据单位 | 当为'rpx'时，会使用wx.getSystemInfoSync()接口获取设备屏幕宽度


----------

## canvaStyle属性
canvasStyle属性 | 数据类型 | 解释 
--- | --- | ---- | ---- | ---
pie | object | 扇形部分 
legend | object |  图列样式 

canvasStyle.pie |  数据类型 | 解释 | 强调
--- | --- | ---- | ---- | ---
r | int | 饼状图内心圆半径 | 单位受canvasOption.sizeUint决定
R | int | 饼状图外圆半径 | 单位受canvasOption.sizeUint决定
centerColor | color | 饼状图内心圆颜色 | 默认为白色
defaultColor |  color | 饼状图内心圆颜色 | 当canvasOption.seriesColor没有对应颜色时使用
flagInfo | object | 扇形图方便的数据标签 | --
margin | object | 饼状图四周的边距 | 单位受canvasOption.sizeUint控制，left、right不能绝对控制


canvasStyle.pie.flagInfo |  数据类型 | 解释 | 强调
--- | --- | ---- | ---- | ---
show | bool | 是否展示 | --
line | object | 数据标签的线条 | line.horizontalLineLength 水平线段的长度；单位收受canvasOption.sizeUint决定
text | object | 数据标签的文字样式 | --


canvasStyle.legend属性|  数据类型 | 解释 | 强调
--- | --- | ---- | ---- | ---
show | bool | 是否展示图例 | --
icon | object | 图例的图标 | 颜色受对应的canvasOption.seriesColor控制
text | object | 图例的文字 | --
value | object | 图例的数值 | --
percentage | object | 图例的百分比 | --
margin | object | 图例的外边距 | 支持css的边距单位，margin.top=30; margin.unit='rpx' 相当于css: margin-top：30rpx;


canvasStyle.legend.icon属性|  数据类型 | 解释 | 强调
--- | --- | ---- | ---- | ---
style | {'circle', 'rect'} | 样式 | 只支持 圆 或者 正方形
defaultColor | color | 默认颜色 | 当图例被取消时， 或者canvasOption.seriesColor没有对应颜色时，展示的颜色
margin | object | icon 四周的边距 | margin.top=30; margin.unit='rpx' 相当于css: margin-top：30rpx;