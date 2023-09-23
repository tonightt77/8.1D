import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const options = [
  { key: 'title', text: 'Title', value: 'title' },
  { key: 'skills', text: 'Skills', value: 'skills' },
];

const DropdownExampleUncontrolled = ({ value, onChange }) => (
    <Dropdown
      selection
      options={options}
      placeholder='Filter'
      value={value}
      onChange={(e, { value }) => onChange(value)}
    />
  );
  

export default DropdownExampleUncontrolled;
