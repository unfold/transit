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

    console.log('Render')

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

export default Transit.create(Item, state => {
  return {
    width: state.hover ? 1000 : 200,
    opacity: 1
  }
}, state => {
  return {
    width: 0,
    opacity: 0
  }
}, state => {
  return {
    width: 0,
    opacity: 0
  }
})
