// interactivity.js is a collection of useful things for each project

import { useState } from 'react'

export function usePushableState<Type>(array: Type[]): [Type[], (item: Type) => void] {
    let [state, setState] = useState(array);
  
    let pushState = (item: Type) => {
      let n = [...state]
      n.push(item)
      setState(n)
    }
  
    return [state, pushState]
  }