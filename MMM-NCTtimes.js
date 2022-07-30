//MMM-NCTtimes.js:

Module.register("MMM-NCTtimes",{
	defaults: {
		amount: 5,
		refresh: 30
	},

	start: function(){
		config = this.config
		this.sendSocketNotification("config", config.stop);

		setInterval(function() {
            this.sendSocketNotification("config", config.stop);
        }, (+config.refresh) * 100); 
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === this.config.stop + "_HEADER"){
			header = this.payload
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
	
	getTemplate: function () {
			this.template = "timetable.njk";
			return this.template;
		},

	getTemplateData: function () {
		amount = this.config.amount;
		if (this.Notification === this.config.stop + "_BUSES") {
			if (this.config.header) {
				header = this.config.header;
			}
		buses = this.dataNotification;
		return {
			buses: buses,
			amount: amount,
			header: header
		};
		}
		else if (this.Notification === this.config.stop + "_ERROR"){
		this.error = this.dataNotification;
		return {
			header: "Error",
			error: error
		}
		}
	
	},
});
