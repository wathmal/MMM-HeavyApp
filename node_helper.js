const NodeHelper = require("node_helper");
// load the SVGs
// const bodyFrontSvg = require("./svgs/body-front.svg");
// const bodyBackSvg = require("./svgs/body-back.svg");

// Should have a getSVG method
// returns the SVG painted

// Should render in UI


module.exports = NodeHelper.create({
	start: function () {
		console.log('MMM-HeavyApp helper started...');
	},

	getWorkoutData: function () {
		// Call the API and get the data

	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === 'GET_HEAVY_DATA') {
			const data = this.getWorkoutData(payload);
			this.sendSocketNotification('HEAVY_DATA_RES', data);

		}
	}


});
