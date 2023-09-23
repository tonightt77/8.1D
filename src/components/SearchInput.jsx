import React from 'react';
import { Input } from 'semantic-ui-react';

const InputExampleInput = ({ value, onChange }) => (
    <Input
      placeholder='Search...'
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
  

export default InputExampleInput;
