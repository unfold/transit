import React from 'react'
import all from 'lodash/collection/all'
import map from 'lodash/collection/map'
import forEach from 'lodash/collection/forEach'
import shallowEqual from 'react/lib/shallowEqual'

import Spring from './dynamics/Spring'

export default function createContainer(Component, getTarget) {
  class ContainerComponent extends React.Component {
    constructor(props) {
      super(props)

      this.state = {}
      this.target = {}

      // TODO: Should be general (e.g. this.transitions)
      this.springs = {}

      this.checkLeaveStatus = this.checkLeaveStatus.bind(this)
    }

    checkLeaveStatus() {
      const resting = map(this.springs, spring => spring.resting)

      if(all(resting)) {
        this.props.leaveCallback()
      }
    }

    leave() {
      forEach(this.springs, (spring, key) => {
        const target = this.target.leave && this.target.leave[key]

        if(target !== undefined) {
          spring.set(target)
        }

        spring.on('rest', this.checkLeaveStatus)
      })
    }

    cancelLeave() {
      forEach(this.springs, (spring, key) => {
        const target = this.target.state[key]

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

    update() {
      if(this.props.leaveCallback) {
        return
      }

      const args = Array.prototype.slice.call(arguments)

      this.target = getTarget.apply(null, args)

      forEach(this.target.state, (value, key) => {
        let spring = this.springs[key]

        if(!spring) {
          const enterTarget = this.target.enter && this.target.enter[key]

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
