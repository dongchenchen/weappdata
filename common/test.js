const TYPE = require('constants')

export const tabConditionResult = {
	RETN: 0,
	resp: {
		list:[
			{
				index_key: 'pay_pv',
				index_val: 612,
				index_comp_day_val: 1.7192821,
				index_comp_week_val: 1.121221,
				index_comp_biweek_val: -1.12121	
			},
			{
				index_key: 'video_pv',
				index_val: 101514,
				index_comp_day_val: 1.7192821,
				index_comp_week_val: 1.121221,
				index_comp_biweek_val: -1.12121	
			},
			{
				index_key: 'transfer_pv',
				index_val: 612,
				index_comp_day_val: 1.7192821,
				index_comp_week_val: 1.121221,
				index_comp_biweek_val: -1.12121	
			},
			{
				index_key: 'earn_detail',
				index_val: 612,
				index_comp_day_val: 1.7192821,
				index_comp_week_val: 1.121221,
				index_comp_biweek_val: -1.12121	
			}
		]
	}
}

export const tabLineResult = () => {
	let result = {};
	result.RETN = 0;
	let list = [];
	let types = ['pay_pv','video_pv','transfer_pv','earn_detail'];
	for(let i=0;i<4;i++){
		let line = {};
		line.index_key = types[i];
		let points = [];
		for(let j=0;j<14;j++){
			let point = {};
			point.index = j;
			point.point_val = Math.random();
			points.push(point);
		}
		line.index_point = points;
		list.push(line);
	}
	result.resp = {};
	result.resp.list = list;
	return result;
}

export const PVLineDate = () => {
	let result = {};
	result.RETN = 0;
	let list = [];
	let types = ['mass_send_pv','original_transfer_pv','article_video_pv'];
	let shows = {
		'mass_send_pv':['today',
						'yesterday',
						'two_day_before',
						'eight_day_before',
						'thirty_one_daya_before'
						],
		'original_transfer_pv':[
			'original',
			'transfer',
			'other'
		],
		'article_video_pv':[
			'appmsg',
			'share',
			'other'
		]

	}
	for(let i=0;i<3;i++){
		let chart = {};
		chart.index_key = types[i];
		chart.line = [];
		let showtypes = shows[types[i]];
		for(let j=0;j<showtypes.length;j++){
			let line = {};
			line.key = showtypes[j];
			line.index_point = [];
			for(let m=0;m<14;m++){
				let point = {};
				point.index = m;
				point.point_val = Math.random();
				line.index_point.push(point);
			}
			chart.line.push(line);
		}
		list.push(chart);
	}
	result.resp = {};
	result.resp.list = list;
	return result;
};


	

{"base":{"session":{"_fake_id":"1718116614","_sid_ticket":"903b06189f424f2ad6d7d4da62c59bcd6de75dd5","_data_ticket":"gynQao1YJ3Xg8POz5toCQYqM","_sid_expire":1533305358},"ret":0},"body":{"tables":[{"id":"2","count":2,"lines":[{"fields":[{"key":"share_pv","value":""},{"key":"msg_pv","value":"2693824643"},{"key":"money","value":""},{"key":"ds","value":"20180801"}]},{"fields":[{"key":"share_pv","value":"104285376"},{"key":"msg_pv","value":"2692282637"},{"key":"money","value":"983420529"},{"key":"ds","value":"20180802"}]}]}]}}



