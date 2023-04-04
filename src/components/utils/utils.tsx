export const getGrid = (width: any, height: any, cellSize: any) => {
  let rows = []
  let columns = []

  for (let i = 0; i <= Math.floor(width / cellSize); i++) {
    const newRow = (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: '0px',
          top: cellSize * i + 'px',
          height: '0.1px',
          width: width + 'px',
          backgroundColor: 'black',
        }}
      />
    )

    rows.push(newRow)
  }

  for (let i = 0; i <= Math.floor(height / cellSize); i++) {
    const newColumn = (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: cellSize * i + 'px',
          top: '0px',
          height: height + 'px',
          width: '0.1px',
          backgroundColor: 'black',
        }}
      />
    )

    columns.push(newColumn)
  }

  return { rows: rows, columns: columns }
}

export const getPathDivs = (
  path: any,
  mapDimensions: any,
  cellSize: number,
  startCircleCoords?: { x: number; y: number },
  endCircleCoords?: { x: number; y: number }
) => {
  const newPathDivs = (
    <svg
      height={mapDimensions.height}
      width={mapDimensions.width}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <polyline
        points={
          (startCircleCoords
            ? `${startCircleCoords!.x},${startCircleCoords!.y} `
            : '') +
          path
            .map((item: any, i: number) => {
              if (i === 0) return ''
              return `${item.parent.x * cellSize + Math.floor(cellSize / 2)},${
                item.parent.y * cellSize + Math.floor(cellSize / 2)
              } `
            })
            .join('') +
          (endCircleCoords ? `${endCircleCoords!.x},${endCircleCoords!.y}` : '')
        }
        style={{
          fill: 'none',
          stroke: 'pink',
          strokeWidth: 5,
          borderRadius: '50%',
        }}
      />
    </svg>
  )

  return newPathDivs
}
