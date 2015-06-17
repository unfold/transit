import React from 'react'
import Transit from '../main'
import assign from 'lodash/object/assign'

class Item extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hover: false
    }
  }

  onMouseEnter() {
    this.setState({
      hover: true
    })
  }

  onMouseLeave() {
    this.setState({
      hover: false
    })
  }

  render() {
    const style = assign({
      background: 'black',
      width: 250,
      height: 50,
      marginBottom: 10
    }, this.props.transit)

    return (
      <Transit.State hover={this.state.hover}>
        <div
          style={style}
          onClick={this.props.onClick}
          onMouseEnter={this.onMouseEnter.bind(this)}
          onMouseLeave={this.onMouseLeave.bind(this)}
        />
      </Transit.State>
    )
  }
}

// export default Transit.create(Item, state => {
//   opacity: state.active ? 1 : 0.2,
//   height: state.active ? 200 : 50
// }, {
//   enter: state => {
//     opacity: 0
//   },
//
//   leave: state => {
//
//   }
// })

export default Transit.create(Item, state => {
  return {
    opacity: state.hover ? 1 : 0.2,
    width: state.hover ? 250 : 200
  }
})