{"base":{"session":{"_fake_id":"1718116614","_sid_ticket":"903b06189f424f2ad6d7d4da62c59bcd6de75dd5","_data_ticket":"gynQao1YJ3Xg8POz5toCQYqM","_sid_expire":1533305358},"ret":0},"body":{"tables":[{"id":"3","count":18,"lines":[{"fields":[{"key":"trend_val","value":"4"},{"key":"trend_key_type","value":"sendtime"},{"key":"msg_pv","value":"181611251"},{"key":"ds","value":"20180802"}]},{"fields":[{"key":"trend_val","value":"2"},{"key":"trend_key_type","value":"reprinttype"},{"key":"msg_pv","value":"95596521"},{"key":"ds","value":"20180801"}]},{"fields":[{"key":"trend_val","value":"4"},{"key":"trend_key_type","value":"sendtime"},{"key":"msg_pv","value":"179700669"},{"key":"ds","value":"20180801"}]},{"fields":[{"key":"trend_val","value":"1"},{"key":"trend_key_type","value":"sendtime"},{"key":"msg_pv","value":"1204983016"},{"key":"ds","value":"20180802"}]},{"fields":[{"key":"trend_val","value":"-1"},{"key":"trend_key_type","value":"reprinttype"},{"key":"msg_pv","value":"6324"},{"key":"ds","value":"20180801"}]},{"fields":[{"key":"trend_val","value":"0"},{"key":"trend_key_type","value":"reprinttype"},{"key":"msg_pv","value":"2209281006"},{"key":"ds","value":"20180802"}]},{"fields":[{"key":"trend_val","value":"1"},{"key":"trend_key_type","value":"sendtime"},{"key":"msg_pv","value":"1207005682"},{"key":"ds","value":"20180801"}]},{"fields":[{"key":"trend_val","value":"5"},{"key":"trend_key_type","value":"sendtime"},{"key":"msg_pv","value":"325207007"},{"key":"ds","value":"20180802"}]},{"fields":[{"key":"trend_val","value":"5"},{"key":"trend_key_type","value":"sendtime"},{"key":"msg_pv","value":"329294312"},{"key":"ds","value":"20180801"}]},{"fields":[{"key":"trend_val","value":"2"},{"key":"trend_key_type","value":"sendtime"},{"key":"msg_pv","value":"588855086"},{"key":"ds","value":"20180802"}]},{"fields":[{"key":"trend_val","value":"0"},{"key":"trend_key_type","value":"reprinttype"},{"key":"msg_pv","value":"2226218612"},{"key":"ds","value":"20180801"}]},{"fields":[{"key":"trend_val","value":"1"},{"key":"trend_key_type","value":"reprinttype"},{"key":"msg_pv","value":"378382759"},{"key":"ds","value":"20180802"}]},{"fields":[{"key":"trend_val","value":"2"},{"key":"trend_key_type","value":"sendtime"},{"key":"msg_pv","value":"604088884"},{"key":"ds","value":"20180801"}]},{"fields":[{"key":"trend_val","value":"3"},{"key":"trend_key_type","value":"sendtime"},{"key":"msg_pv","value":"391626277"},{"key":"ds","value":"20180802"}]},{"fields":[{"key":"trend_val","value":"1"},{"key":"trend_key_type","value":"reprinttype"},{"key":"msg_pv","value":"372003186"},{"key":"ds","value":"20180801"}]},{"fields":[{"key":"trend_val","value":"2"},{"key":"trend_key_type","value":"reprinttype"},{"key":"msg_pv","value":"104612137"},{"key":"ds","value":"20180802"}]},{"fields":[{"key":"trend_val","value":"3"},{"key":"trend_key_type","value":"sendtime"},{"key":"msg_pv","value":"373735096"},{"key":"ds","value":"20180801"}]},{"fields":[{"key":"trend_val","value":"-1"},{"key":"trend_key_type","value":"reprinttype"},{"key":"msg_pv","value":"6735"},{"key":"ds","value":"20180802"}]}]}]}}



{"base":{"session":{"_fake_id":"1718116614","_sid_ticket":"903b06189f424f2ad6d7d4da62c59bcd6de75dd5","_data_ticket":"gynQao1YJ3Xg8POz5toCQYqM","_sid_expire":1533305358},"ret":0},"body":{"tables":[{"id":"1","count":3,"lines":[{"fields":[{"key":"money","value":"983420529"},{"key":"comp_day1_money","value":"-"},{"key":"comp_week1_money","value":"-"},{"key":"comp_week2_money","value":"-"}]},{"fields":[{"key":"msg_pv","value":"2692282637"},{"key":"comp_day1_msg_pv","value":"-"},{"key":"comp_week1_msg_pv","value":"-"},{"key":"comp_week2_msg_pv","value":"-"}]},{"fields":[{"key":"share_pv","value":"104285376"},{"key":"comp_day1_share_pv","value":"-"},{"key":"comp_week1_share_pv","value":"-"},{"key":"comp_week2_share_pv","value":"-"}]}]}]}}