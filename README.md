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
    position: "top_right",
    header: "Heavy",
    config: {
      heavyApiKey: "YOUR_HEVY_API_KEY"
    }
}
```

Restart your MagicMirror.

## Configuration Options






