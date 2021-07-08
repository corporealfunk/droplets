import * as Tone from 'tone';
import Droplet from './droplet';
import makeNote from './make_note';

export default class {
  // densityEnvelope is a ControlEnvelope defined in ms
  // pitchSet: array of hz
  // lengthRange: array of two ints, defining shortest, longest note in ms
  // polyphony: number of possible concurrent tones
  constructor({
    densityEnvelope,
    pitchSet,
    lengthRange,
    polyphony = 4,
    gainRange,
    tickLength = 1000,
    modulatorRatio,
    log = false,
  }) {
    this.densityEnvelope = densityEnvelope;
    this.pitchSet = pitchSet;
    this.lengthRange = lengthRange;
    this.polyphony = polyphony;
    this.gainRange = gainRange;
    this.tickLength = tickLength;
    this.modulatorRatio = modulatorRatio;
    this.logFlag = log;
    this.slots = Array(polyphony);

    this.output = new Tone.Gain(1);

    for (let i = 0; i < polyphony; i += 1) {
      this.slots[i] = new Droplet();
      this.slots[i].output.connect(this.output);
    }

    this.startTime = null;
  }

  log(...args) {
    if (this.logFlag) {
      console.log(...args);
    }
  }

  start() {
    this.log('DS::()');
    this.startTime = Date.now();
    this.tick();
    return this.output;
  }

  tick() {
    this.log('DS::tick()');

    if (this.elapsedTime < this.densityEnvelope.length) {
      this.decide();

      setTimeout(
        () => this.tick(),
        this.tickLength,
      );
    }
  }

  // returns ms
  get elapsedTime() {
    return Date.now() - this.startTime;
  }

  get playingCount() {
    let count = 0;
    this.slots.forEach((tone) => {
      if (tone.playing) {
        count += 1;
      }
    });

    return count;
  }

  get currentDensity() {
    return this.playingCount === 0 ? 0 : this.playingCount / this.polyphony;
  }

  // returns true if a tone is started, false if not
  decide() {
    this.log('DS::decide()');
    const requestedDensity = this.densityEnvelope.sample(this.elapsedTime);

    this.log('  playingCount, polyphony, requestedDensity, currentDensity', this.playingCount, this.polyphony, requestedDensity, this.currentDensity);

    if (this.playingCount < this.polyphony && this.currentDensity < requestedDensity) {
      this.playTone();
    }
  }

  playTone() {
    this.log('DS::playTone()');
    const genOptions = makeNote({
      length: this.lengthRange,
      attackRatio: 0.25,
      sustainRatio: 0.25,
      sustainAmplitude: { range: [0.2, 0.6], step: 0.1 },
      modIndexStart: 100,
      modIndexStop: 10,
      carrierFreq: this.pitchSet,
      panning: { range: [-1.0, 1.0], step: 0.1 },
      gain: this.gainRange,
      modulatorRatio: this.modulatorRatio,
    });

    genOptions.modulatorFreq = genOptions.carrierFreq * genOptions.modulatorRatio;

    const freeTone = this.getFreeTone();
    this.log(genOptions);
    freeTone.setNote(genOptions).start();
  }

  // returns index of inserted tone
  getFreeTone() {
    this.log('DensitySynth::getFreeTone()');
    let freeTone = null;

    for (let i = 0; i < this.slots.length; i += 1) {
      if (!this.slots[i].playing) {
        this.log('            :: slot', i);
        freeTone = this.slots[i];
        break;
      }
    }

    if (freeTone === null) {
      throw new Error('Cannot play tone, all slots playing');
    }

    return freeTone;
  }
}
