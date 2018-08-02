Component({
	properties:{
		//标题
		'title': {
			type: String,
			value: ""
		},
		//总金额或次数
		'total_value': {
			type: Number
		},
		//日环比
		'annular_ratio': {
			type: Number
		},
		//周环比
		'cycle_ratio': {
			type: Number
		},
		//双周环比
		'biweekly_ratio': {
			type: Number
		}
	}


})