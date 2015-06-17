import React from 'react'
import Transit from '../main'

class Item extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      active: true
    }
  }

  onClick() {
    this.setState({
      active: !this.state.active
    })
  }

  render() {
    const style = {
      background: this.state.active ? 'blue' : '#ddd',
      width: 250,
      height: 50,
      transform: `translate(${this.props.transit.x}px, 0)`,
      marginBottom: 10
    }

    return (
      <Transit.State active={this.state.active}>
        <div style={style} onClick={this.onClick.bind(this)} />
      </Transit.State>
    )
  }
}

const TransitItem = Transit.createContainer(Item, state => {
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
