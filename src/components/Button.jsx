import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

const ButtonAnimated = (props) =>{
    return <div>
    <Button primary animated = 'fade' type = {props.type} >
      <Button.Content visible>Subscribe</Button.Content>
      <Button.Content hidden>
        <Icon name='envelope' />
      </Button.Content>
    </Button>
    </div>
}
export default ButtonAnimated