//MMM-NCTtimes.js:

Module.register("MMM-NCTtimes",{
	// Default module config.
	defaults: {
		stop: "3390A4",
		amount: 5,
		refresh: 60,
		header: "Angel Row"
	},

	start: function(){
		var self = this;
		config = this.config
		self.sendSocketNotification("config", config.stop);

		setInterval(function() {
            self.sendSocketNotification("config", config.stop);
        }, (+config.refresh) * 1000); 
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "bus-times") {
			this.Notification = notification;
			this.dataNotification = payload;
			this.updateDom();
		}
		else if (notification === "error") {
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
		header = this.config.header;
		if (this.Notification === "bus-times") {
		buses = this.dataNotification;
		return {
			buses: buses,
			amount: amount,
			header: header,
			error: ""
		};
		}
		else if (this.Notification === "error"){
		error = this.dataNotification;
		return {
			buses: "",
			header: header,
			error: error
		}
		}
	
	},
});
