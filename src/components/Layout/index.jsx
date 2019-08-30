import React from 'react'
import Helmet from 'react-helmet'
import '../../assets/scss/init.scss'
import imageFav from'../../pages/photo.jpg'

class Layout extends React.Component {
  render() {
    const { children } = this.props

    return (
      <div className="layout">
        <Helmet defaultTitle="Blog by Q" />
        {children}
      </div>
    )
  }
}

export default Layout
