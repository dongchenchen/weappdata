Component({
  properties: {
    //选择日期
    'choose_date': {
      type: String,
      value: ""
    },
    //昨天
    'current_date': {
      type: String,
      value: ""
    }
  },
  methods:{
        bindDateChange: function (e) {
            this.triggerEvent("dateChange", e);
        }
    }
})