import React from 'react'
import Transit from '../main'
import times from 'lodash/utility/times'
import assign from 'lodash/object/assign'

import Item from './Item'

class Application extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Transit.Transition>
        {times(5, i => <Item key={i} />)}
      </Transit.Transition>
    )
  }
}

window.addEventListener('load', e => {
  React.render(<Application />, document.body)
})
