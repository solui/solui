import React, { useMemo } from 'react'
import DefaultLink from 'next/link'
import url from 'url'

export const Link = ({ page, query = {}, children }) => {
  const href = useMemo(() => url.format({ pathname: `/${page}`, query }), [ page, query ])

  return <DefaultLink href={href}>{children}</DefaultLink>
}

export const PkgLink = ({ pkg, children }) => (
  <DefaultLink href='/[pkg]' as={`/${pkg}`}>{children}</DefaultLink>
)

export const PkgVersionLink = ({ pkg, vid, children }) => (
  <DefaultLink href='/[pkg]/[vid]' as={`/${pkg}/${vid}`}>{children}</DefaultLink>
)
