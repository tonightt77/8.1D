import React from 'react'

const ButtonSubmit = (props) => (
  <div>
    <button
    type={props.type}
    style={{ width: `${props.width}px` }}>
    {props.text}
    </button>
  </div>
)

export default ButtonSubmit