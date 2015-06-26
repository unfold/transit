import React from 'react'
import xor from 'lodash/array/xor'
import isEqual from 'lodash/lang/isEqual'
import omit from 'lodash/object/omit'
import map from 'lodash/collection/map'
import all from 'lodash/collection/all'
import forEach from 'lodash/collection/forEach'
import Emitter from 'wildemitter'
import shallowEqual from 'React/lib/shallowEqual'

import Spring from '../src/spring'

const transitionEmitter = new Emitter()

// Transition component imports
import difference from 'lodash/array/difference'
import values from 'lodash/object/values'
import debounce from 'lodash/function/debounce'
import defer from 'lodash/function/defer'

class StateComponent extends React.Component {
  constructor(props, context) {
    super(props)

    this.update = context.update
  }

  componentWillReceiveProps(nextProps) {
    const propsWithoutChildren = omit(this.props, 'children')
    const nextPropsWithoutChildren = omit(nextProps, 'children')

    if(!shallowEqual(propsWithoutChildren, nextPropsWithoutChildren)) {
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

function createContainer(Component, getTarget, getEnterTarget, getLeaveTarget) {
  class ContainerComponent extends React.Component {
    constructor(props) {
      super(props)

      this.springs = {}

      this.state = {}

      this.checkLeaveStatus = this.checkLeaveStatus.bind(this)
    }

    checkLeaveStatus() {
      const resting = map(this.springs, spring => spring.resting)

      if(all(resting)) {
        this.props._leaveCallback()
      }
    }

    leave() {
      forEach(this.springs, (spring, key) => {
        const target = this.leaveTarget[key]

        if(target !== undefined) {
          spring.set(target)
        }

        spring.on('rest', this.checkLeaveStatus)
      })
    }

    cancelLeave() {
      forEach(this.springs, (spring, key) => {
        const target = this.target[key]

        if(target !== undefined) {
          spring.set(target)
        }

        spring.off('rest', this.checkLeaveStatus)
      })
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

    onSpringUpdate(key, value) {
      this.setState({
        [key]: value
      })
    }

    componentDidMount() {
      this.mounted = true
    }

    componentWillUnmount() {
      this.mounted = false
    }

    componentWillReceiveProps(nextProps) {
      const prevLeave = this.props._leaveCallback
      const leave = nextProps._leaveCallback

      if(leave !== prevLeave) {
        if(leave) {
          this.leave()
        } else {
          this.cancelLeave()
        }
      }
    }

    update() {
      if(this.props._leaveCallback) {
        return
      }

      const args = Array.prototype.slice.call(arguments)

      this.target = getTarget.apply(null, args)
      this.enterTarget = getEnterTarget.apply(null, args)
      this.leaveTarget = getLeaveTarget.apply(null, args)

      forEach(this.target, (value, key) => {
        let spring = this.springs[key]

        if(!spring) {
          const enterTarget = this.enterTarget[key]

          spring = this.springs[key] = new Spring()
          spring.on('update', this.onSpringUpdate.bind(this, key))

          if(enterTarget) {
            spring.position = enterTarget
          }
        }

        spring.set(value)
      })
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

class TransitionComponent extends React.Component {
  constructor(props) {
    super(props)

    this.children = {}
    this.entering = {}
    this.leaving = {}

    this.applyChildren(props.children)

    this.childLeaveFinished = debounce(this.childLeaveFinished, 1)
  }

  childLeaveCallback(key) {
    if(!!this.leaving[key]) {
      delete this.children[key]
      delete this.leaving[key]

      this.childLeaveFinished()
    }
  }

  childLeaveFinished() {
    this.forceUpdate()
  }

  childEnterCallback(key) {
    delete this.entering[key]
  }

  applyChildren(children) {
    const prevKeys = Object.keys(this.children)
    const nextKeys = children.map(child => child.key)

    const leaving = difference(prevKeys, nextKeys)

    React.Children.forEach(children, child => {
      this.children[child.key] = child
    })

    this.leaving = leaving
  }

  componentWillReceiveProps(nextProps) {
    if(this.shouldComponentUpdate(nextProps)) {
      this.applyChildren(nextProps.children || [])
    }
  }

  shouldComponentUpdate(nextProps) {
    const prev = (this.props.children || []).map(child => child.key)
    const next = (nextProps.children || []).map(child => child.key)

    return !!xor(prev, next).length
  }

  render() {
    const children = React.Children.map(values(this.children), child => {
      return React.cloneElement(child, {
        _leaveCallback: this.leaving[child.key] && this.childLeaveCallback.bind(this, child.key)
      })
    })

    return (
      <div>{children}</div>
    )
  }
}

export default {
  create: createContainer,
  Transition: TransitionComponent,
  State: StateComponent
}
