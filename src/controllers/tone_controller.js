import { Controller } from 'stimulus';
import * as Tone from 'tone';
import FmGen from '../fm_gen';

export default class extends Controller {
  static targets = [
    'carrierHz',
    'modulatorHz',
    'modulatorIndexStart',
    'modulatorIndexStop',
    'length',
    'attackRatio',
    'sustainRatio',
    'sustainAmplitude',
    'gain',
    'pan',
  ];

  get carrierHz() {
    return parseInt(this.carrierHzTarget.value, 10);
  }

  get modulatorHz() {
    return parseInt(this.modulatorHzTarget.value, 10);
  }

  get modulatorIndexStart() {
    return parseInt(this.modulatorIndexStartTarget.value, 10);
  }

  get modulatorIndexStop() {
    return parseInt(this.modulatorIndexStopTarget.value, 10);
  }

  get length() {
    return parseInt(this.lengthTarget.value, 10);
  }

  get attackRatio() {
    return parseFloat(this.attackRatioTarget.value);
  }

  get sustainRatio() {
    return parseFloat(this.sustainRatioTarget.value);
  }

  get sustainAmplitude() {
    return parseFloat(this.sustainAmplitudeTarget.value);
  }

  get gain() {
    return parseInt(this.gainTarget.value, 10) / 100;
  }

  get pan() {
    return parseInt(this.panTarget.value, 10) / 10;
  }

  start(e) {
    e.preventDefault();
    Tone.start().then(() => {
      const genOptions = {
        length: this.length,
        attackRatio: this.attackRatio,
        sustainRatio: this.sustainRatio,
        sustainAmplitude: this.sustainAmplitude,
        modIndexStart: this.modulatorIndexStart,
        modIndexStop: this.modulatorIndexStop,
        modulatorFreq: this.modulatorHz,
        carrierFreq: this.carrierHz,
        panning: this.pan,
      };

      const outGain = new Tone.Gain(this.gain).toDestination();

      const newTone = new FmGen(genOptions);

      newTone.start().connect(outGain);
    });
  }

  add(e) {
    e.preventDefault();

    const inputTarget = e.currentTarget.dataset.target;
    const newValue = this[inputTarget] + 1;
    this[`${inputTarget}Target`].value = newValue;
  }

  subtract(e) {
    e.preventDefault();

    const inputTarget = e.currentTarget.dataset.target;
    const newValue = this[inputTarget] - 1;
    this[`${inputTarget}Target`].value = newValue;
  }

  multiply(e) {
    e.preventDefault();

    const {
      target,
      sourceTarget,
      numerator,
      denominator,
    } = e.currentTarget.dataset;

    const sourceValue = this[sourceTarget];
    const newValue = (sourceValue * parseInt(numerator, 10)) / parseInt(denominator, 10);
    this[`${target}Target`].value = newValue;
  }
}
