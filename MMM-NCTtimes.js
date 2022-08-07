//MMM-NCTtimes.js:

Module.register("MMM-NCTtimes",{
	//The defaults
	defaults: {
		amount: 5,
		refresh: 30
	},
	// Override start method.
	start: function(){
		var self = this;
		config = this.config
		identifier = this.identifier;
		//Request the header & times from node_helper
		self.sendSocketNotification("GET_HEADER", {id: identifier, stop: config.stop, refresh: config.refresh});
		self.sendSocketNotification("GET_TIMES", {id: identifier, stop: config.stop, refresh: config.refresh});
	},
	// Update Header when notifitcation is received
	socketNotificationReceived: function(notification, payload) {
		if (payload.id === this.identifier & notification === "HEADER"){
			this.Notification = notification;
			this.busstopname = payload.header
			this.updateDom();
		}
		//Update Times when notifiacation is received
		else if (payload.id === this.identifier & notification === "TIMES") {
			this.Notification = notification;
			this.timedata = payload.buses;
			this.response = notification;
			this.id = payload.id;
			this.updateDom();
		}
		// If the node_helper send an error back, will display the error
		else if (payload.id === this.identifier & notification === "ERROR") {
			this.Notification = notification;
			this.dataerror = payload.error;
			this.updateDom();
		}
	},

	getHeader: function () {
		//If the header is set in config use that, else use the header received
		if (this.data.header){
			return this.data.header;
		}
		else if (this.busstopname) {
			return this.busstopname
		}
	},

	getTemplate: function () {
			//Get the template to display the bus times
			this.template = "timetable.njk";
			return this.template;
		},

	getTemplateData: function () {
		//Get the data needed for the template
		this.amount = this.config.amount;
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
