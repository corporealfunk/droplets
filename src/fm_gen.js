/* eslint-disable prefer-rest-params */

import * as Tone from 'tone';
import FmTone from './fm_tone';
import Events from './events';

import { minimum } from './value_utils';

class FmGen {
  constructor() {
    this.startedAt = null;
    this.stoppedAt = null;
    this.length = null;

    this.carrierFreq = new Tone.Signal(0);
    this.modulatorFreq = new Tone.Signal(0);
    this.amplitude = new Tone.Signal(0);
    this.modIndex = new Tone.Signal(0);
    this.gain = new Tone.Gain(0);
    this.panner = new Tone.Panner(0);

    this.tone = new FmTone({
      modulatorFreq: this.modulatorFreq,
      carrierFreq: this.carrierFreq,
      modulationIndex: this.modIndex,
      amplitude: this.amplitude,
    });

    this.tone.output.connect(this.gain);
    this.gain.connect(this.panner);

    this.output = this.panner;
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
    this.amplitude.value = 0;
    this.attackLength = length * attackRatio;

    this.attackLength = minimum(this.attackLength, 100);

    this.sustainLength = length * sustainRatio;
    this.sustainAmplitude = sustainAmplitude;

    this.length = length;
    this.modIndexStart = modIndexStart;
    this.modIndexStop = modIndexStop;

    this.carrierFreq.value = carrierFreq;
    this.modulatorFreq.value = modulatorFreq;
    this.modIndex.value = modIndexStart;
    this.gain.gain.value = gain;
    this.panner.pan.value = panning;

    return this;
  }

  // startTime is ms in the future that you want to start playing
  // null means "now"
  start(startTime = null) {
    const { currentTime } = Tone.context;

    // time passed in is ms
    const getTimeAt = (time) => {
      let absTime = (time / 1000) + currentTime;

      if (startTime !== null) {
        absTime += (startTime / 1000);
      }

      return absTime;
    };

    this.startedAt = getTimeAt(0);

    this.tone.start(getTimeAt(0));

    // schedule the amplitude envelope:
    this.amplitude.setValueAtTime(0, getTimeAt(0));

    this.amplitude.linearRampToValueAtTime(1, getTimeAt(this.attackLength));
    this.amplitude.linearRampToValueAtTime(
      this.sustainAmplitude,
      getTimeAt(this.attackLength + this.sustainLength),
    );
    this.amplitude.linearRampToValueAtTime(0, getTimeAt(this.length));

    // schedule the modIndex envelope:
    this.modIndex.setValueAtTime(this.modIndexStart, getTimeAt(0));
    this.modIndex.exponentialRampToValueAtTime(this.modIndexStop, getTimeAt(this.length));

    // schedule when to stop
    this.stop(getTimeAt(this.length));

    return this.output;
  }

  get scheduled() {
    if (this.startedAt === null) {
      return false;
    }

    return this.startedAt > Tone.context.currentTime;
  }

  get playing() {
    return this.tone.playing;
  }

  // how many ms have passed since we last stopped?
  get msSinceStopped() {
    if (this.playing) {
      return 0;
    }

    if (this.stoppedAt === 0) {
      return -1;
    }

    return (Tone.context.currentTime - this.stoppedAt) * 1000;
  }

  // stopTime is absolute clock time, or null for "now"
  stop(stopTime = null) {
    this.tone.stop(stopTime);
    this.stoppedAt = stopTime !== null ? stopTime : Tone.context.currentTime;
  }

  dispose() {
    this.carrierFreq.dispose();
    this.modulatorFreq.dispose();
    this.amplitude.dispose();
    this.modIndex.dispose();
    this.tone.dispose();
    this.panner.dispose();
    this.gain.dispose();
  }
}

Object.assign(FmGen.prototype, Events);

export default FmGen;
