import React from 'react'
import { Icon, Input } from 'semantic-ui-react'

const InputIconChild = (props)=>{
    return <div>
       <Input type={props.type} iconPosition='left'>
      <Icon name='at' />
    </Input>
    <input style={{ marginLeft: '30px' }}/>
    </div>

}
export default InputIconChild