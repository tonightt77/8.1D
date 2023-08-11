import React from "react";
import InputIconChild from './Input'
import Button from './Button'
import './Subscribe.css'

const Subscribe = () => {
  return (
    <div class="signup-block">
      <p>SIGN UP FOR OUR DAILY INSIDER</p>
      <InputIconChild type="text"/>
      <Button type="submit" />
    </div>
  );
};

export default Subscribe;