import React, { useState } from 'react'
import './styles/path-controller.css'

interface PathsControllerProps {
  setPathsToDisplay: any
  pathsToDisplay: any
  setAllDisplayPaths: any
  currentPath: any
}

const PathsController: React.FC<PathsControllerProps> = ({
  setPathsToDisplay,
  pathsToDisplay,
  setAllDisplayPaths,
  currentPath,
}) => {
  const handlePathChange = (pathName: string) => {
    setPathsToDisplay((pathsToDisplay: any) => {
      pathsToDisplay[pathName] = currentPath

      setAllDisplayPaths(Object.values(pathsToDisplay))

      return pathsToDisplay
    })
  }

  const togglePath = (thisPathName: string) => {
    const isActive = !activePaths[thisPathName]

    setActivePaths(() => {
      activePaths[thisPathName] = isActive

      return activePaths
    })

    setAllDisplayPaths(() => {
      return Object.keys(pathsToDisplay)
        .filter((pathName: string) => {
          if (isActive) return true

          return pathName !== thisPathName
        })
        .map((key: string) => pathsToDisplay[key])
    })
  }

  const [activePaths, setActivePaths] = useState<any>({
    path1: true,
    path2: true,
    path3: true,
    path4: true,
  })

  return (
    <div className='path-controller'>
      <button onClick={() => togglePath('path1')}>Toggle Path 1</button>
      <button onClick={() => togglePath('path2')}>Toggle Path 2</button>
      <button onClick={() => togglePath('path3')}>Toggle Path 3</button>
      <button onClick={() => togglePath('path4')}>Toggle Path 4</button>
      <br />

      <button onClick={() => handlePathChange('path1')}>Set Path 1</button>
      <button onClick={() => handlePathChange('path2')}>Set Path 2</button>
      <button onClick={() => handlePathChange('path3')}>Set Path 3</button>
      <button onClick={() => handlePathChange('path4')}>Set Path 4</button>
    </div>
  )
}

export default PathsController
