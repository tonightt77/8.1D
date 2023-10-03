import React from 'react';
import { Icon, Input } from 'semantic-ui-react';

const InputIconChild = (props) => {
  return (
    <Input 
      type={props.type} 
      iconPosition="left" 
      icon={<Icon name="at" />}
      value={props.value}
      onChange={props.onChange}
    />
  );
};

export default InputIconChild;
