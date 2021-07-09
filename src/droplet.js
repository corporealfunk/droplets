import * as Tone from 'tone';
import FmGen from './fm_gen';
import Events from './events';
import {
  rangeFrom,
} from './value_utils';

class Droplet {
  constructor() {
    this.mainTone = new FmGen();
    this.wobbleTone = new FmGen();

    this.output = new Tone.Gain(1);

    this.mainTone.output.connect(this.output);
    this.wobbleTone.output.connect(this.output);
  }

  setNote({
    length,
    attackRatio,
    sustainRatio,
    sustainAmplitude,
    modIndexStart,
    modIndexStop,
    modulatorFreq,
    carrierFreq,
    panning,
    gain,
  }) {
    this.mainTone.setNote({
      length,
      attackRatio,
      sustainRatio,
      sustainAmplitude,
      modIndexStart,
      modIndexStop,
      modulatorFreq,
      carrierFreq,
      panning,
      gain,
    });

    // Make the length shorter
    const shortenBy = rangeFrom({
      range: [
        0.20,
        0.80,
      ],
      step: 0.1,
    });

    const wobbleLength = length * shortenBy;
    const lengthDelta = length - wobbleLength;

    this.wobbleTone.setNote({
      length: wobbleLength,
      attackRatio: rangeFrom({ range: [0.01, 0.05], step: 0.01 }),
      sustainRatio: 0.25,
      sustainAmplitude: rangeFrom({ range: [0.3, 0.6], step: 0.1 }),
      modIndexStart,
      modIndexStop,
      modulatorFreq: modulatorFreq + rangeFrom({ range: [3, 6], step: 1 }),
      carrierFreq,
      panning,
      gain: rangeFrom({ range: [gain / 2, gain], step: 0.05 }),
    });

    this.wobbleStartTime = rangeFrom({
      range: [
        0,
        lengthDelta / 2,
      ],
      step: 1,
    });

    return this;
  }

  start() {
    this.mainTone.start();

    const { currentTime } = Tone.context;

    // time passed in is ms
    const getTimeAt = (time) => (time / 1000) + currentTime;

    this.wobbleTone.start(getTimeAt(this.wobbleStartTime));

    return this.output;
  }

  get playing() {
    return this.wobbleTone.playing || this.mainTone.playing;
  }

  stop(stopTime = null) {
    this.mainTone.stop(stopTime);
    this.wobbleTone.stop(stopTime);
  }

  dispose() {
    this.mainTone.dispose();
    this.wobbleTone.dispose();
    this.output.dispose();
  }
}

Object.assign(Droplet.prototype, Events);

export default Droplet;
