/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { Component } from 'react'

import { Tooltip as DefaultTooltip } from 'react-tippy'

import 'react-tippy/dist/tippy.css'

export default class Tooltip extends Component {
  state = {}

  render () {
    const { content, children, ...props } = this.props

    return (
      children({
        flash: this.flash,
        show: this.show,
        hide: this.hide,
        tooltipElement: (
          <DefaultTooltip
            id={this.id}
            open={this.state.show}
            html={<div><p>{content}</p></div>}
            duration={200}
            {...props}
          />
        )
      })
    )
  }

  show = () => {
    this.setState({ show: true })
  }

  hide = () => {
    this.setState({ show: false })
  }

  flash = (timeMs = 2000) => {
    this.show()
    setTimeout(() => this.hide(), timeMs)
  }
}
