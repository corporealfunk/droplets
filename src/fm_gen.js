import * as Tone from 'tone';
import FmTone from './fm_tone';

export default class {
  constructor({
    length,
    attackRatio,
    sustainRatio,
    releaseRatio,
    modIndexStart,
    modIndexStop,
    modulatorFreq,
    carrierFreq,
  }) {
    this.attackLength = length * attackRatio;
    this.sustainLength = length * sustainRatio;
    this.releaseLength = length * releaseRatio;

    this.length = length;
    this.modIndexStart = modIndexStart;
    this.modIndexStop = modIndexStop;

    this.carrierFreq = new Tone.Signal(carrierFreq);
    this.modulatorFreq = new Tone.Signal(modulatorFreq);
    this.amplitude = new Tone.Signal(0);
    this.modIndex = new Tone.Signal(modIndexStart);
  }

  start() {
    this.tone = new FmTone({
      modulatorFreq: this.modulatorFreq,
      carrierFreq: this.carrierFreq,
      modulationIndex: this.modIndex,
      amplitude: this.amplitude,
    });

    // schedule the ramps:
    const { currentTime } = Tone.context;
    this.amplitude.setValueAtTime(0, currentTime);
    this.amplitude.linearRampToValueAtTime(1, currentTime + this.attackLength);
    this.amplitude.linearRampToValueAtTime(
      0.4,
      currentTime + this.attackLength + this.sustainLength,
    );
    this.amplitude.linearRampToValueAtTime(0, currentTime + this.length);

    setTimeout(() => {
      this.dispose();
    }, (this.length * 1000) + 50);

    return this.tone.start();
  }

  dispose() {
    this.carrierFreq.dispose();
    this.modulatorFreq.dispose();
    this.amplitude.dispose();
    this.modIndex.dispose();
    this.tone.dispose();
  }
}
