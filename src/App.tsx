import React, { useState } from 'react'
import './App.css'
import Map from './components/Map'
import PathsController from './components/paths-controller'

function App() {
  const [pathsToDisplay, setPathsToDisplay] = useState({})
  const [allDisplayPaths, setAllDisplayPaths] = useState([])
  const [currentPath, setCurrentpath] = useState<any>()

  return (
    <div className='map-paths-container'>
      <Map
        pathsToDisplay={pathsToDisplay}
        allDisplayPaths={allDisplayPaths}
        setCurrentPath={setCurrentpath}
      />
      <PathsController
        setPathsToDisplay={setPathsToDisplay}
        pathsToDisplay={pathsToDisplay}
        setAllDisplayPaths={setAllDisplayPaths}
        currentPath={currentPath}
      />
    </div>
  )
}

export default App
