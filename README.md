# Spotify x Nanoleaf
A Spotify and Nanoleaf web application that pulls data from the currentply playing song on Spotify to modify Nanoleaf light panel effects. Based on the colours of the currently playing song's album image, this web application will pull the 6 dominant colours and display them as a wheel effect on your Nanoleaf light panels.

## Utilizes Spotify Web API and Nanoleaf Open API
Makes calls to Spotify's Web API to:
- Authenticate user account
- Fetch user's currently playing track
- Allow user to skip to next or previous song
- Allow user to toggle playback

Makes calls to Nanoleaf's Open API to:
- Allow user to turn Nanoleaf light panels on and off
- Modify effect to have colour palette reflecting album image
- Modify effect animation speed
- Change Nanoleaf Brightness

## Tech Stack
- Java 17
- Spring 3.0.3
- React 18.2

## Resources
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Spotify Web Authentication](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/)
- [Nanoleaf Open API](https://forum.nanoleaf.me/docs)
- [Java Spotify Web API](https://github.com/spotify-web-api-java/spotify-web-api-java)

## Video of web application in action
https://user-images.githubusercontent.com/56002775/224861577-00da2174-1ecf-4f43-ba01-c1626e0b80f7.mp4

## Local Setup
### Prerequisites
- Java 17
- Maven
- Node.js

### Nanoleaf IP and Token setup
To ensure that this web application will connnect to your Nanoleaf light panels please retrieve the IP of your Nanoleaf light panels.
You will also need a token to access your Nanoleaf light panels. This can be retrieved using a program like Postman.
First, hold down the the on-off button for 5-7 seconds until the LED starts flashing.
Next, send a POST Request like the following
```
http://{{ipAddress}}:16021/api/v1/new
``` 
and retrieve the token provided.

Add both the IP and Token to the application.properties file.

### Running the Server
To run the server simply navigate to the root folder and run the following commands
```
mvn clean install
```
```
mvn spring-boot:run
```

### Running the Web Application
To run the web application navigate to /src/main/ui and run 
```
npm start
```
in a console. The web application will now be visibile on `http://localhost:3000`


