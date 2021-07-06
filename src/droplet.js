import FmGen from './fm_gen';
import Events from './events';

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
    });

    this.output = this.mainTone.output;
    this.mainTone.on('stop', () => this.trigger('stop'));
  }

  start() {
    return this.mainTone.start();
  }

  dispose() {
    this.mainTone.dispose();
    this.trigger('stop');
  }
}

Object.assign(Droplet.prototype, Events);

export default Droplet;
