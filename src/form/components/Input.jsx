import React from 'react'
import { Form } from 'semantic-ui-react'

const InputSemantic = (props)=>{
    return <div>
    <input 
        type={props.type} 
        name={props.name} 
        value={props.value} 
        onChange={props.onChange}
        placeholder={props.placeholder}
        style={{ width: `${props.width}px`, height: `${props.height}px`}}
    />
</div>

}
export default InputSemantic