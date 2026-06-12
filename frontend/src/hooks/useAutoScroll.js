import { useEffect, useRef } from 'react';

export function useAutoScroll(deps) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, deps);

  return ref;
}
