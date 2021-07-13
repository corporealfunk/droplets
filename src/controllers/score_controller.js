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
      this.outGain = new Tone.Gain(0.3).toDestination();
      e.preventDefault();
      score.start().connect(this.outGain);
      this.startTime = Date.now();
      this.setTimer();
    });
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
