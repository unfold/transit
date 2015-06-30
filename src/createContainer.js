import React from 'react'
import all from 'lodash/collection/all'
import map from 'lodash/collection/map'
import forEach from 'lodash/collection/forEach'
import shallowEqual from 'react/lib/shallowEqual'

import * as transitionTypes from './transitions'

export default function createContainer(Component, getTarget) {
  class ContainerComponent extends React.Component {
    constructor(props) {
      super(props)

      this.state = {}
      this.target = {}

      // TODO: Should be general (e.g. this.transitions)
      this.transitions = {}

      this.checkLeaveStatus = this.checkLeaveStatus.bind(this)
    }

    isLeaving() {
      return !!this.props.leaveCallback
    }

    checkLeaveStatus() {
      const resting = map(this.transitions, transition => transition.resting)

      if(all(resting)) {
        this.props.leaveCallback()
      }
    }

    leave() {
      forEach(this.transitions, (transition, key) => {
        const target = this.target.leave && this.target.leave[key]

        if(target !== undefined) {
          transition.set(target.value)
        }

        transition.on('rest', this.checkLeaveStatus)
      })
    }

    cancelLeave() {
      forEach(this.transitions, (transition, key) => {
        const target = this.target.state && this.target.state[key]

        if(target !== undefined) {
          transition.set(target.value)
        }

        transition.off('rest', this.checkLeaveStatus)
      })
    }

    getChildContext() {
      return {
        update: this.update.bind(this)
      }
    }

    onRender(state) {
      this.setState(state)
    }

    onTransitionUpdate(key, value) {
      this.setState({
        [key]: value
      })
    }

    componentWillReceiveProps(nextProps) {
      const prevLeave = this.props.leaveCallback
      const leave = nextProps.leaveCallback

      if(leave !== prevLeave) {
        if(leave) {
          this.leave()
        } else {
          this.cancelLeave()
        }
      }
    }

    update(...args) {
      if(this.isLeaving()) {
        return
      }

      this.target = getTarget.call(null, ...args)

      forEach(this.target.state, (params, key) => {
        let transition = this.transitions[key]

        if(!transition) {
          const enterTarget = this.target.enter && this.target.enter[key]
          const TransitionType = transitionTypes[params.transition.type]

          transition = new TransitionType()
          transition.on('update', this.onTransitionUpdate.bind(this, key))

          if(enterTarget) {
            transition.position = enterTarget.value
          }

          this.transitions[key] = transition
        }

        transition.set(params.value)
      })
    }

    shouldComponentUpdate(nextProps, nextState) {
      return !shallowEqual(this.state, nextState) || !shallowEqual(this.props, nextProps)
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
