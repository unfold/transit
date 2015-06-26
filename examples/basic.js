import React from 'react'
import Transit from '../main'
import times from 'lodash/utility/times'
import assign from 'lodash/object/assign'
import ReactTransitionGroup from 'react/lib/ReactTransitionGroup'
import Spring from '../src/spring'

import Item from './Item'

class Ball extends React.Component {
  render() {
    const style = {
      width: 50,
      height: 50,
      background: 'black',
      borderRadius: '50%',
      transform: `translateX(${this.props.position}px)`
    }

    return <div style={style} />
  }
}

class Application extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      show: false,
      ball: 0
    }
  }

  toggleShow() {
    this.setState({
      show: !this.state.show
    })
  }

  togglePosition() {
    this.spring.set(this.spring.target === 0 ? 200 : 0)
  }

  onSpringUpdate(position) {
    this.setState({
      position: position
    })
  }

  componentDidMount() {
    this.spring = new Spring({
      stiffness: 0.9,
      friction: 0.2,
      mass: 30
    })

    window.addEventListener('mousemove', e => {
      this.spring.set(e.clientX - 25)
    })

    this.spring.on('update', this.onSpringUpdate.bind(this))
  }

  renderItems() {
    return this.state.show && [
      <Item key="0" />,
      <Item key="1" />,
      <Item key="2" />,
      <Item key="3" />,
      <Item key="4" />
    ]
  }

  render() {
    return (
      <div>
        <h2>Spring</h2>
        <button onClick={this.togglePosition.bind(this)}>Toggle position</button>
        <Ball position={this.state.position} />

        <h2>Transition</h2>
        <button onClick={this.toggleShow.bind(this)}>Toggle items</button>
        <ReactTransitionGroup>
          {this.renderItems()}
        </ReactTransitionGroup>
      </div>
    )
  }
}

window.addEventListener('load', e => {
  React.render(<Application />, document.body)
})
