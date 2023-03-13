import Player from "./Player"

import  NanoleafDrawer  from "./NanoleafDrawer";
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {Drawer, IconButton} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


import nanoleafLogo from '../images/nanoleaf.svg'


export const Dashboard = () => {

    // State variables
    const [data, setData] = useState('https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png');
    const [sixColours, setSixColours] = useState(["rgb(28,212,100)", "rgb(28,212,100)", "rgb(28,212,100)", "rgb(28,212,100)", "rgb(28,212,100)", "rgb(28,212,100)"]);
    const [open, setOpen] = useState(false)
    const [moveMargin, setMargin] = useState(true)
    
    // Get album image data from child
    const childToParent = (childdata) => {
        setData(childdata);
    }

    // On detected album image change -> call API to get dominant colours
    useEffect(() => {
        fetch("http://localhost:8080/api/spotify/get6Dominant", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: `${data}`
              })
            .then(response=> response.text()).then(response =>setSixColours(response.split(":")))
        
            
    }, [data])

    // WallPaper styling
    const WallPaper = styled('div')({
        position: 'absolute',
        width: '100%',
        height: '100dvh',
        top: 0,
        left: 0,
        overflow: 'hidden',
        background: `linear-gradient( 180deg, ${sixColours[0]} , ${sixColours[1]} )`,
        backgroundSize:"200% 200%",
        backgroundPosition: "bottom 50px"
    });

    // Opens drawer and bumps margin of Player
    const handleDrawerOpen = () => {
        setOpen(true);
        setMargin(false)

    };

    // Closes drawer and resets margin of Player
    const handleDrawerClose = () => {
        setOpen(false);
        setMargin(true)
    };

    // Margin styling for player
    const marginMove = {
        main:{
            height:"inherit", 
            marginRight: `0`, 
            transition: 'margin-right 1.5s cubic-bezier(0.23, 1, 0.32, 1)',

        },
        bump:{
            height:"inherit", 
            marginRight: `100px`, 
            transition: 'margin-right 1s cubic-bezier(0.23, 1, 0.32, 1)',

        }
    }

    // Styling for drawer button
    const drawerButton = {

        popOut:{
            position: "fixed",
            top: "40vh",
            right:"-25px",
            height:"150px",
            bgcolor: "rgba(239, 239, 239, 0.7)",
            borderRadius: "10px",
            paddingLeft: "0",
            width: "fit-content",
            justifyContent: "flex-start",
            "&:hover": { backgroundColor: "rgba(239, 239, 239, .9)"},

        },
        backIn:{
            position: "fixed",
            top: "40vh",
            right:"300px",
            height:"150px",
            bgcolor: "#f5f5f5",
            borderRadius: "10px",
            paddingLeft: "0",
            width: "fit-content",
            justifyContent: "flex-start",
            "&:hover": { backgroundColor: "rgba(245, 245, 245, 1)"},

        }

    }
  
    
    return (

        <div style={{height:"inherit"}}>
            
            <WallPaper />
            
            <div style={moveMargin ? marginMove.main : marginMove.bump}>
                <Player childToParent={childToParent}/>
            </div>   
            
            <div>
                <IconButton sx={drawerButton.popOut} onClick= {handleDrawerOpen}>

                    <NavigateBeforeIcon sx={{marginLeft:"0"}}/>
                    <img src={nanoleafLogo} alt="Nanoleaf logo" style={{width:"40%"}}/>
                
                </IconButton>
            
                <Drawer sx={{
                            '& .MuiDrawer-paper': {
                            width: "300px",
                            bgcolor: "#f5f5f5",
                            top:"64px",
                            },
                        }}
                        variant="persistent"
                        anchor="right"
                        open = {open} >  
                    
                    <IconButton edge="end" sx={drawerButton.backIn} onClick= {handleDrawerClose}>
                        <NavigateNextIcon sx={{marginLeft:"0"}}/>
                        <img src={nanoleafLogo} alt="Nanoleaf logo" style={{width:"40%"}}/>
                    </IconButton>

                    <NanoleafDrawer sixColours={sixColours}/>

                </Drawer>


        </div>

        </div>
    )
}