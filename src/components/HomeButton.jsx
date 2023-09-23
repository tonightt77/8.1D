import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

const ButtonAnimated = (props) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button primary animated='fade'>
                <Button.Content visible>{props.name}</Button.Content>
                <Button.Content hidden>
                    <Icon name={props.iconName} />
                </Button.Content>
            </Button>
        </div>
    );
}

export default ButtonAnimated