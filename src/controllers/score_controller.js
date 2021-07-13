import { Controller } from 'stimulus';
import * as Tone from 'tone';
import score from '../score';

export default class extends Controller {
  static targets = ['start', 'synthList'];

  initialize() {
    Tone.start().then(() => {
      this.outGain = new Tone.Gain(0.3).toDestination();
      this.startTarget.classList.remove('pure-button-disabled');
    });
  }

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
    score.start().connect(this.outGain);
  }
}
