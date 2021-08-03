import { Controller } from 'stimulus';
import scores from '../score';

export default class extends Controller {
  static values = {
    scoreIndex: Number,
    synthIndex: Number,
  };

  get score() {
    return scores[this.scoreIndexValue];
  }

  get synth() {
    return this.score.synths[this.synthIndexValue];
  }

  static targets = [
    'slotList',
    'slot',
    'stats',
  ];

  connect() {
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
      this.lastStatsPrint = Date.now();
    }
  }

  printPlay({ slot, genOptions, startOffset = 0 }) {
    if (startOffset === 0) {
      this.slotTargets[slot].innerHTML = `
      note: ${genOptions.carrierFreqStart.valueOf().toFixed(2)} for ${genOptions.length} ms
      `;

      setTimeout(
        () => this.printOff(slot),
        genOptions.length - 50,
      );
    } else {
      setTimeout(
        () => this.printPlay({ slot, genOptions }),
        startOffset,
      );
    }
  }

  printOff(slot) {
    this.slotTargets[slot].innerHTML = '-';
  }
}
