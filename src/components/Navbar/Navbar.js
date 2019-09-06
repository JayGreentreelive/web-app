import React, { useState } from 'react'
import { Query, useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { toLower, get, has, find, camelCase } from 'lodash'
import { useScrollPosition } from '../../hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/fontawesome-pro-light'

import { Navbar, Nav } from 'react-bootstrap'

import GET_WEBSITE_HEADER from './getWebsiteHeader'
import DefaultIcon from '../../images/default_icon.png'

import { Button } from '@christfellowshipchurch/web-ui-kit'

// Takes a collection of images from
//  the API's return data and formats
//  it to be an array of the following
//  object structure: { imageKey: { uri, alt } }
const imageArrayToObject = (images) => {
  let imagesObj = {}

  images.forEach((n, i) => {
    const key = camelCase(get(n, 'name', i))
    const uri = get(n, 'sources[0].uri', '')
    const alt = get(n, 'name', 'Christ Fellowship Church')

    imagesObj[key] = { uri, alt }
  })

  return imagesObj
}

const DefaultNavbar = () =>
  <nav className='navbar navbar-default'>
    <a href="/">
      <img
        src={DefaultIcon}
        alt='Christ Fellowship Church Icon'
      />
    </a>
  </nav>

const NavbarConnected = ({ bg, variant, brandImageKey }) => {
  const website = process.env.REACT_APP_WEBSITE_KEY
  const { loading, error, data } = useQuery(GET_WEBSITE_HEADER, {
    variables: { website },
    fetchPolicy: "cache-and-network"
  })

  // If Query state is loading or there's an error,
  //  return a defaulted header with the CF Icon centered
  if (loading) return <DefaultNavbar />
  if (error) {
    console.error({ error })
    return <DefaultNavbar />
  }

  // Get the data object from the return data or default to null
  const navigationData = get(data, 'getWebsiteNavigation', null)

  if (navigationData) {
    const images = imageArrayToObject(get(navigationData, 'images', []))
    const brandImage = get(images, brandImageKey, null)
    const quickAction = {
      display: has(navigationData, 'quickAction.call') && has(navigationData, 'quickAction.action'),
      call: get(navigationData, 'quickAction.call', ''),
      action: get(navigationData, 'quickAction.action', '')
    }

    return (
      <Navbar bg={bg} variant={variant} sticky='top' expand='lg'>
        {brandImage &&
          <Navbar.Brand href="/">
            <img
              src={brandImage.uri}
              style={{ height: '80px', width: 'auto' }}
              alt={brandImage.alt}
            />
          </Navbar.Brand>
        }
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <FontAwesomeIcon icon={faBars} />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {navigationData.navigationLinks.map((link, i) => (
              <Nav.Link
                key={i}
                href={link.action}
                className='mx-3'>
                {link.call}
              </Nav.Link>
            ))}
            {quickAction.display &&
              <div className="mx-3">
                <Button
                  call={quickAction.call}
                  action={quickAction.action}
                />
              </div>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }

  // If the expected data is not returned from the API,
  //    return the default navbar
  return <DefaultNavbar />
}

NavbarConnected.propTypes = {
  bg: PropTypes.string,
  variant: PropTypes.string,
  brandImageKey: PropTypes.string,
}

NavbarConnected.defaultProps = {
  bg: 'white',
  variant: 'light',
  brandImageKey: 'brandImage',
}

export default NavbarConnected