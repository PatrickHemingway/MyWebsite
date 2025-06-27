import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import NavBar from "./Components/NavBar/navBar"
import DuckTable from "./Components/DuckRace/DuckTable"
import siteData from "./assets/MyWebsite.json"
import './App.css'

function App() {

  return (
    <>
      <div>
        <NavBar navData={siteData.navBar}/>
        <DuckTable />
      </div>
    </>
  )
}

export default App
