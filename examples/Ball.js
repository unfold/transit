import React from 'react'

import Transit from '../main'

export default class Ball extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      x: 0
    }
  }

  componentDidMount() {
    window.addEventListener('mousemove', e => this.setState({
      x: e.clientX
    }))
  }

  render() {
    const style = {
      width: 50,
      height: 50,
      background: 'black',
      borderRadius: '50%',
      transform: `translateX(${this.props.transit.x}px)`
    }

    return (
      <Transit.State x={this.state.x}>
        <div style={style} />
      </Transit.State>
    )
  }
}

export default Transit.create(Ball, state => {
  return {
    x: state.x - 35
  }
}, state => {
  return {}
}, state => {
  return {}
})
