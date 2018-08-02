export const litte_line_style = {
        screen: {
            w: 150,     // 为0时，出错
            h: 100,     // 为0时，出错
            margin: {
                top: 0, right: 0, bottom: 0, left: 0,
            },    //单位为 canvasOption.sizUint;
        },
        legend: {   //css
            show: false,      //true or false;
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
            parallelX: {        //平行x轴的网格线
                show: true,
                color: '#e8e8e8',
                width: 1,       //单位为 canvasOption.sizUint;
            },
            parallelY: {        //平行y轴的网格线
                show: true,
                color: '#e8e8e8',
                width: 1,       //单位为 canvasOption.sizUint;
            }
        },
        coordinateSystem: {     //坐标系
            xAxis: {
                show: false,
                color: '#C6C6C6',
                width: 2,       //单位为 canvasOption.sizUint;
            },          //x轴
            yAxis: {
                show: false,
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
              show: false,
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

        line: {
            point: { //点
                R: 4,    //空心圆外半径, 单位为 canvasOption.sizUint;
                r: 2.8,  //空心圆内半径, 单位为 canvasOption.sizUint;
                centerColor: '#FFFFFF'  //空心填充颜色
            },
            width: 2,   //单位为 canvasOption.sizUint;
            zIndexChange: 'decrease'  //decrease 递减；  increase 递增
        },
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
                show: false,   //datasets.commFlag.length == 0 会强制改为 false
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
            }  //带图例
        }
}

export const common_line_style = {
    screen: {
            w: 750,     // 为0时，出错
            h: 400,     // 为0时，出错
            margin: {
                top: 30, right: 30, bottom: 30, left: 30,
            },    //单位为 canvasOption.sizUint;
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
            parallelX: {        //平行x轴的网格线
                show: true,
                color: '#e8e8e8',
                width: 1,       //单位为 canvasOption.sizUint;
            },
            parallelY: {        //平行y轴的网格线
                show: true,
                color: '#e8e8e8',
                width: 1,       //单位为 canvasOption.sizUint;
            }
        },
        coordinateSystem: {     //坐标系
            xAxis: {
                show: false,
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
              show: false,
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

        line: {
            point: { //点
                R: 4,    //空心圆外半径, 单位为 canvasOption.sizUint;
                r: 2.8,  //空心圆内半径, 单位为 canvasOption.sizUint;
                centerColor: '#FFFFFF'  //空心填充颜色
            },
            width: 2,   //单位为 canvasOption.sizUint;
            zIndexChange: 'decrease'  //decrease 递减；  increase 递增
        },
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
                show: false,   //datasets.commFlag.length == 0 会强制改为 false
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
            }  //带图例
        }
 }
