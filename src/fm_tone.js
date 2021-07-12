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
    this.modOffset = new Tone.Add();
    carrierFreq.connect(this.modOffset.addend);

    // chain the swing and the offset
    this.modulator = new Tone.Oscillator();
    this.modulator.type = 'sine';
    modulatorFreq.connect(this.modulator.frequency);

    this.modIndexMult = new Tone.Multiply();
    modulationIndex.connect(this.modIndexMult.factor);

    this.normalizer = new Tone.Gain(NORMALIZE);
    this.modulator.chain(this.normalizer, this.modIndexMult, this.modOffset);

    // the offset output is sent to the carrier
    this.modOffset.connect(this.carrier.frequency);

    this.amplitudeGain = new Tone.Gain();
    amplitude.connect(this.amplitudeGain.gain);

    this.carrier.connect(this.amplitudeGain);
    this.output = this.amplitudeGain;
  }

  start(startTime = null) {
    this.modulator.start(startTime);
    this.carrier.start(startTime);

    return this.output;
  }

  // stopTime is absolute clock time
  stop(stopTime = null) {
    this.modulator.stop(stopTime);
    this.carrier.stop(stopTime);
  }

  get playing() {
    return this.modulator.state === 'started' || this.carrier.state === 'started';
  }

  dispose() {
    this.modOffset.dispose();
    this.modIndexMult.dispose();
    this.normalizer.dispose();
    this.amplitudeGain.dispose();
    this.modulator.dispose();
    this.carrier.dispose();
  }
}
