import React from "react";
import Title from './Title'
import CustomerList from './CustomerList'
function FreeLancers() {
  return (
    <div>
    <Title 
      text = "Featured Customers"
    />
   <CustomerList />
    </div>
  );
}

export default FreeLancers;