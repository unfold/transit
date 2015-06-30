import React from 'react'
import xor from 'lodash/array/xor'
import difference from 'lodash/array/difference'
import debounce from 'lodash/function/debounce'
import values from 'lodash/object/values'

export default class TransitionComponent extends React.Component {
  constructor(props) {
    super(props)

    this.children = {}
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
        leaveCallback: this.leaving[child.key] && this.childLeaveCallback.bind(this, child.key)
      })
    })

    return (
      <div>{children}</div>
    )
  }
}
