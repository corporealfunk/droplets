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

  return fmGenParams;
};

export default makeNote;
