import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./Components/NavBar/navBar";
import ProjectList from "./Components/ProjectList/projectList";
import DuckRace from "./Projects/DuckRace/DuckTable";
import FlashCards from "./Projects/FlashCards/flashCards";
import siteData from "./assets/MyWebsite.json";
import './App.css';

function App() {
  return (
    <Router>
      <NavBar navData={siteData.navBar} />
      <Routes>
        <Route path="/" element={<ProjectList projects={siteData.projects} />} />
        <Route path="/JavaScriptDuckRace" element={<DuckRace />} />
        <Route path="/FlashCards" element={<FlashCards />} />
      </Routes>
    </Router>
  );
}

export default App;
