import React, { LegacyRef, useEffect, useRef, useState } from 'react'
import { getGrid, getPathDivs } from './utils/utils'
import './styles/map.css'

const CIRCLESIZE = 5
const CELLSIZE = 16

interface MapProps {
  pathsToDisplay: any
  allDisplayPaths: any
  setCurrentPath: any
}

const Map: React.FC<MapProps> = ({
  pathsToDisplay,
  allDisplayPaths,
  setCurrentPath,
}) => {
  const trackMouse = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
    setCursorStyle({
      ...cursorStyle,
      top:
        e.pageY -
        parseInt(
          cursorStyle.height.substring(0, cursorStyle.height.length - 2)
        ) /
          2 +
        'px',
      left:
        e.pageX -
        parseInt(cursorStyle.width.substring(0, cursorStyle.width.length - 2)) /
          2 +
        'px',
    })

  const findPath = (endCoords: { x: number; y: number }) => {
    const Graph = require('astar').Graph
    const graph = new Graph(grid.length)

    const x = Math.floor(startCircleCoords!.x / CELLSIZE)
    const y = Math.floor(startCircleCoords!.y / CELLSIZE)

    const end_x = Math.floor(endCoords.x / CELLSIZE)
    const end_y = Math.floor(endCoords.y / CELLSIZE)

    let newPath: any = []

    graph.path(x, y, end_x, end_y, (path: any) => {
      newPath = path
      setCurrentPath(newPath)
    })

    return newPath
  }

  const [cursorStyle, setCursorStyle] = useState({
    left: '0px',
    top: '0px',
    width: CIRCLESIZE + 'px',
    height: CIRCLESIZE + 'px',
    backgroundColor: 'pink',
    borderRadius: '50%',
  })

  const [mapDimensions, setMapDimensions] = useState<{
    width: number | undefined
    height: number | undefined
  }>({
    width: 0,
    height: 0,
  })
  const [circles, setCircles] = useState<any[]>([])
  const [startCircleCoords, setStartCircleCoords] = useState<{
    x: number
    y: number
  }>({ x: 0, y: 0 })
  const [isStartCircle, setIsStartCircle] = useState<boolean>(false)
  const mapRef: LegacyRef<HTMLImageElement> | undefined = useRef(null)
  const [drawnGrid, setDrawnGrid] = useState<{
    rows: JSX.Element[]
    columns: JSX.Element[]
  }>({ rows: [], columns: [] })
  const [grid, setGrid] = useState<number[][]>([[]])
  const [pathDivs, setPathDivs] = useState<any>([])

  useEffect(() => {
    const mapWidth = mapRef.current?.clientWidth
    const mapHeight = mapRef.current?.clientHeight
    setMapDimensions({ width: mapWidth, height: mapHeight })

    const displayGrid = getGrid(mapWidth, mapHeight, CELLSIZE)

    // setDrawnGrid(displayGrid)
    setGrid((_) => {
      const newGrid = displayGrid.rows.map((row) => {
        return displayGrid.columns.map((col) => 0)
      })

      return newGrid
    })
  }, [mapRef.current?.clientWidth, mapRef.current?.clientHeight])

  return (
    <>
      <div
        className='map-container'
        onMouseMove={trackMouse}
        onClick={(e) => {
          const mouseX = e.pageX
          const mouseY = e.pageY

          const circleStyle = {
            left: mouseX - CIRCLESIZE / 2 + 'px',
            top: mouseY - CIRCLESIZE / 2 + 'px',
            width: CIRCLESIZE + 'px',
            height: CIRCLESIZE + 'px',
            backgroundColor: 'pink',
            borderRadius: '50%',
          }

          const newCircle = (
            <div key={mouseX} className='circle' style={circleStyle} />
          )

          if (isStartCircle) {
            const mouseCoords: { x: number; y: number } = {
              x: Math.floor(mouseX),
              y: Math.floor(mouseY),
            }

            const newPath = findPath(mouseCoords)
            const newPathDivs = getPathDivs(
              newPath,
              mapDimensions,
              CELLSIZE,
              startCircleCoords,
              mouseCoords
            )

            console.log(newPathDivs)
            setPathDivs(newPathDivs)
          } else {
            setStartCircleCoords({
              x: Math.floor(mouseX),
              y: Math.floor(mouseY),
            })
          }

          setCircles(isStartCircle ? [...circles, newCircle] : [newCircle])
          setIsStartCircle(!isStartCircle)
        }}
      >
        <div className='circle' style={cursorStyle} />
        {circles}
        {drawnGrid.rows}
        {drawnGrid.columns}
        <img
          ref={mapRef}
          className={'mu-map'}
          src={require('../imgs/mu-map.png')}
          alt='Mizzou Map'
        />
        {pathDivs}
        {allDisplayPaths.map((path: any) =>
          getPathDivs(path, mapDimensions, CELLSIZE)
        )}
      </div>
    </>
  )
}

export default Map
