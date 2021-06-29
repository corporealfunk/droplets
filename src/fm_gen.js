import * as Tone from 'tone';
import FmTone from './fm_tone';

export default class {
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
    this.attackLength = length * attackRatio;
    this.sustainLength = length * sustainRatio;
    this.sustainAmplitude = sustainAmplitude;

    this.length = length;
    this.modIndexStart = modIndexStart;
    this.modIndexStop = modIndexStop;

    this.carrierFreq = new Tone.Signal(carrierFreq);
    this.modulatorFreq = new Tone.Signal(modulatorFreq);
    this.amplitude = new Tone.Signal(0);
    this.modIndex = new Tone.Signal(modIndexStart);
    this.panner = new Tone.Panner(panning);
    this.output = this.panner;
    this.events = {};
  }

  start() {
    const { currentTime } = Tone.context;

    const getTimeAt = (time) => time + currentTime;

    this.tone = new FmTone({
      modulatorFreq: this.modulatorFreq,
      carrierFreq: this.carrierFreq,
      modulationIndex: this.modIndex,
      amplitude: this.amplitude,
    });

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
    this.modIndex.linearRampToValueAtTime(this.modIndexStop, getTimeAt(this.length));

    setTimeout(() => {
      this.dispose();
    }, (this.length * 1000));

    this.tone.start().connect(this.panner);
    return this.output;
  }

  dispose() {
    this.carrierFreq.dispose();
    this.modulatorFreq.dispose();
    this.amplitude.dispose();
    this.modIndex.dispose();
    this.tone.dispose();
    this.panner.dispose();
    this.trigger('stop');
  }

  // Event system
  on(eventName, cb) {
    const eventArray = this.events[eventName] || [];
    eventArray.push(cb);
    this.events[eventName] = eventArray;
  }

  // TODO: this clears all the listeners by that name, maybe not good
  off(eventName) {
    delete this.events[eventName];
  }

  offAll() {
    this.events = {};
  }

  trigger(eventName) {
    const eventArray = this.events[eventName] || [];

    eventArray.forEach((cb) => cb());
  }
}
