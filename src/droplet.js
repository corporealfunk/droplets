import * as Tone from 'tone';
import FmGen from './fm_gen';
import Events from './events';
import {
  rangeFrom,
} from './value_utils';

class Droplet {
  constructor({
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
    this.mainTone = new FmGen({
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

    this.wobbleTone = new FmGen({
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

    this.output = new Tone.Gain(1);

    this.mainTone.output.connect(this.output);

    this.wobbleStartTime = rangeFrom({
      range: [
        0,
        lengthDelta / 2,
      ],
      step: 1,
    });

    this.wobbleTone.output.connect(this.output);

    this.mainTone.on('stop.droplet', () => this.dispose());
  }

  start() {
    this.mainTone.start();

    setTimeout(() => {
      this.wobbleTone.start();
    }, this.wobbleStartTime);

    return this.output;
  }

  dispose() {
    this.mainTone.off('stop.droplet');
    this.mainTone.dispose();
    this.wobbleTone.dispose();
    this.output.dispose();
    this.trigger('stop');
  }
}

Object.assign(Droplet.prototype, Events);

export default Droplet;
