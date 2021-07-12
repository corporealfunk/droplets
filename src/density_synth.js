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

  decide() {
    this.log('DensitySynth::decide()');
    const requestedDensity = this.densityEnvelope.sample(this.elapsedTime);

    this.log('            ::playingCount, polyphony, requestedDensity, currentDensity', this.playingCount, this.polyphony, requestedDensity);
    /*
    // we are less then the requested density and we have polyphony available.
    // should we play? if we do play a tone what would the density become?
    const futureDensity = (this.playingCount + 1) / this.polyphony;

    // what multiple of the requeted density is this?
    const futureDensityMultiple = futureDensity / requestedDensity;

    // multiply by 100 and round up to get the chance that we should play:
    const playChancePercent = Math.ceil((1 / futureDensityMultiple) * 100);

    // roll the dice if we hit it, play the tone:
    if (Math.ceil(Math.random() * 100) <= playChancePercent) {
    this.playTone();
    }
    */

    // for each slot that is not playing, we need to schedule the next
    // note in such a way that from the beginning of the last note to the
    // end of the next note, we've been playing for the requested density as a %
    // over that time span, so we might need to schedule the next note far in the future,
    // or maybe right now
    for (let i = 0; i < this.slots.length; i += 1) {
      const tone = this.slots[i];
      this.log('            ::isScheduled, playing, requestedDensity', tone.scheduled, tone.playing, requestedDensity);

      if (tone.scheduled || tone.playing || requestedDensity === 0) {
        break;
      }

      // tone is not playing nor scheduled. Let's schedule a tone to meet our
      // requestedDensity:
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

      let scheduleIn = 0;

      const lastLength = tone.length; // might be null if never played before!
      const nextLength = genOptions.length; // might be null if never played before!

      if (lastLength !== null) {
        // to figure out in how many ms to schedule the tone:
        const { msSinceStopped } = tone;

        scheduleIn = (
          (lastLength + nextLength)
          - (requestedDensity * msSinceStopped)
          - (requestedDensity * lastLength)
          - (requestedDensity * nextLength)
        ) / requestedDensity;

        scheduleIn = scheduleIn > 0 ? scheduleIn : 0;

        console.log(
          't1, t2, (total sound), msSinceStopped, scheduleIn, (total silence), totalLength, density check, requestedDensity',
          lastLength,
          nextLength,
          lastLength + nextLength,
          msSinceStopped,
          scheduleIn,
          scheduleIn + msSinceStopped,
          lastLength + nextLength + msSinceStopped + scheduleIn,
          (lastLength + nextLength) / (lastLength + nextLength + msSinceStopped + scheduleIn),
          requestedDensity,
        );
      }

      scheduleIn = scheduleIn < 0 ? 0 : Math.ceil(scheduleIn);

      this.log(genOptions, scheduleIn);

      tone.setNote(genOptions).start(scheduleIn);
    }
  }
}
