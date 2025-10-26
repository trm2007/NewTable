// useNormalizedListeners.js
import { computed } from 'vue'

export function useNormalizedListeners(attrs) {
  return computed(() => {
    const res = {}
    for (const [key, val] of Object.entries(attrs)) {
      if (key.startsWith('on')) {
        res[key.slice(2).toLowerCase()] = val
      }
    }
    return res
  })
}

