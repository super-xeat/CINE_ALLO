import React from 'react';
import { Box, keyframes } from '@mui/material';
import { styled } from '@mui/system';

// Animations
const fall = keyframes`
  to { transform: translate3d(-30em, 0, 0); }
`;

const tailFade = keyframes`
  0%, 50% { width: var(--star-tail-length); opacity: 1; }
  70%, 80% { width: 0; opacity: 0.4; }
  100% { width: 0; opacity: 0; }
`;

const blink = keyframes`
  50% { opacity: 0.6; }
`;

const StarContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '120%',
  transform: 'rotate(-45deg)',
  zIndex: 0, // Derrière ton contenu
  pointerEvents: 'none',
});

const Star = styled('div')(({ delay, top, duration, length }) => ({
  '--star-tail-length': `${length}em`,
  '--star-tail-height': '2px',
  '--star-width': `calc(${length}em / 6)`,
  '--fall-duration': `${duration}s`,
  '--fall-delay': `${delay}s`,
  '--top-offset': `${top}vh`,
  
  position: 'absolute',
  top: 'var(--top-offset)',
  left: 0,
  width: 'var(--star-tail-length)',
  height: 'var(--star-tail-height)',
  color: '#fff',
  background: 'linear-gradient(45deg, currentColor, transparent)',
  borderRadius: '50%',
  filter: 'drop-shadow(0 0 6px currentColor)',
  transform: 'translate3d(104em, 0, 0)',
  animation: `
    ${fall} var(--fall-duration) var(--fall-delay) linear infinite, 
    ${tailFade} var(--fall-duration) var(--fall-delay) ease-out infinite
  `,
  '&::before, &::after': {
    position: 'absolute',
    content: '""',
    top: 0,
    left: 'calc(var(--star-width) / -2)',
    width: 'var(--star-width)',
    height: '100%',
    background: 'linear-gradient(45deg, transparent, currentColor, transparent)',
    borderRadius: 'inherit',
    animation: `${blink} 2s linear infinite`,
  },
  '&::before': { transform: 'rotate(45deg)' },
  '&::after': { transform: 'rotate(-45deg)' },
}));

const StarBackground = () => {
  const stars = Array.from({ length: 40 }); // Nombre d'étoiles

  return (
    <StarContainer>
      {stars.map((_, i) => (
        <Star
          key={i}
          // Paramètres ralentis : duration entre 15s et 25s
          top={Math.random() * 100}
          delay={Math.random() * 20}
          duration={Math.random() * 10 + 15}
          length={Math.random() * 3 + 4}
        />
      ))}
    </StarContainer>
  );
};

export default StarBackground;