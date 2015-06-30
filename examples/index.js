import React from 'react'
import Transit from '../src'

import Item from './Item'
import Ball from './Ball'

class Application extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      show: true
    }
  }

  toggleShow() {
    this.setState({
      show: !this.state.show
    })
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
        <Ball />

        <h2>Transition</h2>
        <button onClick={this.toggleShow.bind(this)}>Toggle items</button>

        <Transit.Transition>
          {this.renderItems()}
        </Transit.Transition>
      </div>
    )
  }
}

window.addEventListener('load', e => {
  React.render(<Application />, document.body)
})
