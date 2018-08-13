Component({
	data: {
        tabs: [
        {
            type:'all',
            title:'总体'
        },
        {
            type:'1',
            title:"订阅号"
        },
        {
            type:'2',
            title:"服务号"
        }],
        activeIndex: 'all'
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