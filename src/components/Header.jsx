import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import ImageFluid from './HeaderImg'

export default class MenuExampleHeader extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
    <div>      
        <Menu inverted>
        <Menu.Item
            name='DevLink Marketplace'
            onClick={this.handleItemClick}
        />
        {/* make all the item to the right side */}
        <Menu.Menu position='right'>
        <Menu.Item
          name='Find DEV'
          active={activeItem === 'Find DEV'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='Find Jobs'
          active={activeItem === 'Find Jobs'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='Login'
          active={activeItem === 'Login'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='Create Account'
          active={activeItem === 'Create Account'}
          onClick={this.handleItemClick}
        />
        </Menu.Menu>  
      </Menu>
    <ImageFluid />
    </div>
          
    )
  }
}