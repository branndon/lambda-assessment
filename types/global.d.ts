// Extend JSX to accept the HTML `inert` attribute (not yet in stable @types/react).
// Next.js pulls in react/experimental which declares inert?: boolean | undefined.
// This declaration aligns with that to prevent conflicts.
import 'react';

declare module 'react' {
  interface HTMLAttributes<T> {
    inert?: boolean | undefined;
  }
}
