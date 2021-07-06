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

  return fmGenParams;
};

export default makeNote;
