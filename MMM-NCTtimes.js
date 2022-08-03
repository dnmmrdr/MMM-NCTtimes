//MMM-NCTtimes.js:

Module.register("MMM-NCTtimes",{
	defaults: {
		amount: 5,
		refresh: 30
	},

	start: function(){
		var self = this;
		config = this.config
		identifier = this.identifier;
		console.log("startfunction " + identifier)
		self.sendSocketNotification("GET_HEADER", {id: identifier, stop: config.stop});
		setInterval(function() {
			console.log("repeatfunction " + identifier)
            self.sendSocketNotification("GET_TIMES", {id: identifier, stop: config.stop});
        }, (config.refresh) * 1000); 
	},

	socketNotificationReceived: function(notification, payload) {
		if (payload.id === this.identifier & notification === "HEADER"){
			this.Notification = notification;
			this.busstopname = payload.header
			this.updateDom();
		}
		else if (payload.id === this.identifier & notification === "TIMES") {
			this.Notification = notification;
			this.timedata = payload.buses;
			this.response = notification;
			this.id = payload.id;
			this.updateDom();
		}
		else if (payload.id === this.identifier & notification === "ERROR") {
			this.Notification = notification;
			this.dataerror = payload.error;
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
			this.template = "timetable.njk";
			return this.template;
		},

	getTemplateData: function () {
		this.amount = this.config.amount;
		console.log("teample" + this.id)
		if (this.id === this.identifier & this.Notification === "TIMES") {
		this.buses = this.timedata;
		return {
			buses: this.buses,
			amount: this.amount,
		};
		}
		else if (this.id === this.identifier & this.Notification === "ERROR") {
		this.error = this.dataerror;
		this.data.header = "Error";
		return {
			error: this.error
		}
		}
	
	},
});
