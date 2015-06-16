import React from 'react'
import Transit from '../main'

class Item extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      active: false
    }
  }

  onClick() {
    this.setState({
      active: !this.state.active
    })
  }

  componentDidUpdate() {
    this.props.transit.update(this.state)
  }

  render() {
    const style = {
      background: '#ddd',
      width: 250,
      height: 50,
      transform: `translate(${this.props.transit.values.x}px, 0)`,
      marginBottom: 10
    }

    return <div style={style} onClick={this.onClick.bind(this)} />
  }
}

const TransitItem = Transit.createContainer(Item, (state) => {
  return {
    x: state.active ? 100 : 0
  }
})

class Application extends React.Component {
  render() {
    return (
      <div>
        <TransitItem />
        <TransitItem />
        <TransitItem />
        <TransitItem />
      </div>
    )
  }
}

window.addEventListener('load', e => {
  React.render(<Application />, document.body)
})
