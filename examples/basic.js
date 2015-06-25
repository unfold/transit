import React from 'react'
import Transit from '../main'
import times from 'lodash/utility/times'
import assign from 'lodash/object/assign'
import ReactTransitionGroup from 'react/lib/ReactTransitionGroup'

import Item from './Item'

class Application extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      show: false
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
