export default class {
  // timeData is a hash with keys of seconds ints,
  // values of the envelope value. time should start
  // at 0
  // { x1: y1, x2: y2 }
  constructor(envelope) {
    this.envelope = envelope;
    this.times = Object.keys(envelope).sort((a, b) => a - b).map((val) => parseInt(val, 10));
  }

  // sample the envelope at the given time (x)
  sample(time) {
    for (let i = 0; i < this.times.length; i += 1) {
      const lastTime = this.times[i];
      const lastValue = this.envelope[lastTime];

      if (time === lastTime) {
        return lastValue;
      }

      const nextTime = this.times[i + 1];

      if (nextTime === undefined || nextTime === null) {
        throw new Error('nextTime is not defined');
      }

      if (time > lastTime && time < nextTime) {
        const nextValue = this.envelope[nextTime];

        const valueDelta = nextValue - lastValue;
        const timeDelta = nextTime - lastTime;
        const sampleTimeDelta = time - lastTime;

        return ((sampleTimeDelta * valueDelta) / timeDelta) + lastValue;
      }
    }
    throw new Error('could not find a valid sample');
  }

  get length() {
    return this.times[this.times.length - 1];
  }
}
