import "hacktimer"
import { Nav } from "./components/Nav"
import { Landing } from "./components/Landing"
import { Dashboard } from "./components/Dashboard" 
import {BrowserRouter, Routes, Route} from "react-router-dom"

// Main landing. If access token exists then route to /
// Else if access token invalid or null, route to landing to log in
function App() {
  return (
    <BrowserRouter>
      <div className="App">
          <Nav />
          
          <Routes>
            <Route exact path = "/landing" element = {<Landing/>} />
            <Route exact path = "/" element = {<Dashboard/>} />
          </Routes>
      </div>
    </BrowserRouter>


  );
}

export default App;
