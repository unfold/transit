import React from 'react'
import Transit from '../src'
import assign from 'lodash/object/assign'

class Item extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hover: false,
      active: false,
      down: false
    }
  }

  onMouseEnter() {
    this.setState({
      hover: true
    })
  }

  onMouseLeave() {
    this.setState({
      hover: false,
      down: false
    })
  }

  onMouseDown() {
    this.setState({
      down: true
    })
  }

  onMouseUp() {
    this.setState({
      down: false
    })
  }

  onClick() {
    this.setState({
      active: !this.state.active
    })
  }

  render() {
    const {rotateZ, rotateY, scale} = this.props.transit
    const {hover, active, down} = this.state
    const flipside = rotateY > 90

    let background = 'black'
    let color = 'white'

    if(flipside) {
      background = 'salmon'
      color = 'black'
    }

    const style = assign({
      background: background,
      width: 100,
      height: 100,
      margin: 20,
      color: color,
      transform: `rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${scale})`
    })

    return (
      <Transit.State hover={hover} active={active} down={down}>
        <div style={{ perspective: 400, float: 'left' }}>
          <div
            style={style}
            onClick={this.onClick.bind(this)}
            onMouseDown={this.onMouseDown.bind(this)}
            onMouseUp={this.onMouseUp.bind(this)}
            onMouseEnter={this.onMouseEnter.bind(this)}
            onMouseLeave={this.onMouseLeave.bind(this)}
          >

            <div className="label" style={{
              transform: `rotateY(${flipside ? -180 : 0}deg)`
            }}>{flipside ? 'Transit' : 'Hello'}</div>
          </div>
        </div>
      </Transit.State>
    )
  }
}

const transition = {
  type: 'spring'
}

export default Transit.create(Item, props => {
  return {
    state: {
      rotateZ: {
        transition: transition,
        value: 0
      },
      rotateY: {
        transition: transition,
        value: props.active ? 180 : 0
      },
      scale: {
        transition: transition,
        value: props.down ? 1 : !props.down && props.hover ? 1.2 : 1
      }
    },

    enter: {
      rotateZ: {
        transition: transition,
        value: 360
      },
      scale: {
        transition: transition,
        value: 0
      }
    },

    leave: {
      rotateZ: {
        transition: transition,
        value: 0
      },
      scale: {
        transition: transition,
        value: 0
      }
    }
  }
})

// export default Transit.create(Item, props => {
//   return {
//     state: {
//       rotateZ: 0,
//       rotateY: props.active ? 180 : 0,
//       scale: props.down ? 1 : !props.down && props.hover ? 1.2 : 1
//     },
//
//     enter: {
//       rotateZ: 360,
//       scale: 0
//     },
//
//     leave: {
//       rotateZ: 0,
//       scale: 0
//     }
//   }
// })
