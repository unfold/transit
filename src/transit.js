import React from 'react'
import ReactTransitionGroup from 'react/lib/ReactTransitionGroup'
import xor from 'lodash/array/xor'
import isEqual from 'lodash/lang/isEqual'
import omit from 'lodash/object/omit'
import Animation from 'additive-animation'

class StateComponent extends React.Component {
  constructor(props, context) {
    super(props)

    this.update = context.update
  }

  componentWillReceiveProps(nextProps) {
    const propsWithoutChildren = omit(this.props, 'children')
    const nextPropsWithoutChildren = omit(nextProps, 'children')

    if(!isEqual(propsWithoutChildren, nextPropsWithoutChildren)) {
      this.context.update(nextProps)
    }
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

      this.animation = new Animation({
        onRender: this.onRender.bind(this)
      })

      this.morphTarget = {}

      this.state = {}
    }

    getChildContext() {
      return {
        update: this.update.bind(this)
      }
    }

    onRender(state) {
      this.setState(state)
    }

    update() {
      const prev = this.morphTarget
      const next = getMorphTarget.apply(null, Array.prototype.slice.call(arguments))
      const keyDiff = xor(Object.keys(prev), Object.keys(next))

      this.morphTarget = next

      if(!keyDiff.length) {
        this.animation.animate(prev, next, 200, 'easeOutExpo')
      } else {
        this.setState(next)
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      return !isEqual(this.state, nextState) || !isEqual(this.props, nextProps)
    }

    render() {
      return <Component {...this.props} transit={this.state} />
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

  Transition: TransitionComponent
}
