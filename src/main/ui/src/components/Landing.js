import {Button, Typography, Card, CardContent, CardActions, Container} from '@mui/material';
import background from '../images/background.jpg'

export const Landing = () => {

  // Calls API to show login page
  const getSpotifyUserLogin = () => {
    fetch("http://localhost:8080/api/login")
    .then((response) => response.text())
    .then(response => {
      window.location.replace(response);
    })
  }

  return (
    <div style={{height: '100%'}}>
        <div style={{backgroundImage: `url(${background})`, backgroundSize: "cover", height:"100%", filter: "blur(8px)"}}/>
        
        <Container maxWidth="false" style={{position: "fixed", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", top: "0"}}>

            <Card sx={{ bgcolor: "#f5f5f5" }}>

                <CardContent sx= {{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", padding: "40px"}}>

                    <Typography variant="h4">Welcome to Spotify x Nanoleaf</Typography> 
                    <Typography variant="caption" gutterBottom> A web based application designed to let Spotify and Nanoleaf interact</Typography>

                    <Typography varaint="text" sx={{ mt: "40px"}}>Please log in to Spotify to get started</Typography>

                    <CardActions>
                        <Button variant = "contained" color = "primary" size= "large" onClick = {getSpotifyUserLogin}>Sign In</Button>    
                    </CardActions>


                </CardContent>

            </Card>
        </Container>
    </div>
  )
}

