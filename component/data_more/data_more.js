Component({
  properties: {
    
  },
  methods:{
    getMore: function (e) {
      let eventDetail = {
        current : e.detail.y
      }
      this.triggerEvent("getMore", eventDetail);
    }
  }
})