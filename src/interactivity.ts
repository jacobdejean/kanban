// interactivity.js is a collection of useful things for each project

import { useState } from 'react'

export interface PushableStateOpts {
  deepCopy: boolean
}

export function usePushableState<Type>(array: Type[], opts?: PushableStateOpts): [Type[], (item: Type) => void] {
    let [state, setState] = useState(array);
  
    let pushState = (item: Type) => {
      let n = opts?.deepCopy ? Object.assign({}, state) : [...state]
      n.push(item)
      setState(n)
    }
  
    return [state, pushState]
  }