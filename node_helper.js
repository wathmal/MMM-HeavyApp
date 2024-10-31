const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	start: function () {
		console.log('MMM-Hevy helper started...');
	},

	getWorkoutData: function () {
		// Call the API and get the data
		return {}
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === 'GET_HEAVY_DATA') {
			const data = this.getWorkoutData(payload);
			this.sendSocketNotification('HEAVY_DATA_RES', data);

		}
	}
});
