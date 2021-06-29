import * as Tone from 'tone';

const makeNote = (noteParams) => {
  const fmGenParams = {};

  Object.keys(noteParams).forEach((key) => {
    const value = noteParams[key];
    let param = value;

    if (typeof value === 'object' && value !== null) {
      if (value.range) {
        const [first, last] = value.range;
        const multiplier = 1 / value.step;

        param = Math.floor(Math.random() * ((last * multiplier) - (first * multiplier)));
        param *= value.step;
        param += first;
      } else if (value.choose) {
        param = value.choose[Math.floor(Math.random() * value.choose.length)];
      } else {
        throw new Error('must be range or choose');
      }
    } else {
      param = value;
    }

    fmGenParams[key] = param;
  });

  fmGenParams.modulatorFreq = fmGenParams.carrierFreq * (5 / 3);

  return fmGenParams;
};

const run = () => {
  // const { currentTime } = Tone.context;

  const lowLongNotes = [{
    length: { range: [30, 180], step: 10 },
    attackRatio: 0.25,
    sustainRatio: 0.25,
    sustainAmplitude: { range: [0.2, 0.6], step: 0.1 },
    modIndexStart: { range: [140, 200], step: 10 },
    modIndexStop: 10,
    carrierFreq: { choose: [Tone.Frequency('Bb3'), Tone.Frequency('C4'), Tone.Frequency('Eb4'), Tone.Frequency('F4')] },
    panning: { range: [-1.0, 1.0], step: 0.1 },
  }];

  return makeNote(lowLongNotes[0]);
};

export default run;
