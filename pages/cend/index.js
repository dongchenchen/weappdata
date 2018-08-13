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
		activeChooseType : 'all',
		//点击某个详情
		tabClick: false,
		//当前点击的详情
		currentTab: '',
		topCount: 0,
		showMoreTop: false,
		currentTopNum: 0 	
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
		let currentDate = Util.yesterdayDate();
		this.setData({
			chooseDate: currentDate,
			currentDate: currentDate,
			test: currentDate
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

	//获得tab详情
	getTabData: function(timeStamp) {
		let inner_datalist = Constants.REQUESY_TYPE.tab_data;		
		Request.request({
			url:`${Constants.PREFIX_URL}`,
			data: {
				innerdate_timestamp: timeStamp,
				innerdatalist: inner_datalist,
				innerservicetype: this.data.activeChooseType
			}
		}).then((res = {}) =>{															
			this.setData({
				historyList: DataFormat.formatTabData(res)
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
				innerservicetype: this.data.activeChooseType
			}
		}).then((res = {}) =>{
								
			this.setData({
				tabLineList: DataFormat.formatTrendData(res)
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
				innerservicetype: this.data.activeChooseType
			}
		}).then((res = {}) =>{
			this.setData({
				pvLineList: DataFormat.formatPVLineData(res)
			})								
		},err => {

		})		
	},

	//日期选择
	bindDateChange(e) {
		let chooseDate = e.detail.detail.value;
		this.setData({
			chooseDate: chooseDate
		});

		let timeStamp = Util.getTimeStamp(chooseDate);
		this.getData(timeStamp);
	},

	changeCondition(option) {
		this.setData({
			activeCondition: option.detail.activeIndex
		})
	},

	changeType(option) {
		this.setData({
			activeChooseType: option.detail.activeIndex,
			tabClick: false
		})
		let timeStamp = Util.getTimeStamp(this.data.chooseDate);
		this.getData(timeStamp);
	},

	clickTrend(e) {
		var tapItem = e.currentTarget.id;
		if(tapItem === this.data.currentTab && this.data.tabClick == true) {
			this.data.tabClick = false;
		} else {
			this.data.tabClick = true;
			this.setData({
				diffScene: null,
				allScene: null,
				topScene: null
			})
		}
		this.setData({
			currentTab: tapItem,
			tabClick: this.data.tabClick
		})
		if(this.data.tabClick){
			let timeStamp = Util.getTimeStamp(this.data.chooseDate);
			let twoWeekAgoTimeStamp = Util.twoWeekBeforeTimeStamp(timeStamp);
			this.getDifferentScenePv(tapItem, timeStamp);
			this.getAllScenePv(tapItem, twoWeekAgoTimeStamp, timeStamp);
			this.getTopScenePv(tapItem, timeStamp, 0);
		}	
	},

	getDifferentScenePv(tapItem, timeStamp) {
		if(tapItem === 'money') {
			return;
		}
		Request.request({
			url:`${Constants.PREFIX_URL}`,
			data: {
				innerdate_timestamp: timeStamp,
				innerdatalist: 5,
				innerservicetype: this.data.activeChooseType,
				innerindex: tapItem,
				innertable_type: Constants.SECENE_CONDITION_TYPE[tapItem]
			}
		}).then((res = {}) =>{															
			let diffScene = DataFormat.formatRespData(res, 'bar', this.data.currentTab);			
			diffScene.title = Constants.TAB_SCENE_NAME.different_scene;
			this.setData({
				diffScene: diffScene
			})
		},err => {

		})
	},

	getAllScenePv(tapItem, beginTime, endTime) {
		Request.request({
			url:`${Constants.PREFIX_URL}`,
			data: {
				innerbegin_timestamp: beginTime,
				innerend_timestamp: endTime,
				innerdatalist: 6,
				innerservicetype: this.data.activeChooseType,
				innerscene: 'all',
				innerindex: tapItem,
				innertable_type: Constants.SECENE_CONDITION_TYPE[tapItem]
			}
		}).then((res = {}) =>{	
			let comp_index = 'comp_week1_' + tapItem;
			let comp2_index = 'comp_week2_' + tapItem;	
		    let typeList = [tapItem, comp_index, comp2_index];
		    let legenList = {};
		   
		    legenList[tapItem] = '当天';
		    legenList[comp_index] = '7天前';
		    legenList[comp2_index] = '14天前';
		    		    													
			let allScene = DataFormat.formatRespData(res, 'line', this.data.currentTab, typeList, legenList);
			allScene.title = Constants.TAB_SCENE_NAME.all_scene;

			this.setData({
				allScene: allScene
			})
		},err => {

		})
	},

	getTopScenePv(tapItem, timeStamp, begin) {
		if(tapItem === 'money') {
			return;
		}
		Request.request({
			url:`${Constants.PREFIX_URL}`,
			data: {
				innerdate_timestamp: timeStamp,
				innerdatalist: 7,
				innerservicetype: this.data.activeChooseType,
				innerindex: tapItem,
				innerscene: 'all',
				inner__begin: begin,
				inner__count: Constants.DEFAULT_PAGE_NUM,
				innertable_type: Constants.SECENE_CONDITION_TYPE[tapItem]
			}
		}).then((res = {}) =>{
			let count, showMoreTop;
			if(res.body.tables && res.body.tables.length >= 1) {
				count = res.body.tables[0].count;
				showMoreTop = begin + Constants.DEFAULT_PAGE_NUM >= count ? false : true;
				this.setData({
					currentTopNum: begin,
					topCount: count,
					showMoreTop: showMoreTop
				})	
			}																				
			let scene = 'all';
			let week1_index = 'comp_week1_' + tapItem;
			let month1_index = 'comp_month1_' + tapItem;
			let typeList = ['rk', 'nickname', tapItem, week1_index, month1_index];
			let legenList = ['排名', '公众号', '打开PV', '周同比', '月同比'];
			let legenType = ['text', 'text', 'number', 'number', 'number'];
			let topScene = DataFormat.formatRespData(res, 'table', this.data.currentTab, typeList, legenList, legenType);
			topScene.title = Constants.TAB_SCENE_NAME.top_scene;
			topScene.canvasOption.valueToColor.colorStart = "#ffffff";
			topScene.canvasOption.valueToColor.colorEnd = "#ffffff";
			if(this.data.topScene) {
				for(let data of topScene.canvasData.body) {
					this.data.topScene.canvasData.body.push(data);
				}				
				this.setData({
					topScene: this.data.topScene
				})
			} else{
				this.setData({
					topScene: topScene
				})
			}
			
		},err => {

		})
	},

	getMoreTop(option) {
		console.log(option.detail.current);
		this.getTopScenePv(this.data.currentTab, Util.getTimeStamp(this.data.chooseDate), this.data.currentTopNum + Constants.DEFAULT_PAGE_NUM);

	}
})