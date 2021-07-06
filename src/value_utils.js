const rangeFrom = ({ range, step }) => {
  let param;

  const [first, last] = range;
  const multiplier = 1 / step;

  param = Math.floor(Math.random() * ((last * multiplier) - (first * multiplier)));
  param *= step;
  param += first;
  return param;
};

const chooseFrom = ({ choose }) => choose[Math.floor(Math.random() * choose.length)];
export {
  rangeFrom,
  chooseFrom,
};
