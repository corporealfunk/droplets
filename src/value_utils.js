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

const prettyPrintMs = (ms) => {
  const hours = Math.floor(ms / (3600000));
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.round((ms % 60000) / 1000);

  const pad = (number) => String(number).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const quarterTone = 1.00057778950655 ** 50;
const eighthTone = 1.00057778950655 ** 25;

export {
  rangeFrom,
  chooseFrom,
  minimum,
  minsToMs,
  secondsToMs,
  prettyPrintMs,
  quarterTone,
  eighthTone,
};
