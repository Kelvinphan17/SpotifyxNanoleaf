import {Typography, IconButton, Slider, Box, Container} from '@mui/material';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

import {PauseRounded, PlayArrowRounded, FastForwardRounded, FastRewindRounded} from '@mui/icons-material';

import { useNavigate } from "react-router-dom";

import SpotifyIcon from "../images/SpotifyIcon.png"

export default function Player({childToParent}) {

    // State variables
    const [currentlyPlayingName, setCurrentlyPlayingName] = useState("No currently playing song");
    const [currentlyPlayingArtist, setCurrentlyPlayingArtist] = useState("Please play a song to get started");
    const [currentlyPlayingImage, setCurrentlyPlayingImage] = useState(SpotifyIcon);
    const [duration, setDuration] = useState(0); 
    const [position, setPosition] = useState(0);
    const [playbackState, togglePlaybackState] = useState(false);
    const [didSkip, toggleDidSkip] = useState(false);

    // Router Navigate initialization
    const navigate = useNavigate();
    
        
    // API call to get all current track info, change when didSkip is changed
    useEffect(() => {

        const fetchData = async () => {
            
            const data = await fetch("http://localhost:8080/api/spotify/currentlyPlaying").then(response => response.json());

            if (data.status === 401 ){
                if(data.message === "Invalid access token"){
                    navigate("/landing")
                }
                else if(data.message === "The access token expired"){
                    fetch("http://localhost:8080/api/refresh")
                }
                return;
            }

            if (data == null){
                return;
            }

            togglePlaybackState(!data.is_playing)
            setCurrentlyPlayingName(data.item.name)
            setCurrentlyPlayingArtist(data.item.artists[0].name)
            setCurrentlyPlayingImage(data.item.album.images[1].url)
            setDuration(Math.floor(data.item.durationMs/1000))
            setPosition(Math.floor(data.progress_ms/1000))

            childToParent(data.item.album.images[1].url)
            
        }

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[didSkip])

    // Make an API call every second to monitor track position
    // Also keeps track of Spotify playback changes made outside of browser
    useEffect(() =>{

        const interval = setInterval(()=>{

            // If position is >= to duration - 1, trigger a skip state    
            if(position >= duration-1){
                toggleDidSkip(!didSkip)
            }

            // API call loop every second
           const fetchData = async () =>{

                try{
                    const data = await fetch("http://localhost:8080/api/spotify/currentlyPlaying").then(response=> response.json());

                    setPosition(Math.floor(data.progress_ms/1000));

                    // If song name of newly fetched track doesn't match previously fetched track, trigger a skip
                    if(data.item.name !== currentlyPlayingName){
                        
                        console.log(data.item.name,currentlyPlayingName)
                        toggleDidSkip(didSkip => !didSkip);
                        togglePlaybackState(playbackState => {playbackState = !data.is_playing});
                        childToParent(currentlyPlayingImage)
                        
                    }

                }catch(e){
                    return () => clearInterval(interval);
                }

           }

           fetchData();


        }, 1000)

        return () => clearInterval(interval);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentlyPlayingName])


    // Make an API call to toggle playback state
    function togglePlayback(){
        fetch("http://localhost:8080/api/spotify/togglePlayback", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: `${playbackState}`
          }).then(togglePlaybackState(!playbackState))
    }

    // Make an API call to skip to next track
    function nextSong(){
        fetch("http://localhost:8080/api/spotify/nextSong")
        
        // Timeout to make sure nextSong API call finishes before triggering didSkip state
        setTimeout(() => {
            toggleDidSkip(!didSkip);
          }, 500);
    }

    // Make an API call to skip to previous track
    function prevSong(){
        fetch("http://localhost:8080/api/spotify/prevSong")

        // Timeout to make sure nextSong API call finishes before triggering didSkip state
        setTimeout(() => {
            toggleDidSkip(!didSkip);
          }, 500);
    }

    // Make an API call to seek to position "value" of current track
    function seekToPosition(value){
        fetch("http://localhost:8080/api/spotify/seekTo", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: `${value}`
          })
    }

    // Styling for small text under slider
    // Adapted from https://mui.com/material-ui/react-slider/
    const TinyText = styled(Typography)({
        fontSize: '0.75rem',
        opacity: 0.38,
        fontWeight: 500,
        letterSpacing: 0.2,
    });

    // Styling for playback slider duration and time left
    // Adapted from https://mui.com/material-ui/react-slider/
    function formatDuration(value) {
        const minute = Math.floor(value / 60);
        const secondLeft = value - minute * 60;
        return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
    }

    // Function to handle slider change
    function handleSeek(value){
    
        setPosition(value);
    }


    return (
        <div style={{height:"inherit"}}>
            

            <Container maxWidth="xl" sx={{
                display:"flex", 
                justifyContent: "flex-end",
                marginTop:"auto", 
                height:"inherit"
                }}>
                
                <Container maxWidth="md" sx={{
                    display:"flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "flex-end", 
                    width:"100%",
                    backgroundColor:'rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(1px)',
                    borderRadius:"40px",
                    padding: "20px",
                    margin:"auto",
                    }}>

                    <Box sx={{
                        zIndex:"1",
                        overflow: "hidden",
                        borderRadius: "30px",
                        }}>
                        <img src={currentlyPlayingImage}  alt="Current Playing Album" ></img>
                    </Box>
                    <Box sx={{display:"flex", flexDirection: "column", padding:"1rem", alignItems: "center", zIndex:"99", width:"inherit"}}>
                        <Typography variant="h4" sx={{
                            textAlign: "center",
                            marginTop: "auto",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            width:"inherit"}} 
                            noWrap>
                            {currentlyPlayingName}
                        </Typography>
                        <Typography variant="h6"> {currentlyPlayingArtist} </Typography>
                    </Box>

                    <Slider
                        aria-label="playback"
                        value = {position}
                        max={duration}
                        onChange = {(_, value) => handleSeek(value)}
                        onChangeCommitted = {(_, value) => seekToPosition(value)}
                        sx={{
                            color: "rgba(0,0,0,0.87)", 
                            '& .MuiSlider-rail': {opacity: 0.28,},
                        }}    
                    />
                    <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: -2,
                        width: '100%',
                        paddingTop: "10px"
                    }}
                    >
                        <TinyText>{formatDuration(position)}</TinyText>
                        <TinyText>-{formatDuration(duration - position)}</TinyText>
                    </Box>

                    <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: -1,
                    }}
                    >
                        <IconButton aria-label="previous song" onClick={() => prevSong()}>
                            <FastRewindRounded fontSize="large" sx={{color:"rgba(0,0,0,0.87)"}}/>
                        </IconButton>

                        <IconButton
                            aria-label={playbackState ? 'play' : 'pause'}
                            onClick={() => togglePlayback()}
                        >
                            {playbackState ? (
                            <PlayArrowRounded
                                sx={{ fontSize: '3rem', color:"rgba(0,0,0,0.87)" }}
                            />
                            ) : (
                            <PauseRounded sx={{ fontSize: '3rem', color:"rgba(0,0,0,0.87)"}}  />
                            )}
                        </IconButton>

                        <IconButton aria-label="next song" onClick={() => nextSong()}>
                            <FastForwardRounded fontSize="large" sx={{color:"rgba(0,0,0,0.87)"}} />
                        </IconButton>

                    </Box>

                </Container>
        
            </Container>
        </div>
    )



}