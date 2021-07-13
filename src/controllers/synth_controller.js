import { Controller } from 'stimulus';
import score from '../score';

export default class extends Controller {
  static values = {
    index: Number,
  };

  static targets = [
    'slotList',
    'slot',
    'stats',
  ];

  connect() {
    this.synth = score.synths[this.indexValue];
    for (let i = 0; i < this.synth.polyphony; i += 1) {
      this.slotListTarget.insertAdjacentHTML(
        'beforeend',
        `<li data-synth-target='slot'>-</li>`,
      );
    }

    this.printStats();

    this.synth.on('tick', this.printStats.bind(this));
    this.synth.on('play', this.printPlay.bind(this));
  }

  printStats() {
    this.statsTarget.innerHTML = '';
    const stats = this.synth.stats();

    Object.keys(stats).forEach((key) => {
      this.statsTarget.insertAdjacentHTML(
        'beforeend',
        `<tr>
          <td>${key}:</td>
          <td>${stats[key]}</td>
         </tr>
        `,
      );
    });
  }

  printPlay({ slot, genOptions }) {
    this.statsTarget.innerHTML = '';
    const stats = this.synth.stats();

    this.slotTargets[slot].innerHTML = `
      note: ${genOptions.carrierFreq.valueOf().toFixed(2)} for ${genOptions.length} ms
    `;
  }
}
