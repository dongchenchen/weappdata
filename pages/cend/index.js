const appInstance = getApp();
const Constants = require('../../common/constants');
const Config = require('../../wxChartComponent/line-chart/config-file');
const styleConfig = require('../../common/line_style_config');
Page({
	data:{
		activeCondition : 0,
		activeChooseType : 0,
		historyList: [{
			title:'赞赏详情',
			total_value:200, 
			annular_ratio:2.05, 
			cycle_ratio:1.05, 
			biweekly_ratio:2.05,
			canvasData: {
				line:[{
					legend:'最新两周',
					point:[
						{
							value: 2
						}
					]
				}]
			}
		},
		{
			title:'赞赏详情',
			total_value:200, 
			annular_ratio:2.05, 
			cycle_ratio:1.05, 
			biweekly_ratio:2.05,
			canvasData: {}
		},
		{
			title:'赞赏详情',
			total_value:200, 
			annular_ratio:2.05, 
			cycle_ratio:1.05, 
			biweekly_ratio:2.05,
			canvasData: {}
		},
		{
			title:'赞赏详情',
			total_value:200, 
			annular_ratio:2.05, 
			cycle_ratio:1.05, 
			biweekly_ratio:2.05,
			canvasData: {}
		}],
		originalPVCharts: [{
			title:'hahah',

		}]
	},

	onLoad: function() {
		let nowTimeStamp = new Date().getTime();
		let inner_datalist = 1;
		let tab_condition_list = [];
		// wx.request({
		// 	url:`${Constants.PREFIX_URL}`,
		// 	data: {
		// 		inner_date_timestamp: nowTimeStamp,
		// 		inner_datalist: inner_datalist
		// 	},
		// 	success: function(res) {
				// if(res.RETN == 0) {
				// 	let result = res.resp.list;
				// 	for(let item in result) {
				// 		let tab_condition = {};
				// 		tab_condition.title = Constants.CONDITION_NAME[item.index_key];
				// 		tab_condition.total_value = item.index_val;
				// 		tab_condition.annular_ratio = item.index_comp_day_val;
				// 		tab_condition.cycle_ratio = item.index_comp_week_val;
				// 		tab_condition.biweekly_ratio = item.index_comp_biweek_val;
				// 		let canvasData = {
				// 			line: [{
				// 				legend: '双周折线',
				// 	            hidden: false,
				// 	            point: []
				// 			}],
				// 			 commFlag: [], 
				// 			 xCoordinate: []
				// 		};
				// 		for(let point in item.index_point) {
				// 			canvasData.line[0].point.push(point.point_val);
				// 		}

				// 		tab_condition.canvasData = canvasData;
				// 		tab_condition_list.push(tab_condition);
				// 	}
					
				// }
		// 	}
		// })
		// this.setData({
		// 	historyList: tab_condition_list
		// })
		
	},

	onReady: function() {
		// wx.request({
		// 	url:`${Constants.PREFIX_URL}`,
		// 	data:{

		// 	},
		// 	success: function(res) {

		// 	}
		// })
		// let canvasData = {line: []};
		// let line = {
		// 	legend: '最新两周',
		// 	point: []
		// }
		
		// for(let i = 0; i < 20; i++) {
		// 	let point = {
		// 		val: i
		// 	}
		// 	line.point.push(point);
		// }
		// canvasData.line.push(line);

		// for(let i = 0; i < this.data.historyList.length; i++) {
		// 	this.data.historyList.canvasData = canvasData;
		// }
		var canvasData = {line: [], commFlag: [], xCoordinate: []};        
        var line = {
            legend: '图例',
            hidden: false,
            point: []
        };
        for (var cnt = 0; cnt < 14; cnt++) {
            // var val = cnt * (li + 1);
            var val = cnt;
            line.point.push({
                value: val,
                flag: '标签:' + val
            })
        }
        canvasData.line.push(line);
        let Config = require('../../wxChartComponent/line-chart/config-file.js');        
        
        let originalPVCharts = [];
        for(let i = 0; i < 3; i++) {
        	originalPVCharts.push({
        		'title': '测试',
        		'canvasData': canvasData,
	            "canvasOption": Config.getOption(),
	            "canvasStyle": styleConfig.common_line_style
        	})
        }  
        this.setData({
            'canvasData': canvasData,
            "canvasOption": Config.getOption(),
            "canvasStyle": styleConfig.litte_line_style,
            'originalPVCharts': originalPVCharts
        }); 
	},

	changeCondition(option) {
		this.setData({
			activeCondition: option.detail.activeIndex
		})
	},

	changeType(option) {
		this.setData({
			activeChooseType: option.detail.activeIndex
		})
	}
})