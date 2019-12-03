// Modified from https://github.com/reach/reach-ui/blob/master/packages/rect/src/index.js
//  : useIsomorphicLayoutEffect instead of useLayoutEffect

/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useRef, useState } from 'react'
import { useIsomorphicLayoutEffect } from 'react-use'
import observeRect from '@reach/observe-rect'
import { func, bool } from 'prop-types'

/**
 * Hook for obtaining bounding rectangle of a DOM node.
 *
 * @param  {Object} nodeRef  Element [reference](https://reactjs.org/docs/hooks-reference.html).
 * @param  {Boolean} [observe=true] Whether to observe for changes.
 * @param  {Funtion} onChange Callback for when rectangle gets updated.
 *
 * @return {Object} Bounding rectangle
 */
export function useRect (nodeRef, observe = true, onChange) {
  const [ rect, setRect ] = useState(null)
  const observerRef = useRef(null)
  useIsomorphicLayoutEffect(() => {
    const cleanup = () => {
      if (observerRef.current) {
        observerRef.current.unobserve()
      }
    }

    if (!nodeRef.current) {
      console.warn('You need to place the ref')
      return cleanup
    }

    if (!observerRef.current && nodeRef.current) {
      observerRef.current = observeRect(nodeRef.current, r => {
        if (onChange) {
          onChange(r)
        }
        setRect(r)
      })
    }

    if (observe) {
      observerRef.current.observe()
    }

    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ observe, onChange ])
  return rect
}

const Rect = ({ onChange, observe, children }) => {
  const ref = React.useRef(null)
  const rect = useRect(ref, observe, onChange)
  return children({ ref, rect })
}

Rect.defaultProps = {
  observe: true
}

if (typeof __DEV__ !== 'undefined') {
  Rect.propTypes = {
    children: func,
    observe: bool,
    onChange: func
  }
}

export default Rect
