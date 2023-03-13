package dev.KelvinPhan.spotifyxnanoleaf.controllers;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRefreshRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;

import java.io.IOException;
import java.net.URI;

@RestController
@RequestMapping("/api")
/**
 * RestController that handles authorization API calls from frontend
 */
public class AuthController {

    // Three values from Spotify Developer Portal
    private static final URI redirectURI = SpotifyHttpManager.makeUri("http://localhost:8080/api/callback");
    private static final String clientID = "52975177c26b417881b1b522cf95ecd1";
    private static final String clientSecret = "93ebcec970034856b4f0441e3afa400b";


    // Creates a new instance of spotifyApi
    public static SpotifyApi spotifyApi = new SpotifyApi.Builder()
            .setClientId(clientID)
            .setClientSecret(clientSecret)
            .setRedirectUri(redirectURI)
            .build();


    @GetMapping("login")
    /**
     * On API call to /api/login, create new login instance to generate authorization code
     */
    public String spotifyLogin(){
        AuthorizationCodeUriRequest authCodeUriReq = spotifyApi.authorizationCodeUri()
                .scope("user-read-playback-state, user-modify-playback-state, playlist-read-private," +
                        "user-read-currently-playing, user-read-playback-position, user-library-read")
                .show_dialog(true)
                .build();
        final URI uri = authCodeUriReq.execute();
        return uri.toString();
    }


    @GetMapping("callback")
    /**
     * On API call to /api/callback, set tokens based off of authorization code
     */
    public void getSpotifyTokens(@RequestParam("code") String userCode, HttpServletResponse response) throws IOException {
        AuthorizationCodeRequest authorizationCodeRequest = spotifyApi.authorizationCode(userCode)
                .build();

        try {
            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRequest.execute();

            // Set access and refresh token for further "spotifyApi" object usage
            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
            spotifyApi.setRefreshToken(authorizationCodeCredentials.getRefreshToken());

        } catch (IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e) {
            System.out.println("Error: " + e.getMessage());
        }
        // Redirect user to main page after login is complete
        response.sendRedirect("http://localhost:3000/");
    }

    @GetMapping("refresh")
    /**
     * On API call to /api/refresh, refresh token to continue access to Spotify
     */
    public void refreshSpotifyToken(){
        final AuthorizationCodeRefreshRequest authorizationCodeRefreshRequest = spotifyApi.authorizationCodeRefresh()
                .build();

            try {
                final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRefreshRequest.execute();

                // Set access and refresh token for further "spotifyApi" object usage
                spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());

            } catch (IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e) {
                System.out.println("Error: " + e.getMessage());
            }

    }



}
