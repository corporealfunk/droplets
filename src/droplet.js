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
    modulatorWobble,
    carrierFreqStart,
    carrierFreqStop,
    carrierWobble,
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
      carrierFreqStart,
      carrierFreqStop,
      panning,
      gain,
    });

    // Make the length shorter
    const entryPercent = rangeFrom({
      range: [
        0.10,
        0.40,
      ],
      step: 0.1,
    });

    this.wobbleStartTime = entryPercent * length;

    const wobbleLength = length - this.wobbleStartTime;

    this.wobbleTone.setNote({
      length: wobbleLength,
      attackRatio: rangeFrom({ range: [0.01, 0.05], step: 0.01 }),
      sustainRatio: 0.5,
      sustainAmplitude: rangeFrom({ range: [0.3, 0.6], step: 0.1 }),
      modIndexStart,
      modIndexStop: modIndexStart,
      modulatorFreq: modulatorFreq + modulatorWobble,
      carrierFreqStart: carrierFreqStart + carrierWobble,
      carrierFreqStop: carrierFreqStop + carrierWobble,
      panning,
      gain: rangeFrom({ range: [gain / 2, gain], step: 0.05 }),
    });

    return this;
  }

  // startTime is ms in the future that you want to start playing
  start(startTime = null) {
    this.mainTone.start(startTime);
    this.wobbleTone.start((startTime || 0) + this.wobbleStartTime);

    return this.output;
  }

  get playing() {
    return this.wobbleTone.playing || this.mainTone.playing;
  }

  get length() {
    return this.mainTone.length;
  }

  get scheduled() {
    return this.mainTone.scheduled || this.wobbleTone.scheduled;
  }

  get msSinceStopped() {
    // still playing, return 0
    if (this.playing) {
      return 0;
    }

    const mainElapsed = this.mainTone.msSinceStopped;
    const wobbleElapsed = this.wobbleTone.msSinceStopped;

    // one of them never started and then stopped
    if (mainElapsed === -1 || wobbleElapsed === -1) {
      return -1;
    }

    // return whichever has a shorter elapsed time
    return Math.min(mainElapsed, wobbleElapsed);
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
