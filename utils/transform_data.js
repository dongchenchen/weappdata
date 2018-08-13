const Constants = require('../common/constants');
const Util = require('util');
const LineConfig = require('../wxChartComponent/line-chart/config-file');
const BarConfig = require('../wxChartComponent/bar-chart/config-file');
const StyleConfig = require('../common/line_style_config');
const TableConfig = require('../wxChartComponent/table/config-file');

const tranform_result = response => {
	let tables = response.body.tables;
	let conditions = [];
	if(tables.length > 0) {
		for(let table of tables) {			
			for(let lines of table.lines) {
				let fields = lines.fields;
				let cond = fields.reduce((condition,current) => {
					let currentKey = current.key;
					if(Constants.CONDITION_KEY[currentKey]) {
						condition.index_key = currentKey;
					}
					condition[currentKey] = current.value;
					return condition;
				},{});
				conditions.push(cond);
			}			
		}
	}
	return conditions;
}

//处理返回tab数据
const formatTabData = res => {
	let tab_condition_list = [];
	let result = tranform_result(res);
	let comp_day1_key, comp_week1_key, comp_week2_key;
	for(let item of result) {
		let tab_condition = {};
		tab_condition.index_key = item.index_key;					
		tab_condition.title = Constants.CONDITION_NAME[item.index_key];
		tab_condition.total_value = Util.formatToZh(item[tab_condition.index_key]);
		comp_day1_key = "comp_day1_" + item.index_key;
		tab_condition.annular_ratio = Util.formatRatio(item[comp_day1_key]);
		comp_week1_key = "comp_week1_" + item.index_key;
		tab_condition.cycle_ratio = Util.formatRatio(item[comp_week1_key]);
		comp_week2_key = "comp_week2_" + item.index_key;
		tab_condition.biweekly_ratio = Util.formatRatio(item[comp_week2_key]);
		tab_condition_list.push(tab_condition);															
	}

	tab_condition_list.sort((condition1,condition2) => {
		return Constants.CONDITION_KEY[condition1.index_key] > Constants.CONDITION_KEY[condition2.index_key] ? 1 : -1;
	})

	return tab_condition_list;		
}

const formatTrendData = res => {
	let result = tranform_result(res);
	result.sort((a,b) => {
		return parseInt(a.ds) < parseInt(b.ds) ? -1 : 1;
	});

	let days = getReturnDays(result).length;

	let keys = Object.keys(Constants.CONDITION_KEY);
	let keyArray = [];
	let tabLine = {};
	let tabLineList = [];
	let canvasData = {};
	for(let type of keys) {
		for(let item of result) {
			if(item[type]!== undefined){
				if(keyArray.indexOf(type) == -1){
					keyArray.push(type);
					tabLine = {};
					canvasData = {
						line: [{
				            hidden: false,
				            point: []
						}],
						commFlag: [], 
						xCoordinate: []
					};										
				} 
				canvasData.line[0].point.push({'value':Util.formatDouble(item[type])});
				if(canvasData.line[0].point.length == days) {
					tabLine.key = type;
					tabLine.canvasData = canvasData;
					tabLine.canvasOption = LineConfig.getOption();
					tabLine.canvasStyle = StyleConfig.litte_line_style;
					tabLineList.push(tabLine);
				}
			}
		}
	}	
	return tabLineList;
}

