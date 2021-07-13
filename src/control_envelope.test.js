import Envelope from './control_envelope.js';

test('samples the time correctly', () => {
  const env = new Envelope({
    0: 0,
    10: 10,
    15: 11,
  });

  expect(env.sample(0)).toBe(0);
  expect(env.sample(5)).toBe(5);
  expect(env.sample(11)).toBe(10.2);
  expect(env.sample(12)).toBe(10.4);
  expect(env.sample(15)).toBe(11);

  const t = () => {
    env.sample(15.1);
  }
  expect(t).toThrow('nextTime is not defined');
});

test('gets the envelope length', () => {
  const env = new Envelope({
    0: 0,
    10: 10,
    15: 11,
  });

  expect(env.length).toBe(15);
});

describe('can use strings as keys', () => {
  test('samples the time correctly', () => {
    const env = new Envelope({
      '0': 0,
      '10': 10,
      '15': 11,
    });

    expect(env.sample(0)).toBe(0);
    expect(env.sample(5)).toBe(5);
    expect(env.sample(11)).toBe(10.2);
    expect(env.sample(12)).toBe(10.4);
    expect(env.sample(15)).toBe(11);

    const t = () => {
      env.sample(15.1);
    }
    expect(t).toThrow('nextTime is not defined');
  });
});
