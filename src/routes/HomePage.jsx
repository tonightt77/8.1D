import React from "react";
import Customer from "../components/Customers";
import FreeLancers from "../components/FreeLancers";
import Subscribe from "../components/Subscribe";

const HomePage = () => {  return (
    <div className="App">
      <FreeLancers />
      <Customer />
      <Subscribe />
    </div>
  );}

  export default HomePage;