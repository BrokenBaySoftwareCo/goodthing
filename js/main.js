// @flow
'use strict'

import config from '../dancing-robot/config.js'

// Force a page reload on layout change
Rx.Observable.fromEvent(window, 'resize') // eslint-disable-line no-undef
  .throttle(val => Rx.Observable.interval(10)) // eslint-disable-line no-undef
  .map(event => {
    return event.target.document.body.offsetWidth
  })
  .pairwise()
  .filter(vals => vals[0])
  .filter(vals => {
    console.log(vals[0], vals[1])
    console.log(config.breakPointWidth)
    if (
      (
        vals[0] >= config.breakPointWidth &&
        vals[1] <= config.breakPointWidth
      ) ||
      (
        vals[1] >= config.breakPointWidth &&
        vals[0] <= config.breakPointWidth
      )
    ) {
      return true
    }
    return false
  })
  .subscribe(vals => {
    document.location.reload()
  })

// The initial stream of scroll events
const scrollingContainer = document.getElementById('scrolling-container')
const scrollStream$ = Rx.Observable.fromEvent(scrollingContainer, 'scroll') // eslint-disable-line no-undef
const gridCells = document.getElementsByClassName('grid-image-div')
// Hide the gridCells after the first two
if (document.body.offsetWidth < config.breakPointWidth) {
  Array.prototype.forEach.call(gridCells, (gridCell, index) => {
    if (index > 1) {
      gridCell.classList.add('hidden')
    }
  })
}
// Keep track of the current cell. It's an object so
// that it can be passed by reference and hold state
const currentCell = { index: 0 }
console.log('currentCell.index', currentCell.index)
// The filtered stream of just completed
// scroll forward events
const userScrolledForward$ = scrollStream$
  .map(e => e.target.scrollLeft)
  .pairwise()
  .filter(leftPositions => {
    return isScrollingForward(
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
    return isScrollForwardComplete(
      currentCell,
      gridCells,
      leftPositions
    )
  })
// The filtered stream of just completed
// scroll previous events
const userScrolledBackward$ = scrollStream$
  .map(e => e.target.scrollLeft)
  .pairwise()
  .filter(leftPositions => {
    return isScrollingBackward(
      leftPositions
    )
  })
  .filter(leftPositions => {
    return thisIsNotTheBeginning(
      currentCell,
      gridCells
    )
  })
  .filter(leftPositions => {
    return isScrollBackwardComplete(
      currentCell,
      gridCells,
      leftPositions
    )
  })

/**
 Subscribe and apply effects
**/
userScrolledForward$.subscribe((leftPositions) => {
  // scrollStream$
  //   .takeUntil(Rx.Observable.timer(1000)) // eslint-disable-line no-undef
  //   .map(e => e.target.scrollLeft)
  //   .subscribe(() => {
  //     scrollingContainer.scrollLeft = leftPositions[1]
  //   })

  setTimeout(
    () => {
      showNextFrame(currentCell, gridCells)
    },
    1000
  )
})
/**
 Subscribe and apply effects
**/
userScrolledBackward$.subscribe((leftPositions) => {
  // scrollStream$
  //   .takeUntil(Rx.Observable.timer(1000)) // eslint-disable-line no-undef
  //   .map(e => e.target.scrollLeft)
  //   .subscribe(() => {
  //     scrollingContainer.scrollLeft = leftPositions[1]
  //   })

  setTimeout(
    () => {
      showPreviousFrame(currentCell, gridCells)
    },
    1000
  )
})

function isScrollingForward (
  leftPositions /* : Array<number> */
) {
  console.log('leftPositions[0]', leftPositions[0])
  console.log('leftPositions[1]', leftPositions[1])
  if (leftPositions[1] > leftPositions[0]) {
    console.log("You're moving forward")
    return true
  }
  // return leftPosition >= window.innerWidth
  return false
}

function isScrollingBackward (
  leftPositions /* : Array<number> */
) {
  console.log('leftPositions[0]', leftPositions[0])
  console.log('leftPositions[1]', leftPositions[1])
  if (leftPositions[1] < leftPositions[0]) {
    console.log("You're moving backward")
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

function thisIsNotTheBeginning (
  currentCell/* : number */,
  gridCells /* : Array<HTMLCollection> */
) {
  console.log('currentCell.index', currentCell.index)
  console.log('gridCells.length - 1', gridCells.length - 1)
  if (
    currentCell.index > 0
  ) {
    console.log('This is not the end')
    return true
  }
  // return leftPosition >= window.innerWidth
  return false
}

function isScrollForwardComplete (
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
    console.log('-------------------------------------')
    console.log("You're at the front edge of the page")
    console.log('-------------------------------------')
    return true
  }
  // return leftPosition >= window.innerWidth
  return false
}

function isScrollBackwardComplete (
  currentCell/* : number */,
  gridCells /* : Array<HTMLCollection> */,
  leftPositions
) {
  if (leftPositions[1] === 0) {
    console.log('-------------------------------------')
    console.log("You're at the back edge of the page")
    console.log('-------------------------------------')
    return true
  }
  // return leftPosition >= window.innerWidth
  return false
}

function hideGridCell (
  gridCell /* : HTMLElemtnt */
) {
  if (gridCell) {
    gridCell.classList.add('hidden')
  }
}

function showGridCell (
  gridCell /* : HTMLElemtnt */
) {
  if (gridCell) {
    gridCell.classList.remove('hidden')
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
    scrollingContainer.scrollLeft = document.body.offsetWidth
  }
}

function showPreviousFrame (
  currentCell/* : number */,
  gridCells /* : Array<HTMLCollection> */
) {
  --currentCell.index
  hideGridCell(gridCells[currentCell.index + 2])
  showGridCell(gridCells[currentCell.index - 1])
  if (currentCell.index > 0) {
    scrollingContainer.scrollLeft = document.body.offsetWidth
  }
}

const snapConfig = {
  scrollSnapDestination: '100vw 0', // *REQUIRED* scroll-snap-destination css property, as defined here: https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-destination
  scrollTimeout: 100, // *OPTIONAL* (default = 100) time in ms after which scrolling is considered finished
  scrollTime: 300 // *OPTIONAL* (default = 300) time in ms for the smooth snap
}

function callback () {
  console.log('called when snap animation ends')
}

const element = document.getElementById('scrolling-container')
