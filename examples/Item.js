import React from 'react'
import Transit from '../main'
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

    let background = 'black'

    if(rotateY > 90) {
      background = 'salmon'
    }

    const style = assign({
      background: background,
      width: 100,
      height: 100,
      margin: 20,
      transform: `rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${scale})`
    })

    return (
      <Transit.State hover={this.state.hover} active={this.state.active} down={this.state.down}>
        <div style={{ perspective: 400, float: 'left' }}>
          <div
            style={style}
            onClick={this.onClick.bind(this)}
            onMouseDown={this.onMouseDown.bind(this)}
            onMouseUp={this.onMouseUp.bind(this)}
            onMouseEnter={this.onMouseEnter.bind(this)}
            onMouseLeave={this.onMouseLeave.bind(this)}
          />
        </div>
      </Transit.State>
    )
  }
}

export default Transit.create(Item, state => {
  return {
    rotateZ: 0,
    rotateY: state.active ? 180 : 0,
    scale: state.down ? 1 : state.hover ? 1.2 : 1
  }
}, state => {
  return {
    rotateZ: 360,
    scale: 0
  }
}, state => {
  return {
    rotateZ: 0,
    scale: 0
  }
})
