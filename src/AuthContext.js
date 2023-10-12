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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setIsLoggedIn(true);
        return userCredential;
    } catch (error) {
        if (error.code === 'auth/multi-factor-auth-required') {
          const resolver = getMultiFactorResolver(auth, error);
            const selectedHint = resolver.hints[0];

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
                const resolvedUserCredential = await resolver.resolveSignIn(multiFactorAssertion); // Get the resolved userCredential

                setIsLoggedIn(true); // Set the user as logged in after MFA
                console.log("Login successful with MFA");
                return resolvedUserCredential; // Return the resolved userCredential
            } else {
                console.error("Unsupported MFA method.");
                throw new Error("Unsupported MFA method.");
            }
        } else {
            console.error("Error logging in:", error.message);
            throw error;
        }
    }
};

  

  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error("Error registering:", error.message);
      alert(error.message);
      throw error; // Propagate the error to the caller
    }
  };
  

  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setIsLoggedIn(false);
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const loginWithGoogle = async (recaptchaVerifier) => {
    const provider = new GoogleAuthProvider();
  
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setIsLoggedIn(true);
    } catch (error) {
      if (error.code === 'auth/multi-factor-auth-required') {
        const resolver = getMultiFactorResolver(auth, error);
        const selectedHint = resolver.hints[0];
  
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
          
          setIsLoggedIn(true); // Set the user as logged in after MFA
          console.log("Login successful with MFA");
        } else {
          console.error("Unsupported MFA method.");
          throw new Error("Unsupported MFA method.");
        }
      } else {
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
