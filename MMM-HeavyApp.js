Module.register("MMM-HeavyApp", {
	// Default module config.
	defaults: {
		text: "Hello World!",
		updateInterval: 60 * 60 * 1000, // every 60 minutes
		height: "200px",
		heavyApiKey: ""
	},


	start: function () {
		this.workoutData = [];
		this.getData();
		this.scheduleUpdate();
	},

	// Override dom generator.
	getDom: function () {
		var wrapper = document.createElement("div");
		// Append public/body-front.svg to the wrapper
		// var svg = document.createElement("object");
		// svg.type = "image/svg+xml";
		// svg.data = "/MMM-HeavyApp/body-front.svg";
		// svg.style.width = "100%";
		// svg.style.height = this.config.height;

		var svg2 = document.createElement("object");
		svg2.type = "image/svg+xml";
		svg2.data = "/MMM-HeavyApp/body-back.svg";
		svg2.style.width = "100%";
		svg2.style.height = this.config.height;

		// Make the wrapper flex,
		wrapper.style.display = "flex";
		wrapper.appendChild(this.getFrontSvgElement());
		wrapper.appendChild(svg2);


		return wrapper;
	},

	notificationReceived: function (notification, payload, sender) {


		if (notification === "MODULE_DOM_CREATED") {
			Log.log("DOM created");

		}

	},


	getStyles: function () {
		return ["MMM-HeavyApp.css"];
	},

	getHeader: function () {
		return 'Heavy Muscle Split';
	},


	getData: function () {
		this.sendSocketNotification('GET_HEAVY_DATA', {heavyApiKey: this.config.heavyApiKey});
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "HEAVY_DATA_RES") {

			console.log(payload)
			this.workoutData = payload;
			this.updateDom();
		}
	},

	scheduleUpdate: function (delay) {
		const nextLoad = this.config.updateInterval;
		const self = this;
		setTimeout(function () {
			self.getData();
		}, nextLoad);
	},

	getFrontSvgElement: function () {
		var svg = document.createElement("object");
		svg.id = "body-front";
		svg.type = "image/svg+xml";
		svg.data = "/MMM-HeavyApp/body-front.svg";
		svg.style.width = "100%";
		svg.style.height = this.config.height;

		svg.onload = function () {
			var svgDoc = svg.contentDocument;
			var abdomenPaths = svgDoc.getElementsByClassName("abdomen");
			for (var i = 0; i < abdomenPaths.length; i++) {
				abdomenPaths[i].style.fill = "#C25F60";
			}
		};


		return svg;
	},


});
// https://www.figma.com/community/file/1320468164820924031
