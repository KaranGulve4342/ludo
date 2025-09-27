import helmet from 'helmet';

export function security() {
  return helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });
}