const formatPVLineData = res => {
	let result = tranform_result(res);
	result.sort((a,b) => {
		if(a.trend_key_type != a.trend_key_type) {
			return Constants.MSG_PV_KEY[a.trend_key_type] < Constants.MSG_PV_KEY[a.trend_key_type] ? -1 : 1;
		} else {	
			if(a.trend_val != b.trend_val) {
				return a.trend_val < b.trend_val ? -1 : 1;
			} else {
				return parseInt(a.ds) < parseInt(b.ds) ? -1 : 1;
			}
		}	
		return 0;	 				
	})

	let xCoordinate = getReturnDays(result);

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
				canvasData = {line:[], commFlag: [], xCoordinate: xCoordinate};
				pvLine.lineList = [];
				let legendList = Constants.PV_CHART_KEY[chartType];
				let lineItem = {hidden: false};
				lineItem.legend = legendList[parseInt(item.trend_val)];	
				if(lineItem.legend){
					pvLine.lineList.push(item.trend_val);							
					canvasData.line.push(createLineItem(chartType, lineItem, item));
				}
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
							let legendList = Constants.PV_CHART_KEY[chartType];
							let lineItem = {hidden: false};
							lineItem.legend = legendList[parseInt(item.trend_val)];	
							if(lineItem.legend) {
								chart.lineList.push(item.trend_val);
								chart.canvasData.line.push(createLineItem(chartType, lineItem, item));
							}																	
						}
						else
						{
							let lineIndex = chart.lineList.indexOf(item.trend_val);
							chart.canvasData.line[lineIndex].point.push({
								value: Util.formatDouble(item.msg_pv),
								flag: Util.formatToZh(item.msg_pv)
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
	return pvLineList;
}

const createLineItem = (chartType, lineItem, item) => {			
	lineItem.point = [];
	lineItem.point.push({
		value: Util.formatDouble(item.msg_pv),
		flag: Util.formatToZh(item.msg_pv)
	})
	return lineItem;	
}

const formatRespData = (result, canvasType, conditionType, typeList, legendList, legenType) => {
	result = tranform_result(result);
	let condition = {};
	let canvasData;	

	if(canvasType == 'bar') {
		return formatBarData(result, conditionType);
	} else if(canvasType == 'line') {
		return formatLineData(result, conditionType, typeList, legendList);
	} else if(canvasType == 'table') {
		return formatTableData(result,conditionType, typeList, legendList, legenType);
	}
}

const formatTableData = (result, conditionType, typeList, legendList, legenType) => {
	let condition;
	let canvasData = {
		header: [],
		body: []
	};
	for(let head of legendList) {
		canvasData.header.push({
			content: head,
			type: 'text'
		})
	}
	for(let index in result) {
		canvasData.body[index] = [];
		let item = result[index];
		for(let typeIndex in typeList) {
			canvasData.body[index].push({
				content: item[typeList[typeIndex]],
				type: legenType[typeIndex]
			})
		}
	}
	let canvasStyle = TableConfig.getStyle();
	let canvasOption = TableConfig.getOption();
	return condition = {
		canvasData : canvasData,
		canvasStyle : canvasStyle,
		canvasOption : canvasOption
	}
}

const formatLineData = (result, conditionType, typeList, legendList) => {
	let condition;
	result.sort((a,b) => {
		return parseInt(a.ds) < parseInt(b.ds) ? -1 : 1;
	});
	let xCoordinate = getReturnDays(result);
	let canvasData = {
		line: [],
		commFlag: [], 
		xCoordinate: xCoordinate
	}
	for(let type of typeList) {
		let lineItem = {
			hidden: false,
			point: [],
			legend: legendList[type]
		}
		for(let item of result) {
			lineItem.point.push({
				value: Util.formatDouble(item[type]),
				flag: Util.formatToZh(item[type])
			})
		}
		canvasData.line.push(lineItem);
	}

	let canvasOption = StyleConfig.common_line_option;
	let canvasStyle = StyleConfig.common_line_style;

	condition = {
		canvasData : canvasData,
		canvasStyle : canvasStyle,
		canvasOption : canvasOption
	}
	return condition;
}

const formatBarData = (result, conditionType)=> {
	let condition = {};
	let scenes = [];
	scenes = Constants.PV_SCENE[conditionType];
	let canvasData = {
		series: [],
		xCoordinate: scenes,
		dayRatio: [],
		weekRatio: []
	}
	let day1_list = [];
	let week1_list = [];
	let series = {
		hidden: false,
		bar: [],
		extra: {}
	}
	for(let item of result) {			
		let comp_day1_key = 'comp_day1_' + conditionType;
		let comp_week1_key = 'comp_week1_' + conditionType;
		canvasData.dayRatio.push(item[comp_day1_key]);
		canvasData.weekRatio.push(item[comp_week1_key]);
		series.bar.push({
			value: item[conditionType],
			extra: {}
		})			
	}
	canvasData.series.push(series);
	let canvasStyle = BarConfig.getStyle();
	canvasStyle.legend.show = false;
	canvasStyle.screen.h = 550;
	canvasStyle.coordinateSystem.dayRatioStyle.show = true;
	canvasStyle.coordinateSystem.weekRatioStyle.show = true;
	canvasStyle.coordinateSystem.xCoordinate.rotateRadio = 90;
	let canvasOption = BarConfig.getOption();
	canvasOption.valueToFixed = 0;
	condition = {
		canvasData : canvasData,
		canvasStyle : canvasStyle,
		canvasOption : canvasOption
	}
	return condition;
}

const getReturnDays = result => {
	let days = new Set();
	for(let item of result) {
		days.add(item.ds.substr(4));
	}
	let xCoordinate = [...days];
	return xCoordinate;
}

module.exports = {
	formatTrendData : formatTrendData,
	formatTabData : formatTabData,
	formatPVLineData : formatPVLineData,
	formatRespData : formatRespData
}