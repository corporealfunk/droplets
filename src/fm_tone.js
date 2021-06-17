import * as Tone from 'tone';

const NORMALIZE = 1.701651585922511;

export default class {
  initialize({
    moudulatorFreq,   // integer
    carrierFreq,      // integer
    modulationIndex,  // integer
  }) {
    this.carrier = new Tone.Oscillator(carrierFreq, 'sine');

    // mod up and down by 100 hz
    const modMultiply = new Tone.Gain(NORMALIZE * modulationIndex);

    // Offset by carrier hz
    const modAdder = new Tone.Add(carrierFreq);

    // chain the swing and the offset
    this.modulator = new Tone.Oscillator(moudulatorFreq, 'sine').chain(modMultiply, modAdder);

    // the offset output is sent to the carrier
    modAdder.connect(this.carrier.frequency);
  }

  start() {
    this.modulator.start();
    this.carrier.start();
    return this.carrier;
  }
}
