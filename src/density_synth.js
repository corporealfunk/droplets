import * as Tone from 'tone';
import Droplet from './droplet';
import makeNote from './make_note';
import { rangeFrom } from './value_utils';
import Events from './events';

class DensitySynth {
  // densityEnvelope is a ControlEnvelope defined in ms
  // pitchSet: array of hz
  // lengthRange: array of two ints, defining shortest, longest note in ms
  // polyphony: number of possible concurrent tones
  constructor({
    densityEnvelope,
    pitchSet,
    lengthRange,
    sustainRatioRange,
    polyphony = 4,
    gainRange,
    tickLength = 1000,
    modulatorRatio,
    modulatorWobbleRange,
    carrierWobbleRange,
    log = false,
    name = 'DensitySynth',
  }) {
    this.densityEnvelope = densityEnvelope;
    this.pitchSet = pitchSet;
    this.lengthRange = lengthRange;
    this.sustainRatioRange = sustainRatioRange;
    this.polyphony = polyphony;
    this.gainRange = gainRange;
    this.tickLength = tickLength;
    this.modulatorRatio = modulatorRatio;
    this.modulatorWobbleRange = modulatorWobbleRange;
    this.carrierWobbleRange = carrierWobbleRange;
    this.logFlag = log;
    this.name = name;
    this.slots = Array(polyphony);

    this.output = new Tone.Gain(1);

    for (let i = 0; i < polyphony; i += 1) {
      this.slots[i] = {
        tone: new Droplet(),
        lastNote: {},
      };
      this.slots[i].tone.output.connect(this.output);
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
      this.trigger('tick');
      this.decide();

      setTimeout(
        () => this.tick(),
        this.tickLength,
      );
    }
  }

  // returns ms
  get elapsedTime() {
    if (!this.startTime) {
      return null;
    }

    return Date.now() - this.startTime;
  }

  get playingCount() {
    let count = 0;
    this.slots.forEach((slot) => {
      if (slot.tone.playing) {
        count += 1;
      }
    });

    return count;
  }

  get playingOrScheduledCount() {
    let count = 0;
    this.slots.forEach((slot) => {
      if (slot.tone.scheduled || slot.tone.playing) {
        count += 1;
      }
    });

    return count;
  }

  get requestedDensity() {
    if (!this.elapsedTime) {
      return 0;
    }

    return this.densityEnvelope.sample(this.elapsedTime);
  }

  decide() {
    this.log('DensitySynth::decide()');
    const { requestedDensity } = this;

    // for each slot: if we schedule the next not NOW, will we meet
    // the requestedDensity within a reasonable margin?
    for (let i = 0; i < this.slots.length; i += 1) {
      const { tone, lastNote } = this.slots[i];
      this.log('    ::slot x of i', i, this.slots.length);

      if (tone.scheduled || tone.playing || requestedDensity === 0) {
        this.log('    ::   continue', i);
        continue; // eslint-disable-line no-continue
      }

      const genOptions = makeNote({
        length: this.lengthRange,
        attackRatio: 0.25,
        sustainRatio: this.sustainRatioRange,
        sustainAmplitude: { range: [0.2, 0.6], step: 0.1 },
        modIndexStart: 100,
        modIndexStop: 10,
        carrierFreq: this.pitchSet,
        panning: { range: [-1.0, 1.0], step: 0.1 },
        gain: this.gainRange,
        modulatorRatio: this.modulatorRatio,
        modulatorWobble: this.modulatorWobbleRange,
        carrierWobble: this.carrierWobbleRange,
      });

      genOptions.modulatorFreq = genOptions.carrierFreq * genOptions.modulatorRatio;

      const lastLength = lastNote.length; // might be null if never played before!
      const nextLength = genOptions.length; // might be null if never played before!

      this.log('            ::lastLength', lastLength);
      if (lastLength !== null && lastLength !== undefined) {
        const { msSinceStopped } = tone;

        this.log('            ::msSinceStopped', msSinceStopped);

        // if we play now the density will be:
        const density = (lastLength + nextLength) / (msSinceStopped + lastLength + nextLength);

        // if we are less then the requested density, then play the note:
        this.log('            ::density, requestedDensity', density, requestedDensity);
        if (density < requestedDensity) {
          this.log('            ::Play');
          this.slots[i].lastNote = genOptions;
          tone.setNote(genOptions).start();
          this.trigger('play', { slot: i, genOptions });
        }
      } else {
        const currentDensity = ((this.playingOrScheduledCount) / this.polyphony);
        this.log('            ::first note decide, slot, vertDensity, requestedDensity', currentDensity, requestedDensity);
        if (currentDensity < requestedDensity) {
          this.slots[i].lastNote = genOptions;
          const startOffset = (i === 0) ? 0 : genOptions.length / rangeFrom({
            range: [2, 5],
            step: 1,
          });

          tone.setNote(genOptions).start(startOffset);
          this.trigger('play', { slot: i, genOptions, startOffset });
          this.log('            ::Play First Note on slot, offset', i, startOffset);
        }
      }
    }
  }

  stats() {
    return {
      'Requested Density': this.requestedDensity,
    };
  }
}

Object.assign(DensitySynth.prototype, Events);

export default DensitySynth;
