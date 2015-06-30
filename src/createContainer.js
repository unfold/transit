import React from 'react'
import all from 'lodash/collection/all'
import map from 'lodash/collection/map'
import forEach from 'lodash/collection/forEach'
import shallowEqual from 'React/lib/shallowEqual'

import Spring from './dynamics/Spring'

export default function createContainer(Component, getTarget, getEnterTarget, getLeaveTarget) {
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
        this.props.leaveCallback()
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
