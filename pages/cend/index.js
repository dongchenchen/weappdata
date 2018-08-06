const appInstance = getApp();
const Constants = require('../../common/constants');
const Config = require('../../wxChartComponent/line-chart/config-file');
const StyleConfig = require('../../common/line_style_config');
const Util = require('../../utils/util');
const testData = require('../../common/test');
const Request = require('../../common/request');
const Api = require('../../common/api');
const DataFormat = require('../../utils/transform_data');

Page({
	data:{
		activeCondition : 0,
		activeChooseType : 0		
	},

	onLoad: function() {
		//获取当前日期
		this.initGetDate();

		let timeStamp = Util.yesterdayTimeStamp();
		
		this.getData(timeStamp);
	},


	onReady: function() {
	},

	initGetDate: function() {
		let currentDate = Util.formateDate(new Date());
		this.setData({
			chooseDate: currentDate,
			currentDate: currentDate
		})
	},

	getData: function(timeStamp) {
		//获得tab中概况数据
		this.getTabData(timeStamp);

		//获取tab中近两周折线数据
		this.getTabLineData(timeStamp);

		//获得PV折线图数据
		this.getPVLineData(timeStamp);
	},

	getTabData: function(timeStamp) {
		let inner_datalist = Constants.REQUESY_TYPE.tab_data;
		let tab_condition_list = [];
		Request.request({
			url:`${Constants.PREFIX_URL}`,
			data: {
				innerdate_timestamp: timeStamp,
				innerdatalist: inner_datalist,
				innerservicetype: 'all'
			}
		}).then((res = {}) =>{			
				let result = DataFormat.tranform_result(res);				
				for(let item of result) {
					let tab_condition = {};
					tab_condition.index_key = item.index_key;					
					tab_condition.title = Constants.CONDITION_NAME[item.index_key];
					tab_condition.total_value = Util.formatToZh(item[tab_condition.index_key]);
					tab_condition.annular_ratio = Util.formatDouble(item.comp_day1_money);
					tab_condition.cycle_ratio = Util.formatDouble(item.comp_week1_money);
					tab_condition.biweekly_ratio = Util.formatDouble(item.comp_week2_money);
					tab_condition_list.push(tab_condition);															
				}
				tab_condition_list.sort((condition1,condition2) => {
					return Constants.CONDITION_KEY[condition1.index_key] > Constants.CONDITION_KEY[condition2.index_key] ? 1 : -1;
				})
				this.setData({
					historyList: tab_condition_list
				})					
			},err => {

			})		
	},

	getTabLineData(timeStamp) {
		let inner_datalist = Constants.REQUESY_TYPE.tab_trend_data;
		let begin_timeStamp = timeStamp;
		let twoWeekAgoTimeStamp = Util.twoWeekBeforeTimeStamp(begin_timeStamp);
		let tabLineList = [];		
		Request.request({
			url:`${Constants.PREFIX_URL}`,
			data: {
				innerbegin_timestamp: twoWeekAgoTimeStamp,
				innerend_timestamp: begin_timeStamp,
				innerdatalist: inner_datalist,
				innerservicetype: 'all'
			}
		}).then((res = {}) =>{
			let result = DataFormat.tranform_result(DataFormat.hh);

			result.sort((a,b) => {
				return parseInt(a.ds) < parseInt(b.ds) ? -1 : 1;
			})
			let keys = Object.keys(Constants.CONDITION_KEY);
			let keyArray = [];
			let tabLine = {};
			let tabLineList = [];
			let canvasData = {};
			for(let type of keys) {
				for(let item of result) {
					if(item[type]){
						if(keyArray.indexOf(type) == -1){
							keyArray.push(type);
							tabLine = {};
							canvasData = {
								line: [{
									legend: '双周折线',
						            hidden: false,
						            point: []
								}],
								commFlag: [], 
								xCoordinate: []
							};										
						} 
						canvasData.line[0].point.push({'value':Util.formatDouble(item[type])});
						if(canvasData.line[0].point.length == 14) {
							tabLine.key = type;
							tabLine.canvasData = canvasData;
							tabLine.canvasOption = Config.getOption();
							tabLine.canvasStyle = StyleConfig.litte_line_style;
							tabLineList.push(tabLine);
						}
					}
				}
			}						
			this.setData({
				tabLineList: tabLineList
			})					
				
		},err => {

		})
			
	},

	getPVLineData(timeStamp) {
		let inner_datalist = Constants.REQUESY_TYPE.pv_data;
		let begin_timeStamp = timeStamp;
		let twoWeekAgoTimeStamp = Util.twoWeekBeforeTimeStamp(begin_timeStamp);
		let pvLineList = [];
		
		Request.request({
			url:`${Constants.PREFIX_URL}`,
			data: {
				innerbegin_timestamp: twoWeekAgoTimeStamp,
				innerend_timestamp: begin_timeStamp,
				innerdatalist: inner_datalist,
				innerservicetype: 'all'
			}
		}).then((res = {}) =>{
			let result = DataFormat.tranform_result(DataFormat.mm);
			result.sort((a,b) => {
				return parseInt(a.ds) < parseInt(b.ds) ? -1 : 1;
			})
			let keys = Object.keys(Constants.PV_CHART_KEY);
			let pvLineList = [];
			let pvLine = {};
			let chartTypeList = [];
			let canvasData = {};			
			for(let item of result) {
				let chartType = item.trend_key_type;
				if(keys.indexOf(chartType) > -1){
					if(chartTypeList.indexOf(chartType) ==  -1) {
						chartTypeList.push(chartType);
						pvLine = {};
						pvLine.key = chartType;
						canvasData = {line:[], commFlag: [], xCoordinate: Util.getXCoordinates(timeStamp)};
						pvLine.lineList = [];
						pvLine.lineList.push(item.trend_val);
						let lineItem = {hidden: false};
						let legendList = Constants.PV_CHART_KEY[chartType];
						lineItem.legend = legendList[parseInt(item.trend_val)];
						lineItem.point = [];
						lineItem.point.push({
							value: Util.formatDouble(item.msg_pv),
							flag: Util.formatDouble(item.msg_pv)
						})
						canvasData.line.push(lineItem);
						pvLine.canvasData = canvasData;
						pvLine.canvasOption = StyleConfig.common_line_option;
						pvLine.canvasStyle = StyleConfig.common_line_style;
						pvLine.title = Constants.PV_CHART_NAME[chartType];
						pvLineList.push(pvLine);
					} else {
						for(let index in pvLineList) {
							if(pvLineList[index].key == chartType) {
								let chart = pvLineList[index];
								if(chart.lineList.indexOf(item.trend_val) == -1) {
									let lineItem = {hidden: false};
									let legendList = Constants.PV_CHART_KEY[chartType];
									lineItem.legend = legendList[parseInt(item.trend_val)];
									lineItem.point = [];
									lineItem.point.push({
										value: Util.formatDouble(item.msg_pv),
										flag: Util.formatDouble(item.msg_pv)
									})
									chart.lineList.push(item.trend_val);
									chart.canvasData.line.push(lineItem);
								}
								else
								{
									let lineIndex = chart.lineList.indexOf(item.trend_val);
									chart.canvasData.line[lineIndex].point.push({
										value: Util.formatDouble(item.msg_pv),
										flag: Util.formatDouble(item.msg_pv)
									})
								}
							}
						}							
					}						
				}
			}

			pvLineList.sort((condition1,condition2) => {
				return Constants.MSG_PV_KEY[condition1.key] > Constants.MSG_PV_KEY[condition2.key] ? 1 : -1;
			})

			this.setData({
				pvLineList: pvLineList
			})								
			},err => {

			})		
	},

	//日期选择
	bindDateChange(e) {
		this.setData({
			chooseDate: e.detail.value
		});

		let timeStamp = Util.getTimeStamp(e.detail.value);
		this.getData(timeStamp);
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