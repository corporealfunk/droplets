import { Controller } from 'stimulus';
import * as Tone from 'tone';
import score from '../score';
import { prettyPrintMs } from '../value_utils';

export default class extends Controller {
  static targets = ['start', 'synthList', 'timer'];

  connect() {
    score.synths.forEach((synth, i) => {
      this.synthListTarget.insertAdjacentHTML(
        'beforeend',
        `<div data-controller='synth' data-synth-index-value='${i}'>
          <h5>${synth.name}</h5>
          <table data-synth-target='stats'>
          </table>
          <ol data-synth-target='slotList'></ol>
        </div>`,
      );
    });
  }

  start(e) {
    e.preventDefault();
    e.currentTarget.classList.add('pure-button-disabled');

    Tone.start().then(() => {
      const reverb = new Tone.Reverb({
        decay: 5,
        preDelay: 0.1,
        wet: 0.5,
      }).toDestination();
      const outGain = new Tone.Gain(0.5);
      outGain.connect(reverb);
      e.preventDefault();
      score.start().connect(outGain);
      this.startTime = Date.now();
      this.setTimer();
    });
  }

  subtract(e) {
    e.preventDefault();

    this.changeElapsedTime(-1);
  }

  add(e) {
    e.preventDefault();
    this.changeElapsedTime(1);
  }

  changeElapsedTime(mins) {
    score.synths.forEach((synth) => synth.jumpTime(mins * 60000));
    this.startTime += mins * -60000;
  }

  get elapsedTime() {
    return Date.now() - this.startTime;
  }

  setTimer() {
    setTimeout(
      this.printTimer.bind(this),
      1000,
    );
  }

  printTimer() {
    this.timerTarget.innerHTML = prettyPrintMs(this.elapsedTime);
    this.setTimer();
  }
}
