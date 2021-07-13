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
        '<li data-synth-target="slot">-</li>',
      );
    }

    this.printStats();

    this.synth.on('tick', this.printStats.bind(this));
    this.synth.on('play', this.printPlay.bind(this));
  }

  printStats() {
    if (!this.lastStatsPrint || Date.now() - this.lastStatsPrint > 10000) {
      const stats = this.synth.stats();
      let HTML = '';

      Object.keys(stats).forEach((key) => {
        HTML += `<tr>
          <td>${key}:</td>
          <td>${stats[key]}</td>
          </tr>
        `;
      });
      this.statsTarget.innerHTML = HTML;
      console.log(this.statsTarget.innerHTML);
      this.lastStatsPrint = Date.now();
    }
  }

  printPlay({ slot, genOptions }) {
    this.slotTargets[slot].innerHTML = `
      note: ${genOptions.carrierFreq.valueOf().toFixed(2)} for ${genOptions.length} ms
    `;

    setTimeout(
      () => this.printOff(slot),
      genOptions.length - 80,
    );
  }

  printOff(slot) {
    this.slotTargets[slot].innerHTML = '-';
  }
}
