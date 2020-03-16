/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
import React, { useRef, useMemo, useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
/* eslint-enable import/no-unresolved */
/* eslint-enable import/no-extraneous-dependencies */

import styled from '@emotion/styled'
import { _ } from '@solui/utils'
import { flex } from '@solui/styles'
import { useWindowScroll } from 'react-use'

import { useRect } from './hooks'
import IconButton from './IconButton'

const Container = styled.div`
`

const Items = styled.ul`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'stretch' })};
  list-style: none;
  border-collapse: collapse;
  border: 1px solid ${({ theme }) => theme.dropdownBorderColor};
  background-color: ${({ theme }) => theme.dropdownItemBgColor};
  z-index: 3;
  height: 200px;
  min-width: 200px;
  overflow: scroll;
  position: absolute;

  ${({ offset }) => offset ? `
    opacity: 1;
    pointer-events: auto;
    top: ${offset.top}px;
    left: ${offset.left}px;
  ` : `
    opacity: 0;
    pointer-events: none;
  `};
`

const UnselectedItemColors = ({ theme }) => `
  background-color: ${theme.dropdownItemBgColor};
  color: ${theme.dropdownItemTextColor};
`

const selectedItemColors = ({ theme }) => `
  background-color: ${theme.dropdownSelectedItemBgColor};
  color: ${theme.dropdownSelectedItemTextColor};
`

const Item = styled.li`
  padding: 1em;
  border-bottom: 1px solid ${({ theme }) => theme.dropdownBorderColor};
  ${({ theme, active }) => (
    active ? selectedItemColors({ theme }) : UnselectedItemColors({ theme })
  )};

  &:hover {
    cursor: pointer;
    ${({ theme }) => selectedItemColors({ theme })};
  }
`

const ItemLabel = styled.div`
  margin-bottom: 0.2rem;
  ${({ theme }) => theme.font('body')};
`

const ItemValue = styled.div`
  font-size: 80%;
  color: ${({ theme }) => theme.dropdownItemMetaTextColor};
  ${({ theme }) => theme.font('header')};
`

const Dropdown = ({ className, options, selectedOption, onSelect }) => {
  const [ open, setOpen ] = useState(false)

  const onSelectItem = useCallback(key => {
    setOpen(false)
    if (onSelect) {
      onSelect(key)
    }
  }, [ onSelect ])

  const onItemClick = useMemo(() => {
    return Object.keys(options).reduce((m, k) => {
      m[k] = () => onSelectItem(k)
      return m
    }, {})
  }, [ onSelectItem, options ])

  const toggleMenu = useCallback(() => {
    setOpen(!open)
  }, [ open ])

  const containerRef = useRef()
  const menuRef = useRef()

  const containerBoundingRect = useRect(containerRef)
  const menuBoundingRect = useRect(menuRef)
  const scrollPos = useWindowScroll()

  const offset = useMemo(() => {
    if (open && containerBoundingRect && menuBoundingRect) {
      return {
        top: containerBoundingRect.bottom + scrollPos.y + 10,
        left: containerBoundingRect.right + scrollPos.x - menuBoundingRect.width,
      }
    } else {
      return null
    }
  }, [ open, containerBoundingRect, menuBoundingRect, scrollPos ])

  return (
    <Container className={className} ref={containerRef}>
      <IconButton
        icon={{ name: 'caret-down' }}
        onClick={toggleMenu}
      />
      {ReactDOM.createPortal(
        <Items offset={offset} ref={menuRef}>
          {Object.keys(options).map(key => (
            <Item
              key={key}
              active={selectedOption === key}
              onClick={onItemClick[key]}
            >
              <ItemLabel>{key}</ItemLabel>
              <ItemValue>{options[key]}</ItemValue>
            </Item>
          ))}
        </Items>,
        window.document.body
      )}
    </Container>
  )
}

export default Dropdown
