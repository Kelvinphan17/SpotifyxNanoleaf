import {Divider, Typography, Switch, Stack, Box, Slider, Tooltip} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { useEffect, useState } from 'react';

export default function NanoleafDrawer({sixColours}){

  // State variables
  const [speed, setSpeed] = useState(25);
  const [brightness, setBrightness] = useState(100)


  // Function to handle when Nanoleaf toggle switch is triggered
  // Makes an API call with "event" in body
  function handleSwitchState(event){
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    };

    fetch("/api/nanoleaf/toggle", requestOptions)
  }
  
  // Monitors when either the sixColours or speed state changes
  // On state change, make an API call to modify the Nanoleaf effect and rerender
  useEffect(()=>{
    const params = {
      sixColours: sixColours,
      speed: speed}

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    };

    fetch("http://localhost:8080/api/nanoleaf/modifyEffect", requestOptions)

  }, [sixColours, speed])

  // Monitors when the brightness state changes from the slider
  // On state change, make an API call to modify the Nanoleaf brightness
  useEffect(() => {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brightness)
    };

    fetch("/api/nanoleaf/brightness", requestOptions)

  },[brightness])

  // Styling for LargeSwitch
  const LargeSwitch = styled(Switch)(() => ({
      width: 68,
      height: 34,
      padding: 7,
      '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
          color: '#3FAE29',
          transform: 'translateX(30px)',
          '&+.MuiSwitch-track': {
              backgroundColor: '#3FAE29',
            },
        },
      },
      '& .MuiSwitch-thumb': {
        width: 30,
        height: 30,
      },
      '& .MuiSwitch-track': {
        borderRadius: 20 / 2,
      },
    }));
  
  // Styling for palette squares container
  const paletteSquare = {display:"flex", flexDirection:"column", justifyContent:"center", alignItems: "center"}
  
  // Styling for each individual palette colour
  const paletteColour = {width:"60px", height:"60px", borderRadius:"10px"}
  
  // Helper function to handle converting a value to hex
  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  // Function that converts RGB string to Hex value
  const rgbToHex = (rgbString) => {
    const r = parseInt(rgbString.split("rgb(")[1].split(")")[0].split(",")[0])
    const g = parseInt(rgbString.split("rgb(")[1].split(")")[0].split(",")[1])
    const b = parseInt(rgbString.split("rgb(")[1].split(")")[0].split(",")[2])

    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
  }

  // Styling for small text under slider
  // Adapted from https://mui.com/material-ui/react-slider/
  const TinyText = styled(Typography)({
    fontSize: '0.75rem',
    opacity: 0.38,
    fontWeight: 500,
    letterSpacing: 0.2,
  });
    


  return (
      <Stack spacing={3} sx={{padding:"12px 16px",zIndex: "99"}} divider={<Divider variant="middle" orientation="horizontal" flexItem />}>

          <Typography variant="h5" align='center'>Nanoleaf Controller</Typography>
          
          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
              <Typography variant="h6" sx={{flexGrow:"1"}}>Nanoleaf</Typography>
              <LargeSwitch defaultChecked onChange={(event) => handleSwitchState(event.target.checked)}/>
          </Box>

          <Grid container spacing={2} justifyContent="center">
            <Grid xs={12}>
              <Typography variant="h6" align="center">Colour Palette</Typography>
            </Grid>
            <Grid xs={4} sx={paletteSquare}>
              <Box bgcolor={sixColours[0]} sx={paletteColour} />
              <Typography variant="overline">{rgbToHex(sixColours[0])}</Typography>
            </Grid>
            <Grid xs={4} sx={paletteSquare}>
              <Box bgcolor={sixColours[1]} sx={paletteColour} />
              <Typography variant="overline">{rgbToHex(sixColours[1])}</Typography>
            </Grid>
            <Grid xs={4} sx={paletteSquare}>
              <Box bgcolor={sixColours[2]} sx={paletteColour} />
              <Typography variant="overline">{rgbToHex(sixColours[2])}</Typography>
            </Grid>
            <Grid xs={4} sx={paletteSquare}>
              <Box bgcolor={sixColours[3]} sx={paletteColour} />
              <Typography variant="overline">{rgbToHex(sixColours[3])}</Typography>
            </Grid>
            <Grid xs={4} sx={paletteSquare}>
              <Box bgcolor={sixColours[4]} sx={paletteColour} />
              <Typography variant="overline">{rgbToHex(sixColours[4])}</Typography>
            </Grid>
            <Grid xs={4} sx={paletteSquare}>
              <Box bgcolor={sixColours[5]} sx={paletteColour} />
              <Typography variant="overline">{rgbToHex(sixColours[5])}</Typography>
            </Grid>
            <TinyText>Not all colours will display accurately due to Nanoleaf hardware limitation</TinyText>
          </Grid>

          <Box>
            <Box sx={{display:"flex", flexDirection:"row", alignItems: "center", justifyContent: "center"}}>
              <Typography variant="h6" align="center">Nanoleaf Brightness</Typography>
              <Tooltip title="Slider to change your Nanoleaf brightness" sx={{pl:"5px", cursor:"pointer"}}>
                <InfoOutlinedIcon fontSize="small"></InfoOutlinedIcon>
              </Tooltip>
            </Box>

            <Slider
              aria-label="brigtness"
              defaultValue = {brightness}
              max= {100}
              min= {0}
              valueLabelDisplay = "auto"
              onChangeCommitted = {(_, value) => setBrightness(value)}
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
              <TinyText>0%</TinyText>
              <TinyText>100%</TinyText>
            </Box>
          </Box>

          <Box>
            <Box sx={{display:"flex", flexDirection:"row", alignItems: "center", justifyContent: "center"}}>
              <Typography variant="h6" align="center">Animation Speed</Typography>
              <Tooltip title="Slider to change the speed at which colours transition" sx={{pl:"5px", cursor:"pointer"}}>
                <InfoOutlinedIcon fontSize="small"></InfoOutlinedIcon>
              </Tooltip>
            </Box>
            <Slider
              aria-label="speed"
              defaultValue = {speed}
              max= {100}
              min= {5}
              valueLabelDisplay = "auto"
              onChangeCommitted = {(_, value) => setSpeed(value)}
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
              <TinyText>0.5s</TinyText>
              <TinyText>10s</TinyText>
            </Box>
          </Box>



      </Stack>

  )



}