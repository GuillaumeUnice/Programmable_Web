# Programmable web JS

### Membres

- Salah Bennour 
- Guillaume Borg <guillaume.unice@gmail.com>
- Youssef Salim 
- Yuqi Wang 

## Features

 Guillaume
follow persons Youssef
Loading Wav Guillaume
Player transversal Guillaume
Apply some audio effects Yuqi & Salah

### Backend
* Authentification (Interceptor + JsonWebToken + middleware).
* Social aspect : Comment & mark a mix and follow an user.
* Search a specific mix or user.
* Loading Mix in Wav and listen it thank to a player in bottom of the web page.
* Upload some track in order to mix them.
* Apply some sound effect in our mix (gain, stereo, etc...).

### Frontend
* Include ngWaveSurfer an angular module base on Web Audio API to play music.
* Use Web Audio API to make some sound effects.
* A custom morph search.
* A vertical timeline.


## Installation

#### Requirements
To run the application, you'll need: <br />
* NodeJS with NPM installed
* Grunt
* ExpressJs
* Sass (ruby (or ruby dev) and gem installed and run the following command "gem install compass")
* To have Mongo Database



First of all, import in your Mongo Database : /backend/database/databaseScript_V2.sql


#### Downloading the Dependencies
After cloning the source code from Git, you need to run the following command to download all the dependencies (express, mocha, etc.) in :<br />
/backend<br />
/frontend

```
npm install
```

Then, install frontend package. So run the following command to download all frontend dependencies in :<br />
/frontend

```
bower install
```


#### Running the Server
After downloading all the dependencies, you can run the server with the following command in /backend:

```
npm start
```

The server's api will then be accessible at `http://localhost:3000`.

#### Running frontend App
After downloading all the dependencies, you can run the following command in :<br />
/frontend

```
grunt serve
```

Each frontend Application will be accessible at `http://localhost:9000`.

#### Connect frontend App with an existing user
login : test@gmail.com<br />
password : azerty<br />