# MMM-Hevy

A Magic Mirror module to show workout muscle split and days from **Hevy** workout App.

Hevy is a free weight lifting workout tracker that lets athletes log their workouts, analyze progress.

**Note:** At the moment, you will need a paid subscription to Hevy to use this module. The free version does not provide an API key to access the data.

## Screenshot

![Muscle Split](https://raw.githubusercontent.com/wathmal/MMM-Hevy/main/docs/muscle_split.png)

## Installing

Navigate to the modules folder and clone this repo (like other modules).

```bash
cd MagicMirror/modules
git clone https://github.com/wathmal/MMM-Hevy.git
```

Install the dependencies

```bash
cd MMM-Hevy
npm install
```

Grab the API key from Hevy. Visit https://hevy.com/settings?developer and Generate a new API key.

Add the configs to `MagicMirror/config/config.js` file
Sample config:

```js
{
  module: "MMM-Hevy",
    position
:
  "top_right",
    header
:
  "Heavy",
    config
:
  {
    heavyApiKey: "YOUR_HEVY_API_KEY"
  }
}
```

Restart your MagicMirror.

## Configuration Options

[//]: # (		updateInterval: 60 * 1000, // every 30 minutes)

[//]: # (		height: "200px",)

[//]: # (		heavyApiKey: "",)

[//]: # (		header: "Hevy",)

[//]: # (		primaryColor: "rgba&#40;194, 95, 96, 1&#41;",)

[//]: # (		secondaryColor: "rgba&#40;194, 95, 96, 0.5&#41;")

| Option         | Description                                                                         | Default                  |
|----------------|-------------------------------------------------------------------------------------|--------------------------|
| updateInterval | How often to update (in milliseconds). This will call Hevy GET /workout Api         | 15 * 60 * 1000           |
| height         | Height of the module in pixels                                                      | "200px"                  |
| heavyApiKey    | API key from Hevy. Visit https://hevy.com/settings?developer to get the key         | ""                       |
| header         | Header of the module                                                                | "Hevy"                   |
| primaryColor   | Color for primary targeted muscles. Can be anything which supports SVG `fill` prop. | "rgba(194, 95, 96, 1)"   |
| secondaryColor | Color for secondary targetted muscles. Same as primaryColor.                        | "rgba(194, 95, 96, 0.5)" |

## Credits

- https://github.com/diabeatz96/FalseStory I used the muscle split SVG from this project.


