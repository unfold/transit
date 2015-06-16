import React from 'react'
import ReactTransitionGroup from 'react/lib/ReactTransitionGroup'
import isEqual from 'lodash/lang/isEqual'

class StateComponent extends React.Component {
  constructor(props, context) {
    super(props)

    this.update = context.update
  }

  componentWillReceiveProps(nextProps) {
    this.context.update(nextProps)
  }

  componentDidMount() {
    this.context.update(this.props)
  }

  render() {
    return <div children={this.props.children} />
  }
}

StateComponent.contextTypes = {
  update: React.PropTypes.func.isRequired
}

class TransitionComponent extends React.Component {
  render() {
    return <ReactTransitionGroup children={this.props.children} />
  }
}

function createContainer(Component, getMorphTarget) {
  class ContainerComponent extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        morphTarget: {}
      }
    }

    getChildContext() {
      return {
        update: this.update.bind(this)
      }
    }

    update() {
      this.setState({
        morphTarget: getMorphTarget.apply(null, Array.prototype.slice.call(arguments))
      })
    }

    shouldComponentUpdate(nextProps, nextState) {
      return !isEqual(this.state.morphTarget, nextState.morphTarget)
    }

    render() {
      return <Component {...this.props} transit={this.state.morphTarget} />
    }
  }

  ContainerComponent.childContextTypes = {
    update: React.PropTypes.func.isRequired
  }

  return ContainerComponent
}

export default {
  create: createContainer,

  State: StateComponent,

  Transition: TransitionComponent,

  update: function(prevProps, prevState) {
    this.props._morphosis.update(prevProps, prevState, this.state)
  }
}
