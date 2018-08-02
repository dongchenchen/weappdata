Component({
	data: {
        tabs: ["总体","公众号","订阅号"],
        activeIndex: 0
    },
    onLoad: function () {
        
    },
    methods:{
	    tabClick: function (e) {
	        this.setData({
	            activeIndex: e.currentTarget.id
	        });
	        
            let eventDetail = {
                activeIndex: e.currentTarget.id
            }
            
	        this.triggerEvent("chooseType", eventDetail);
	    }
    }
})