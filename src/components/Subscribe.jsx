import React, { useState } from "react";
import InputIconChild from './Input';
import Button from './Button';
import './Subscribe.css';

const Subscribe = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert('Error subscribing. Please try again.');
      }
    } catch (error) {
      console.error('There was an error sending the request', error);
    }
  };

  return (
    <div className="signup-block">
      <p>SIGN UP FOR OUR DAILY INSIDER</p>
      <form onSubmit={handleSubmit}>
        <InputIconChild 
          type="text" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <Button type="submit" />
      </form>
    </div>
  );
};

export default Subscribe;
