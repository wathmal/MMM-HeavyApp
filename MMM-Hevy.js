Module.register("MMM-Hevy", {
	// Default module config.
	defaults: {
		updateInterval: 60 * 60 * 1000, // every 60 minutes
		height: "200px",
		heavyApiKey: "",
		primaryColor: "rgba(194, 95, 96, 1)",
		secondaryColor: "rgba(194, 95, 96, 0.5)"
	},


	start: function () {
		this.workoutData = [];
		this.getData();
		this.scheduleUpdate();
	},

	// Override dom generator.
	getDom: function () {
		const wrapper = document.createElement("div");


		const bodySvgWrapper = document.createElement("div");


		// Make the wrapper flex,
		bodySvgWrapper.style.display = "flex";
		bodySvgWrapper.appendChild(this.getFrontSvgElement());
		bodySvgWrapper.appendChild(this.getBottomSvgElement());

		wrapper.appendChild(bodySvgWrapper);
		wrapper.appendChild(this.getWeeklyWorkoutListElement());


		return wrapper;
	},

	notificationReceived: function (notification, payload, sender) {


		if (notification === "MODULE_DOM_CREATED") {
			Log.log("DOM created");

		}

	},


	getStyles: function () {
		return ["MMM-Hevy.css"];
	},

	getHeader: function () {
		return 'Hevy';
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
		const svg = document.createElement("object");
		svg.id = "body-front";
		svg.type = "image/svg+xml";
		svg.data = "/MMM-Hevy/body-front.svg";
		svg.style.width = "100%";
		svg.style.height = this.config.height;

		const primary = this.workoutData.primary || [];
		const secondary = this.workoutData.secondary || [];
		const self = this;
		svg.onload = function () {
			const svgDoc = svg.contentDocument;
			self.colorMuscles(svgDoc, secondary, self.config.secondaryColor);
			self.colorMuscles(svgDoc, primary, self.config.primaryColor);
		};


		return svg;
	},

	colorMuscles: function (svgDoc, muscles, color) {
		for (let muscle of muscles) {
			const musclePaths = svgDoc.getElementsByClassName(muscle);
			for (let i = 0; i < musclePaths.length; i++) {
				musclePaths[i].style.fill = color;
			}
		}
	},

	getBottomSvgElement: function () {
		const svg2 = document.createElement("object");
		svg2.type = "image/svg+xml";
		svg2.data = "/MMM-Hevy/body-back.svg";
		svg2.style.width = "100%";
		svg2.style.height = this.config.height;

		const primary = this.workoutData.primary || [];
		const secondary = this.workoutData.secondary || [];
		const self = this;
		svg2.onload = function () {
			const svgDoc = svg2.contentDocument;

			self.colorMuscles(svgDoc, secondary, self.config.secondaryColor);
			self.colorMuscles(svgDoc, primary, self.config.primaryColor);

		};

		return svg2;
	},

	getWeeklyWorkoutListElement: function () {
		const wrapper = document.createElement("div");
		wrapper.className = "workout-list";
		wrapper.style.display = "flex";

		const workoutDays = this.workoutData.workoutDays || [];
		// 7 days as M T W T F S S

		const days = ["M", "T", "W", "T", "F", "S", "S"];
		for (let i = 0; i < days.length; i++) {
			const day = document.createElement("div");
			// set class for styling
			day.className = "day";
			// check if the day is a workout day
			if (workoutDays.includes(i + 1)) {
				day.className = "day beasted";
			}
			day.innerHTML = days[i];
			// day.style.flex = "1";
			// day.style.textAlign = "center";
			wrapper.appendChild(day);
		}

		return wrapper;
	}


});
// https://www.figma.com/community/file/1320468164820924031
