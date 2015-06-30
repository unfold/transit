import Emitter from 'wildemitter'
import assign from 'lodash/object/assign'
import defaults from 'lodash/object/defaults'

export default class Spring extends Emitter {
  constructor(params) {
    super()

    this.params = defaults(params || {}, {
      stiffness: 0.9,
      friction: 0.3,
      mass: 10,
      restThreshold: 0.001
    })

    this.acceleration = 0
    this.position = 0
    this.target = 0
    this.velocity = 0

    this.step = this.step.bind(this)

    this.scheduleStep()
  }

  scheduleStep() {
    if(!this.shouldRest()) {
      this.resting = false
      requestAnimationFrame(this.step)
    } else {
      this.resting = true
      this.position = this.target
      this.emit('update', this.position)
      this.emit('rest')
    }
  }

  set(value) {
    this.target = value

    if(this.resting) {
      this.scheduleStep()
    }
  }

  step() {
    const params = this.params

    const now = new Date().getTime()
    const deltaTime = now - (this.time || now)

    const force = params.stiffness * (this.target - this.position)

    this.acceleration += ((force / params.mass) - this.acceleration) * (1-params.friction)

    this.velocity += this.acceleration

    this.velocity *= (1-params.friction)

    this.position += this.velocity

    this.time = now

    this.emit('update', this.position)

    this.scheduleStep()
  }

  shouldRest() {
    const threshold = this.params.restThreshold

    return Math.abs(this.velocity) < threshold
      && Math.abs(this.target - this.position) < threshold
  }
}
