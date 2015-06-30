import React from 'react'
import omit from 'lodash/object/omit'
import shallowEqual from 'react/lib/shallowEqual'

export default class StateComponent extends React.Component {
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
