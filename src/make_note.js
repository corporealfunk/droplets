import {
  rangeFrom,
  chooseFrom,
} from './value_utils';

const makeNote = (noteParams) => {
  const fmGenParams = {};

  Object.keys(noteParams).forEach((key) => {
    const value = noteParams[key];
    let param = value;

    if (typeof value === 'object' && value !== null) {
      if (value.range) {
        param = rangeFrom(value);
      } else if (value.choose) {
        param = chooseFrom(value);
      } else {
        throw new Error('must be range or choose');
      }
    } else {
      param = value;
    }

    fmGenParams[key] = param;
  });

  // key "carrierFreq" is special, it might have an array of values.
  // if so, we're going to slide from first to last, else, just
  // use the the value
  if (Array.isArray(fmGenParams.carrierFreq)) {
    // eslint-disable-next-line prefer-destructuring
    fmGenParams.carrierFreqStart = fmGenParams.carrierFreq[0];
    fmGenParams.carrierFreqStop = fmGenParams.carrierFreq[fmGenParams.carrierFreq.length - 1];
  } else {
    fmGenParams.carrierFreqStart = fmGenParams.carrierFreq;
    fmGenParams.carrierFreqStop = fmGenParams.carrierFreq;
  }

  delete fmGenParams.carrierFreq;

  return fmGenParams;
};

export default makeNote;
