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

const minimum = (value, minVal) => (value < minVal ? minVal : value);

const minsToMs = (minutes) => minutes * 60000;

const secondsToMs = (seconds) => seconds * 1000;

export {
  rangeFrom,
  chooseFrom,
  minimum,
  minsToMs,
  secondsToMs,
};
