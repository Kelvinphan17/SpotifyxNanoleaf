import { AppBar, Toolbar, Icon } from '@mui/material'
import logo from '../images/logo.svg'


// Navbar that will always be on top
export const Nav = () => {

    return (
        <AppBar position="static" sx={{ bgcolor: "#f5f5f5", zIndex:"9999"}}>
            <Toolbar>
                <Icon sx = {{ flexGrow: 1, height: "inherit"}}>
                    <img src={logo} alt="Logo"/>
                </Icon>
            </Toolbar>
        </AppBar>
    )
}