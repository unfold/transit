import React from 'react'
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

function createContainer(Component, getMorphTarget, getEnterState, getLeaveState) {
  class ContainerComponent extends React.Component {
    constructor(props) {
      super(props)

      this.animation = new Animation({
        onRender: this.onRender.bind(this)
      })

      this.morphTarget = null

      this.state = {}
    }

    getChildContext() {
      return {
        update: this.update.bind(this)
      }
    }

    onRender(state) {
      if(this.mounted) {
        this.setState(state)
      }
    }

    componentDidMount() {
      this.mounted = true
    }

    componentWillLeave(callback) {
      console.log('Leaving')

      setTimeout(callback, 1000)

      this.animation.animate(this.state, { width: 0 }, 1000, 'easeOutExpo')
    }

    componentDidLeave() {
      this.mounted = false
    }

    update() {
      const args = Array.prototype.slice.call(arguments)
      const prev = this.morphTarget || getEnterState.apply(null, args)
      const next = getMorphTarget.apply(null, args)
      const keyDiff = xor(Object.keys(prev), Object.keys(next))

      this.morphTarget = next

      if(!keyDiff.length) {
        this.animation.animate(prev, next, 1000, 'easeOutExpo')
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

  State: StateComponent
}
