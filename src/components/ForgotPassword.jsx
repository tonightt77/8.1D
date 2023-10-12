import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'; // Update imports
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const auth = getAuth(); // Get auth instance

    try {
      await sendPasswordResetEmail(auth, email); // Update method call
      setMessage('Password reset email sent. Please check your email.');
    } catch (error) {
      setMessage('Error resetting password: ' + error.message);
    }
  };

  return (
    <div className='forgotPassowrd'>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
