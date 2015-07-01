import assign from 'lodash/object/assign'
import transform from 'lodash/object/transform'

function visitValue(value, transition) {
  return { value, transition }
}

function visitObject(object, parentTransition = {}, label) {
  const transition = object.transition
  const replaceTransition = transition && transition.type && transition.type !== parentTransition.type
  const nextTransition = replaceTransition ? transition : assign({}, parentTransition, transition)

  return transform(object, (result, value, key) => {
    if (key === 'value') {
      result[key] = value
      result.transition = nextTransition
    } else if (typeof value === 'number') {
      result[key] = visitValue(value, nextTransition)
    } else if (key !== 'transition')  {
      result[key] = visitObject(value, nextTransition, label ? label + '.' + key : key)
    }
  })
}

export default function normalizeTarget(target) {
  return visitObject(target)
}
