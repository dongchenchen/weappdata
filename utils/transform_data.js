// const Constants = require('../common/Constants');


// ine_list {
//     data_list {
//       key: "trend_val"           这个表示类型的值，下面的是sendtime所等于的
//       value: "5"
//     }
//     data_list {
//       key: "trend_key_type"   这个表示趋势图的类型
//       value: "sendtime"        比如这个字段和windy说明的字段保持一致
//     }
//     data_list {
//       key: "msg_pv"            这个表示pv值
//       value: "329294312"
//     }
//     data_list {
//       key: "ds"                这个表示日期
//       value: "20180801"
//     }
//   }


// line_list {
// 	trend_val: "5",
// 	trend_key_type: "sendtime",
// 	msg_pv: "32121221",
// 	ds: "20180801"
// }

// let result = res.resp.list;
// 					for(let item of result) {
// 						let pvLine = {};
// 						pvLine.key = item.index_key;
// 						let canvasData = {line:[], commFlag: [], xCoordinate: Util.getXCoordinates(timeStamp)};
// 						let legendList = Constants.PV_CHART_LEGEND[item.index_key];
// 						for(let line of item.line) {
// 							let lineItem = {hidden: false};
// 							lineItem.legend = legendList[line.key];
// 							lineItem.point = [];
// 							for(let point of line.index_point) {
// 								let line_point = {
// 									value: Util.formatDouble(point.point_val),
// 									flag: Util.formatDouble(point.point_val)
// 								}
// 								lineItem.point.push(line_point);
// 							}
// 							canvasData.line.push(lineItem);							
// 						}
// 						pvLine.title = Constants.PV_CHART_NAME[pvLine.key];
// 						pvLine.canvasData = canvasData;
// 						pvLine.canvasOption = StyleConfig.common_line_option;
// 						pvLine.canvasStyle = StyleConfig.common_line_style;
// 						pvLineList.push(pvLine);
// 					}

// const format_pv_line = response => {
// 	let line_list = response.line_list;
// 	let len = line_list.length;
// 	let pvLineList = [];
// 	let pvLineType = [];
// 	let pvChartType = [];
// 	let pvChartList = [];
// 	//分成几个表
// 	for(let i = 0; i < len; i++) {
// 		let point = line_list[i];
// 		for(let j = 0; j < point.length; j++) {
// 			let point_info = point[j];
// 			if(point_info.key == 'trend_key_type'){
// 				if(pvChartType.indexOf(point_info.value) == -1) {
// 					let newChart = {};
// 					newChart.index_key = point_info.value;
// 					newChart.point_list = [];
// 					newChart.point_list.push(point_info);
// 					pvChartType.push(point_info.value);
// 					pvChartList.push(newChart);
// 				}
// 				else 
// 				{
// 					let index = pvChartType.indexOf(point_info.value);
// 					pvChartList[index].point_list.push(point_info);
// 				}
// 			}
// 		}
// 	}

// 	//对每个表的每条线进行分隔
// 	for(let i = 0; i < pvChartType.length; i++) {
// 		let point_list = pvChartType[i].point_list;
// 		for(let j = 0; j < point_list.length; j++){
// 			let point_info = point_list[j];
// 			if(point_info.key == 'trend_val') {
// 				if(pvLineType.indexOf(point_info.value) == -1) {
// 					let line = {};

// 				}
// 			}
// 		}
// 	}
// }

// line_list {
//     data_list {
//       key: "money"
//       value: "983420529"
//     }
//     data_list {
//       key: "comp_day1_money"
//       value: "-"
//     }
//     data_list {
//       key: "comp_week1_money"
//       value: "-"
//     }
//     data_list {
//       key: "comp_week2_money"
//       value: "-"
//     }
//   }