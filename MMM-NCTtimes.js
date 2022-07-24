//MMM-NCTtimes.js:

Module.register("MMM-NCTtimes",{
	// Default module config.
	defaults: {
		stop: "3390A4",
		amount: 5,
		refresh: 60
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
			this.dataNotification = payload;
			this.updateDom();
		}
	},

	getTemplate: function () {
			return "timetable.njk";
		},

	getTemplateData: function () {
		buses = this.dataNotification;
		amount = this.config.amount;
		return {
			buses: buses,
			amount: amount
		};
	},
});
