import React from "react";
import Title from './Title'
//import CardList from './CardList'
import FreeLancerList from "./FreeLancerList";
function FreeLancers() {
  return (
    <div>
    <Title 
      text = "Featured Freelancers"
    />
   <FreeLancerList />
    </div>
  );
}

export default FreeLancers;