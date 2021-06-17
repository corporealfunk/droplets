import * as Tone from 'tone';

const NORMALIZE = 1.701651585922511;

export default class {
  constructor({
    // signal
    modulatorFreq,
    // signal
    carrierFreq,
    // signal
    modulationIndex,
    // amplitude
    amplitude,
  }) {
    this.carrier = new Tone.Oscillator(0, 'sine');

    // mod up and down by 100 hz
    // Offset by carrier hz
    const modOffset = new Tone.Add();
    carrierFreq.connect(modOffset.addend);

    // chain the swing and the offset
    this.modulator = new Tone.Oscillator();
    this.modulator.type = 'sine';
    modulatorFreq.connect(this.modulator.frequency);

    const modIndexMult = new Tone.Multiply();
    modulationIndex.connect(modIndexMult.factor);

    const normalizer = new Tone.Gain(NORMALIZE);
    this.modulator.chain(normalizer, modIndexMult, modOffset);

    // the offset output is sent to the carrier
    modOffset.connect(this.carrier.frequency);

    this.amplitudeGain = new Tone.Gain();
    amplitude.connect(this.amplitudeGain.gain);
  }

  start() {
    this.modulator.start();
    this.carrier.connect(this.amplitudeGain).start();
    return this.amplitudeGain;
  }
}
