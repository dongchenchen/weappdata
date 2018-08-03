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


	

