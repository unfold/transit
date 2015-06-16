import React from 'react'
import ReactTransitionGroup from 'react/lib/ReactTransitionGroup'

class TransitionComponent extends React.Component {
  render() {
    return <ReactTransitionGroup children={this.props.children} />
  }
}

function createContainer(Component, getMorphTarget) {
  return class TransitContainerComponent extends React.Component {
    update() {
      const morphTarget = getMorphTarget.apply(null, Array.prototype.slice.call(arguments))
      let changed = false

      for(var key in morphTarget) {
        if(!this.state || this.state[key] !== morphTarget[key]) {
          changed = true
        }
      }

      console.log(changed)

      if(changed) {
        this.setState(morphTarget)
      }

      console.log(morphTarget)

      // this.setState(morphTarget)
    }

    render() {
      return <Component {...this.props} transit={{
        update: this.update.bind(this),
        values: this.state || {}
      }} />
    }
  }
}

export default {
  createContainer: createContainer,

  Transition: TransitionComponent,

  update: function(prevProps, prevState) {
    this.props._morphosis.update(prevProps, prevState, this.state)
  }
}
