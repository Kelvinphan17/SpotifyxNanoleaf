package dev.KelvinPhan.spotifyxnanoleaf.controllers;

import dev.KelvinPhan.spotifyxnanoleaf.services.ColourService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.server.ResponseStatusException;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.miscellaneous.CurrentlyPlaying;
import se.michaelthelin.spotify.requests.data.player.*;

import java.io.IOException;

import static dev.KelvinPhan.spotifyxnanoleaf.controllers.AuthController.spotifyApi;

@RestController
@RequestMapping("/api/spotify")
@CrossOrigin(origins="*")
/**
 * RestController that handles Spotify API calls from frontend
 */
public class SpotifyApiController {


    // Initialize colourService
    final ColourService colourService = new ColourService();

    @GetMapping("currentlyPlaying")
    /**
     * On API call to /api/spotify/currentlyPlaying, send request to Spotify API using spotifyApi object
     * that grabs the currently playing track
     */
    public CurrentlyPlaying getUsersCurrentlyPlayingTrack() {

        // Build object to get currently playing track
        final GetUsersCurrentlyPlayingTrackRequest getUsersCurrentlyPlayingTrackRequest = spotifyApi
                .getUsersCurrentlyPlayingTrack()
                .build();


        // Try to get currently playing track
        try {
            final CurrentlyPlaying currentlyPlaying = getUsersCurrentlyPlayingTrackRequest.execute();
            return currentlyPlaying;

        // Catch Exceptions
        } catch (IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e) {

            switch(e.getMessage()){
                // If access token is invalid send status 401 with message
                case "Invalid access token":
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());

                // If access token is expired send status 401 with message
                case "The access token expired":
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());

                // If any other error, send status 503 with message
                default:
                    throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, e.getMessage());

            }
        }
    }

    @PostMapping("togglePlayback")
    /**
     * On API call to /api/spotify/togglePlayback, send request to Spotify API using spotifyApi object
     * that toggles playback based on state from POST API call
     */
    public String togglePlayback(@RequestBody String state){

        // If state is false, pause playback
        if( state.equals("false")){

            final PauseUsersPlaybackRequest pauseUsersPlaybackRequest = spotifyApi.pauseUsersPlayback()
                    .build();

            try {
                final String pause = pauseUsersPlaybackRequest.execute();
                return pause;

            } catch (IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
            }
        }
        // If state is true, resume playback
        else{

            StartResumeUsersPlaybackRequest startResumeUsersPlaybackRequest = spotifyApi.startResumeUsersPlayback()
                    .build();

            try {
                final String play = startResumeUsersPlaybackRequest.execute();
                return play;

            } catch (IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
            }
        }

    }

    @GetMapping("nextSong")
    /**
     * On API call to /api/spotify/nextSong, send request to Spotify API using spotifyApi object
     * that skips current track
     */
    public String nextSong(){

        // Build object to skip currently playing track
        final SkipUsersPlaybackToNextTrackRequest skipUsersPlaybackToNextTrackRequest = spotifyApi.skipUsersPlaybackToNextTrack()
                .build();

        // Try to skip to next track
        try {
            final String next = skipUsersPlaybackToNextTrackRequest.execute();
            return next;

        // Catch exceptions and return message
        } catch (IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @GetMapping("prevSong")
    /**
     * On API call to /api/spotify/prevSong, send request to Spotify API using spotifyApi object
     * that skips to previous track
     */
    public String prevSong() {

        // Build object to skip to previous track
        final SkipUsersPlaybackToPreviousTrackRequest skipUsersPlaybackToPreviousTrackRequest = spotifyApi.skipUsersPlaybackToPreviousTrack()
                .build();

        // Try to skip to next track
        try {
            final String prev = skipUsersPlaybackToPreviousTrackRequest.execute();
            return prev;

        // Catch exceptions and return message
        } catch (IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping("seekTo")
    /**
     * On API call to /api/spotify/seekTo, send request to Spotify API using spotifyApi object
     * that seeks to the position based on selected position in seconds from POST API call
     */
    public String seekTo(@RequestBody int positionS){

        // Convert position in seconds to milliseconds
        int positionMs = (positionS*1000);

        // Build object to seek to a position in currently playing track
        final SeekToPositionInCurrentlyPlayingTrackRequest seekToPositionInCurrentlyPlayingTrackRequest =
                spotifyApi.seekToPositionInCurrentlyPlayingTrack(positionMs)
                        .build();

        // Try to seek to position on currently playing track
        try {
            final String string = seekToPositionInCurrentlyPlayingTrackRequest.execute();

            return string;

        // Catch exceptions and return message
        } catch (IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PostMapping("get6Dominant")
    /**
     * On API call to /api/spotify/get6Dominant, makes request to colourService to get the
     * 6 dominant colours in album image.
     *
     * @return      an RGBString representation of the 6 dominant colours
     */
    public String get6Dominant(@RequestBody String url) throws IOException {

        return colourService.get6Colours(url);


    }


}
