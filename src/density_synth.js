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

    for (let i = 0; i < polyphony; i += 1) {
      this.slots[i] = null;
    }

    this.startTime = null;
    this.output = new Tone.Gain(1);
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
      if (tone) {
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

    this.log(genOptions);

    const newTone = new Droplet(genOptions);

    this.slotTheTone(newTone);
    newTone.on('stop', () => this.toneStopped(newTone));

    newTone.start().connect(this.output);
  }

  // returns index of inserted tone
  slotTheTone(tone) {
    const availableI = this.slots.indexOf(null);

    if (availableI < 0) {
      throw new Error('Cannot insert tone, no availble slots');
    }

    this.slots[availableI] = tone;

    return availableI;
  }

  releaseSlot(i) {
    this.slots[i] = null;
  }

  // the tone is stopped:
  // - remove observers
  // - delete it
  // - delete from slots
  toneStopped(tone) {
    const i = this.slots.indexOf(tone);

    if (i < 0) {
      throw new Error('Cannot find stopped tone in slots');
    }

    tone.offAll();

    this.releaseSlot(i);
  }
}
