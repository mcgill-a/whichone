# whichone

https://whichone.rocks/


## Command Line Arguments
|Parameter   | Description                                         | Default       | Required   | Type |
|------------|-----------------------------------------------------|---------------|---------|------|
|`id`| Spotify Developer API Client | None | :heavy_check_mark: | String |
|`secret`| Spotify Developer API Client Secret | None | :heavy_check_mark: | String |
|`redirect`| Spotify Login Redirect URI | http://127.0.0.1:8080 | :heavy_multiplication_x: | String |
|`limit_route`| User IP address rate limit for accessing page routes | "50 per day" "30 per hour" | :heavy_multiplication_x: | List |
|`limit_api`| User IP address rate limit for accessing API routes | "10 per day" | :heavy_multiplication_x:  | List |

## Required Development Setup

* Setup a virtual environment and install the project dependencies:
```sh
python3 -m venv ve-whichone
source ve-whichone/Scripts/activate
pip install -r whichone/requirements.txt 
```

* Create a new app on the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
* Whitelist the website address to the Spotify Developer app redirect URIs to redirect after Spotify authentication
<img src="whichone/demo/redirect.png" width="50%">


* (Optional) Set the command line arguments as environment variables:
```sh
export SPOTIFY_CLIENT_ID='YOUR_SPOTIFY_CLIENT_ID'
export SPOTIFY_CLIENT_ID='YOUR_SPOTIFY_CLIENT_SECRET'
export SPOTIFY_REDIRECT_URL='YOUR_SPOTIFY_REDIRECT_URI'
export LIMIT_ROUTE="'50 per day' '30 per hour'"
export LIMIT_API="10 per day"
```


## Usage
```sh
# Using only required parameters:
python run.py --id $SPOTIFY_CLIENT_ID --secret $SPOTIFY_CLIENT_SECRET
# Using optional parameters:
python run.py --id $SPOTIFY_CLIENT_ID --secret $SPOTIFY_CLIENT_SECRET  --redirect $SPOTIFY_REDIRECT_URL --limit_route $LIMIT_ROUTE --limit_api $LIMIT_API
```

<img src="whichone/demo/help.png" width="60%">
<img src="whichone/demo/running.png" width="50%">


## Screenshots

<img src="whichone/demo/more.jpg" width="80%">
<img src="whichone/demo/upbeat.jpg" width="80%">
<img src="whichone/demo/danceable.jpg" width="80%">
<img src="whichone/demo/longer.jpg" width="80%">

## Contributors

| Name | Github |
|--|--|
| Alex McGill | [mcgill-a](https://github.com/mcgill-a)|
| Alexander Thompson |[athompsonScottLogic](https://github.com/athompsonScottLogic) |
| Philip Hardy | [PHardySL](https://github.com/PHardySL)|
