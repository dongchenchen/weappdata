Component({
	properties:{
		//标题
		'title': {
			type: String,
			value: ""
		},
		//总金额或次数
		'total_value': {
			type: String
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
	},
	data: {
		isClick: false
	},

	methods: {
		clickTrend: function(e) {
			this.data.isClick = !this.data.isClick;
			this.data.backColor = !this.data.isClick ? '' : '';
			this.setData({
				backColor: this.data.backColor,
				isClick: ! this.data.isClick
			})

		}
	}


})