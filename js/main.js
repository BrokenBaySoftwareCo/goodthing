// The initial stream of scroll events
const scrollingContainer = document.getElementById('scrolling-container')
const scrollStream$ = Rx.Observable.fromEvent(scrollingContainer, 'scroll') // eslint-disable-line no-undef
// Hide the gridCells after the first two
const gridCells = document.getElementsByClassName('grid-image-div')
Array.prototype.forEach.call(gridCells, (gridCell, index) => {
  if (index > 1) {
    gridCell.classList.add('hide')
  }
})
const currentCell = { index: 0 }
console.log('currentCell.index', currentCell.index)
// The filtered stream of just completed
// scroll next events
const userScrolledNext$ = scrollStream$
  .map(e => e.target.scrollLeft)
  .pairwise()
  .filter(leftPositions => {
    return isScrollingNextward(
      leftPositions
    )
  })
  .filter(leftPositions => {
    return thisIsNotTheEnd(
      currentCell,
      gridCells
    )
  })
  .filter(leftPositions => {
    return isScrollNextComplete(
      currentCell,
      gridCells,
      leftPositions
    )
  })

/**
 Subscribe and apply effects
**/
userScrolledNext$.subscribe((leftPositions) => {
  scrollStream$
    .takeUntil(Rx.Observable.timer(1000)) // eslint-disable-line no-undef
    .map(e => e.target.scrollLeft)
    .subscribe(() => {
      scrollingContainer.scrollLeft = leftPositions[1]
    })

  setTimeout(
    () => {
      showNextFrame(currentCell, gridCells)
    },
    750
  )
})

function isScrollingNextward (
  leftPositions /* : Array<number> */
) {
  console.log('leftPositions[0]', leftPositions[0])
  console.log('leftPositions[1]', leftPositions[1])
  if (leftPositions[1] > leftPositions[0]) {
    console.log("You're moving nextward")
    return true
  }
  // return leftPosition >= window.innerWidth
  return false
}

function thisIsNotTheEnd (
  currentCell/* : number */,
  gridCells /* : Array<HTMLCollection> */
) {
  console.log('currentCell.index', currentCell.index)
  console.log('gridCells.length - 1', gridCells.length - 1)
  if (
    currentCell.index < gridCells.length - 1
  ) {
    console.log('This is not the end')
    return true
  }
  // return leftPosition >= window.innerWidth
  return false
}

function isScrollNextComplete (
  currentCell/* : number */,
  gridCells /* : Array<HTMLCollection> */,
  leftPositions
) {
  if (
    (
      currentCell.index === 0 &&
      leftPositions[1] >= document.body.offsetWidth - 1
    ) ||
    (
      currentCell.index > 0 &&
      leftPositions[1] >= 2 * document.body.offsetWidth - 1
    )
  ) {
    console.log('-----------------------------------------')
    console.log("You're at the front edge of the page")
    console.log('-----------------------------------------')
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
  ++currentCell.index
  hideGridCell(gridCells[currentCell.index - 2])
  showGridCell(gridCells[currentCell.index + 1])
  if (currentCell.index > 1) {
    scrollingContainer.scrollLeft = window.innerWidth
  }
}
