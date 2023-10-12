import React, { createContext, useContext, useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, PhoneAuthProvider, signInWithPopup, PhoneMultiFactorGenerator, RecaptchaVerifier, getMultiFactorResolver  } from "firebase/auth";
import { auth } from "./firebaseConfig";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

// Login with email and password
const login = async (email, password, recaptchaVerifier) => {
  try {
    // Attempt to sign in the user with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setIsLoggedIn(true); // Update the state to show that the user is logged in
    return userCredential; // Return the user credential object
  } catch (error) {
    // Check if the error is due to multi-factor authentication requirement
    if (error.code === 'auth/multi-factor-auth-required') {
      const resolver = getMultiFactorResolver(auth, error);
      const selectedHint = resolver.hints[0];

      // Check if the multi-factor authentication method is phone
      if (selectedHint.factorId === PhoneMultiFactorGenerator.FACTOR_ID) {
        const phoneInfoOptions = {
          multiFactorHint: selectedHint,
          session: resolver.session
        };
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        // Verify the phone number and get the verification ID
        const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
        // Prompt the user to enter the verification code sent via SMS
        const verificationCode = prompt('Enter the SMS verification code:');
        const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
        // Resolve the sign-in process with the multi-factor assertion
        const resolvedUserCredential = await resolver.resolveSignIn(multiFactorAssertion);

        setIsLoggedIn(true); // Update the state to show that the user is logged in after MFA
        console.log("Login successful with MFA");
        return resolvedUserCredential; // Return the resolved user credential object
      } else {
        console.error("Unsupported MFA method.");
        throw new Error("Unsupported MFA method."); // Throw an error if the MFA method is not supported
      }
    } else {
      console.error("Error logging in:", error.message); // Log any other errors
      throw error; // Throw the error to be handled by the caller
    }
  }
};


  

  // Function to register a new user with email and password
const register = async (email, password) => {
  try {
    // Attempt to create a new user with the provided email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential; // Return the user credential object on successful registration
  } catch (error) {
    // Log and alert the user of any errors during the registration process
    console.error("Error registering:", error.message);
    alert(error.message);
    throw error; // Propagate the error to be handled by the caller
  }
};

// Function to log out the currently authenticated user
const logout = () => {
  signOut(auth)
    .then(() => {
      // Successfully signed out the user and update the login state
      setIsLoggedIn(false);
    })
    .catch((error) => {
      // Log any errors that occur during the sign-out process
      console.error("Error signing out:", error);
    });
};

// Function to log in a user using Google as an authentication provider
const loginWithGoogle = async (recaptchaVerifier) => {
  const provider = new GoogleAuthProvider();

  try {
    // Attempt to sign in the user using a popup window for Google authentication
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    setIsLoggedIn(true); // Update the login state on successful authentication
  } catch (error) {
    // Handle errors, including multi-factor authentication requirements
    if (error.code === 'auth/multi-factor-auth-required') {
      const resolver = getMultiFactorResolver(auth, error);
      const selectedHint = resolver.hints[0];

      // Handle phone multi-factor authentication
      if (selectedHint.factorId === PhoneMultiFactorGenerator.FACTOR_ID) {
        const phoneInfoOptions = {
          multiFactorHint: selectedHint,
          session: resolver.session
        };
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
        const verificationCode = prompt('Enter the SMS verification code:');
        const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
        await resolver.resolveSignIn(multiFactorAssertion);

        setIsLoggedIn(true); // Update the login state after resolving MFA
        console.log("Login successful with MFA");
      } else {
        // Log an error if an unsupported MFA method is used
        console.error("Unsupported MFA method.");
        throw new Error("Unsupported MFA method.");
      }
    } else {
      // Log and propagate any other errors during the login process
      console.error("Error logging in with Google:", error.message);
      throw error;
    }
  }
};



  return (
    <AuthContext.Provider value={{ isLoggedIn, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};
