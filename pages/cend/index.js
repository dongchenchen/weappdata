const appInstance = getApp();
const Constants = require('../../common/constants');
const Config = require('../../wxChartComponent/line-chart/config-file');
const StyleConfig = require('../../common/line_style_config');
const Util = require('../../utils/util');
const testData = require('../../common/test');
const Request = require('../../common/request');
const Api = require('../../common/api');

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
			if(res.RETN == 0) {
					let result = res.resp.list;
					let item = null;					
					for(let item of result) {
						let tab_condition = {};
						tab_condition.index_key = item.index_key;
						tab_condition.title = Constants.CONDITION_NAME[item.index_key];
						tab_condition.total_value = Util.formatToZh(item.index_val);
						tab_condition.annular_ratio = Util.formatDouble(item.index_comp_day_val);
						tab_condition.cycle_ratio = Util.formatDouble(item.index_comp_week_val);
						tab_condition.biweekly_ratio = Util.formatDouble(item.index_comp_biweek_val);
						tab_condition_list.push(tab_condition);						
					}

					this.setData({
						historyList: tab_condition_list
					})	
				}
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
			// let res = testData.tabLineResult();
				if(res.RETN == 0) {
					let result = res.resp.list;
					for(let item of result) {
						let tabLine = {};
						tabLine.key = item.index_key;
						let canvasData = {
							line: [{
								legend: '双周折线',
					            hidden: false,
					            point: []
							}],
							commFlag: [], 
							xCoordinate: []
						};						
						for(let point of item.index_point) {
							let line_point = {
								value: Util.formatDouble(point.point_val)
							};
							canvasData.line[0].point.push(line_point);
						}
						tabLine.canvasData = canvasData;
						tabLine.canvasOption = Config.getOption();
						tabLine.canvasStyle = StyleConfig.litte_line_style;
						tabLineList.push(tabLine);
					}
					this.setData({
						tabLineList: tabLineList
					})					
				}
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
				if(res.RETN == 0) {
					let result = res.resp.list;
					for(let item of result) {
						let pvLine = {};
						pvLine.key = item.index_key;
						let canvasData = {line:[], commFlag: [], xCoordinate: Util.getXCoordinates(timeStamp)};
						let legendList = Constants.PV_CHART_LEGEND[item.index_key];
						for(let line of item.line) {
							let lineItem = {hidden: false};
							lineItem.legend = legendList[line.key];
							lineItem.point = [];
							for(let point of line.index_point) {
								let line_point = {
									value: Util.formatDouble(point.point_val),
									flag: Util.formatDouble(point.point_val)
								}
								lineItem.point.push(line_point);
							}
							canvasData.line.push(lineItem);							
						}
						pvLine.title = Constants.PV_CHART_NAME[pvLine.key];
						pvLine.canvasData = canvasData;
						pvLine.canvasOption = StyleConfig.common_line_option;
						pvLine.canvasStyle = StyleConfig.common_line_style;
						pvLineList.push(pvLine);
					}
					this.setData({
						pvLineList: pvLineList
					})					
				}
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