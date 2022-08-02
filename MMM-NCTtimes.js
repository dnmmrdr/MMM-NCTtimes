//MMM-NCTtimes.js:

Module.register("MMM-NCTtimes",{
	defaults: {
		amount: 5,
		refresh: 60
	},

	start: function(){
		var self = this;
		config = this.config
		self.sendSocketNotification("GET_HEADER", config.stop);
		self.sendSocketNotification("GET_TIMES", config.stop);
		setInterval(function() {
            self.sendSocketNotification("GET_TIMES", config.stop);
        }, (+config.refresh) * 1000); 
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === this.config.stop + "_HEADER"){
			this.busstopname = payload
			this.updateDom();
		}
		if (notification === this.config.stop + "_BUSES") {
			this.Notification = notification;
			this.dataNotification = payload;
			this.updateDom();
		}
		else if (notification === this.config.stop + "_ERROR") {
			this.Notification = notification;
			this.dataNotification = payload;
			this.updateDom();
		}
	},

	getHeader: function () {
		if (this.config.header){
			return this.config.header;
		}
		else if (this.busstopname) {
			return this.busstopname
		}
		else {
			return "Error"
		}
	},

	getTemplate: function () {
			template = "timetable.njk";
			return template;
		},

	getTemplateData: function () {
		amount = this.config.amount;
		if (this.Notification === this.config.stop + "_BUSES") {
		buses = this.dataNotification;
		return {
			buses: buses,
			amount: amount,
		};
		}
		else if (this.Notification === this.config.stop + "_ERROR"){
		this.error = this.dataNotification;
		this.data.header = "Error";
		return {
			error: this.error
		}
		}
	
	},
});
