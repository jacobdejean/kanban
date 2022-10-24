// interactivity.js is a collection of useful things for each project

import { useRef, useState } from "react";
import { TaskProps } from "./components/Task";

export interface PushableStateOpts {
  deepCopy: boolean;
}

export function usePushableState<Type>(array: Type[], opts?: PushableStateOpts): [Type[], (item: Type) => void, (index: number, value: Type) => Type] {
  let [state, setState] = useState(array);
  let [lastModified, setLastModified] = useState(array[0]);

  let pushState = (item: Type) => {
    let n = opts?.deepCopy ? Object.assign({}, state) : [...state];
    n.push(item);
    setState(n);
  };

  let setValue = (index: number, value: Type) => {
    state[index] = value;
    setLastModified(state[index]);

    return lastModified
  };

  return [state, pushState, setValue];
}

export function useLengthyRef<Type>(length: number, value: Type) {
  return ([] as React.Ref<Type>[]).fill(useRef(value), 0, length);
}

export function useFilter<Type>(
  array: Type[],
  predicate: (value: Type, filter: { search: string; contextId: string }) => boolean
): [Type[], (filter: { search: string; contextId: string }) => void] {
  const [filter, _setFilter] = useState({ search: "", contextId: "none" });

  let setFilter = (filter: { search: string; contextId: string }) => {
    _setFilter(Object.assign({}, filter));
  };

  return [array.filter(value => predicate(value, filter)), setFilter];
}
