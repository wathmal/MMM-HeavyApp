const NodeHelper = require("node_helper");
const NodeCache = require("node-cache");
const {startOfISOWeek, endOfISOWeek, getISODay} = require("date-fns");
// Set cache to expire in 2 days
const Cache = new NodeCache({stdTTL: 172800});


module.exports = NodeHelper.create({
	start: function () {
		console.log('MMM-Hevy helper started...');

		// Run getWorkoutTemplateAndCache immediately
		// this.getWorkoutTemplateAndCache();
		//
		// // Run getWorkoutTemplateAndCache every 2 day
		// setInterval(() => {
		// 	this.getWorkoutTemplateAndCache();
		// }, 2 * 24 * 60 * 60 * 1000); // 24 hours in milliseconds

	},

	getWorkoutData: async function (apiKey) {
		// Fetch workout data from Hevy
		// https://api.hevyapp.com/v1/workouts?page=1&pageSize=5

		return await fetch("https://api.hevyapp.com/v1/workouts?page=1&pageSize=5", {
			headers: {
				"Api-Key": apiKey,
			}
		});
	},

	getWorkoutTemplatePage: async function (apiKey, pageNo) {

		return await fetch(`https://api.hevyapp.com/v1/exercise_templates?page=${pageNo}&pageSize=100`, {
			headers: {
				"Api-Key": apiKey,
			}
		});
	},

	getWorkoutTemplates: async function (apiKey) {
		// Fetch templates from Hevy
		// There are multiple pages
		// https://api.hevyapp.com/v1/exercise_templates?page=5&pageSize=100
		try {
			const res = await this.getWorkoutTemplatePage(apiKey, 1);

			const data = await res.json();

			const pageSize = data.page_count;
			const workoutTemplates = data.exercise_templates;

			if (pageSize > 1) {
				// Fetch the rest of the pages
				// Await all the promises

				const promises = [];
				for (let i = 2; i <= pageSize; i++) {
					promises.push(this.getWorkoutTemplatePage(apiKey, i));
				}

				await Promise.all(promises).then(async (responses) => {
					// responses.forEach((response) => {
					// 	const data = response.json();
					// 	workoutTemplates.push(...data.exercise_templates);
					//
					// });

					const data = responses.map((response) => response.json());
					await Promise.all(data).then((templates) => {
						templates.forEach((template) => {
							workoutTemplates.push(...template.exercise_templates);
						});
					});
				});
			}


			return workoutTemplates;
		} catch (error) {
			console.error(error);
			return [];
		}
	},

	getWorkoutTemplateAndCache: async function (apiKey) {
		console.log("Caching templates");
		const exerciseTemplates = await this.getWorkoutTemplates(apiKey);

		for (let template of exerciseTemplates) {
			Cache.set(template.id, template);
		}
		console.log("Cached templates");
	},

	getMusclesWorkedForWorkout: async function (workout) {
		// Should return an array of muscles worked
		// {
		//  primary: ["Biceps", "Triceps"],
		//  secondary: ["Forearms"]
		// }

		const musclesWorked = {
			primary: new Set(),
			secondary: new Set()
		};

		const exerciseTemplates = workout.exercises.map(e => e.exercise_template_id);
		exerciseTemplates.forEach((templateId) => {
			const template = Cache.get(templateId);
			if (template === undefined) {
				// Fetch template from Hevy
				// https://api.hevyapp.com/v1/exercise_templates/1
				// Cache the template

				console.log(`Template ${templateId} not found in cache`);
			} else {
				musclesWorked.primary.add(template.primary_muscle_group);
				// secondary_muscle_groups is an array
				template.secondary_muscle_groups.forEach((muscle) => {
					musclesWorked.secondary.add(muscle);
				});
			}
		});

		return musclesWorked;
	},

	getData: async function (apiKey) {
		const hevyData = {
			primary: new Set(),
			secondary: new Set(),
			workoutDays: []
		};

		try {
			// Check if the cache is empty
			if (Cache.keys().length === 0) {
				await this.getWorkoutTemplateAndCache(apiKey);
			}

			const workoutData = await this.getWorkoutData(apiKey);

			const data = await workoutData.json();
			let workouts = data.workouts;

			// Filter out workouts for this week
			const today = new Date();
			const weekStart = startOfISOWeek(today);
			const weekEnd = endOfISOWeek(today);

			workouts = workouts.filter((workout) => {
				const workoutDate = new Date(workout.start_time);
				return workoutDate >= weekStart && workoutDate <= weekEnd;
			});
			console.log("Found workouts for this week: ", workouts.length);

			for (let workout of workouts) {
				const muscles = await this.getMusclesWorkedForWorkout(workout);
				muscles.primary.forEach(m => hevyData.primary.add(m));
				muscles.secondary.forEach(m => hevyData.secondary.add(m));

				// Get day of the week for the workout
				const day = new Date(workout.start_time);
				const dayOfWeek = getISODay(day);
				hevyData.workoutDays.push(dayOfWeek);
			}

			// return musclesWorked as array
			return {
				primary: [...hevyData.primary],
				secondary: [...hevyData.secondary],
				workoutDays: hevyData.workoutDays
			};


		} catch (error) {
			console.error(error);
			return {
				primary: [],
				secondary: [],
				workoutDays: []
			};

		}

	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === 'GET_HEAVY_DATA') {

			const data = this.getData(payload.heavyApiKey).then((data) => {
				this.sendSocketNotification('HEAVY_DATA_RES', data);
			}).catch((error) => {
				console.error(error);
				this.sendSocketNotification('HEAVY_DATA_RES', {
					primary: [],
					secondary: []
				});
			});
		}
	}
});
