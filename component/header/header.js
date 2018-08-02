var sliderWidth = 96;
Component({
	data: {
        tabs: ["整体概况", "趋势详情", "分布详情"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0
    },
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
    },
    methods:{
	    tabClick: function (e) {
	        this.setData({
	            sliderOffset: e.currentTarget.offsetLeft,
	            activeIndex: e.currentTarget.id
	        });
	        let eventDetail = {
	        	activeIndex : e.currentTarget.id
	        } 
	        let eventOption = {
	        	composed : false
	        };
	        this.triggerEvent("tapHeader", eventDetail, eventOption);
	    }
    }
})