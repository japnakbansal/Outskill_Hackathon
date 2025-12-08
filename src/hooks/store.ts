import { useState, useEffect } from 'react';

type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>)) => void;

export function create<T extends object>(
  createState: (set: SetState<T>) => T
) {
  let state: T;
  const listeners = new Set<() => void>();

  const setState: SetState<T> = (partial) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    state = { ...state, ...nextState };
    listeners.forEach((listener) => listener());
  };

  state = createState(setState);

  return function useStore(): T {
    const [, rerender] = useState({});

    useEffect(() => {
      const listener = () => rerender({});
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }, []);

    return state;
  };
}
