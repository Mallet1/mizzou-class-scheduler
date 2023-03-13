import React, { LegacyRef, useEffect, useRef, useState } from 'react'
import { getGrid } from './components/utils'

const CIRCLEWIDTH = 5
const CIRCLEHEIGHT = 5

const Map = () => {
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

  const [cursorStyle, setCursorStyle] = useState({
    left: '0px',
    top: '0px',
    width: CIRCLEWIDTH + 'px',
    height: CIRCLEHEIGHT + 'px',
    backgroundColor: 'pink',
    borderRadius: '50%',
  })

  const [circles, setCircles] = useState<any[]>([])
  const [isStartCircle, setIsStartCircle] = useState<boolean>(false)
  const mapRef: LegacyRef<HTMLImageElement> | undefined = useRef(null)
  const [grid, setGrid] = useState<{
    rows: JSX.Element[]
    columns: JSX.Element[]
  }>({ rows: [], columns: [] })

  useEffect(() => {
    console.log(mapRef.current?.clientWidth, mapRef.current?.clientHeight)
    const mapWidth = mapRef.current?.clientWidth
    const mapHeight = mapRef.current?.clientHeight

    console.log(getGrid(mapWidth, mapHeight, 100))

    setGrid(getGrid(mapWidth, mapHeight, 100))
  }, [mapRef.current?.clientWidth, mapRef.current?.clientHeight])

  return (
    <div
      onMouseMove={trackMouse}
      onClick={(e) => {
        const mouseX = e.pageX
        const mouseY = e.pageY

        const circleStyle = {
          left: mouseX - CIRCLEWIDTH / 2 + 'px',
          top: mouseY - CIRCLEHEIGHT / 2 + 'px',
          width: CIRCLEWIDTH + 'px',
          height: CIRCLEHEIGHT + 'px',
          backgroundColor: 'pink',
          borderRadius: '50%',
        }

        const newCircle = (
          <div key={mouseX} className='circle' style={circleStyle} />
        )

        setCircles(isStartCircle ? [...circles, newCircle] : [newCircle])
        setIsStartCircle(!isStartCircle)
      }}
    >
      <div className='circle' style={cursorStyle} />
      {circles}
      {grid.rows}
      {grid.columns}
      <img
        ref={mapRef}
        className={'mu-map'}
        src={require('./imgs/mu-map.png')}
        alt='Mizzou Map'
      />
    </div>
  )
}

export default Map
