// The initial stream of scroll events
const scrollingContainer = document.getElementById('scrolling-container')
const scrollStream$ = Rx.Observable.fromEvent(scrollingContainer, 'scroll') // eslint-disable-line
// Hide the gridCells after the first two
const gridCells = document.getElementsByClassName('grid-image-div')
Array.prototype.forEach.call(gridCells, (gridCell, index) => {
  if (index > 1) {
    gridCell.classList.add('hide')
  }
})
// An array for keeping track of the
// visible cells
const currentCell = { index: 0 }
console.log('currentCell.index', currentCell.index)
// The filtered stream of just completed
// scroll next events
const userScrolledNext$ = scrollStream$
  .map(e => e.target.scrollLeft)
  .pairwise()
  .filter(leftPositions => {
    return isScrollNextComplete(leftPositions[0])
  })
// The filtered stream of just completed
// scroll previous events
const userScrolledPrevious$ = scrollStream$
  .map(e => e.target.scrollLeft)
  .pairwise()
  .filter(leftPositions => {
    return isScrollPreviousComplete(leftPositions[0])
  })
/**
 Subscribe and apply effects
**/
userScrolledNext$.subscribe(() => { showNextFrame(currentCell, gridCells) })
userScrolledPrevious$.subscribe(() => { showPreviousFrame(currentCell, gridCells) })

const isScrollPreviousComplete = (leftPosition) => {
  if (leftPosition <= 2) {
    // console.log('document.body.offsetWidth - 2', document.body.offsetWidth - 2)
    // console.log('leftPosition', leftPosition)
    console.log("you're at the back edge of the page")
    return true
  }
  // return leftPosition >= window.innerWidth
  return false
}
const isScrollNextComplete = (leftPosition) => {
  if (leftPosition >= document.body.offsetWidth - 2) {
    // console.log('document.body.offsetWidth - 2', document.body.offsetWidth - 2)
    // console.log('leftPosition', leftPosition)
    console.log("you're at the front edge of the page")
    return true
  }
  // return leftPosition >= window.innerWidth
  return false
}

function hideGridCell (
  gridCell /* : HTMLElemtnt */
) {
  if (gridCell) {
    gridCell.classList.add('hide')
  }
}

function showGridCell (
  gridCell /* : HTMLElemtnt */
) {
  if (gridCell) {
    gridCell.classList.remove('hide')
  }
}

function showNextFrame (
  currentCell/* : number */,
  gridCells /* : Array<HTMLCollection> */
) {
  if (currentCell.index < gridCells.length - 1) {
    ++currentCell.index
    console.log('currentCellIndex', currentCell.index)
    hideGridCell(gridCells[currentCell.index - 2])
    showGridCell(gridCells[currentCell.index + 1])
    // scrollingContainer.scrollLeft = scrollingContainer.scrollLeft - window.innerWidth
  }
}

function showPreviousFrame (
  currentCell/* : number */,
  gridCells /* : Array<HTMLCollection> */
) {
  console.log('currentCellIndex', currentCell.index)
  if (currentCell.index) {
    --currentCell.index
    console.log('currentCell.index is now ', currentCell.index)
    showGridCell(gridCells[currentCell.index - 1])
    hideGridCell(gridCells[currentCell.index + 2])
    // scrollingContainer.scrollLeft = scrollingContainer.scrollLeft + window.innerWidth
  }
}
