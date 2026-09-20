import type { Transition } from 'motion/react';

export const spring = {
  soft: {
    type: 'spring',
    stiffness: 400,
    damping: 32
  } as Transition,
  bouncy: {
    type: 'spring',
    stiffness: 500,
    damping: 18
  } as Transition,
  punchy: {
    type: 'spring',
    stiffness: 600,
    damping: 24
  } as Transition
};

export const shakeKeyframes = {
  x: [0, -8, 8, -6, 6, -3, 3, 0],
  transition: { duration: 0.4 }
};

export const bounceSuccessKeyframes = {
  scale: [1, 1.08, 0.95, 1.03, 1],
  transition: { duration: 0.4, ease: 'easeOut' }
};
