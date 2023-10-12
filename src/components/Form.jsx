import React, {useState} from "react";
import { Button, Icon, Checkbox, Form } from "semantic-ui-react";
import "../components/CustomForm.css"
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { auth } from "../firebaseConfig";

import { RecaptchaVerifier, sendEmailVerification } from "firebase/auth";


const db = getFirestore();

const CustomForm = ({ formType }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const navigate = useNavigate();
  const authContext = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheckboxChange = () => {
    setFormData(prevState => ({
      ...prevState,
      termsAccepted: !prevState.termsAccepted
    }));
  };

  const handleLogin = async () => {
    try {
        // Initialize the recaptchaVerifier
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': async (response) => {
                try {
                    const userCredential = await authContext.login(formData.email, formData.password, recaptchaVerifier);

                    // Check if the user's email is verified
                    const user = userCredential.user;
                    if (!user.emailVerified) {
                        alert("Please verify your email before logging in.");
                        // Send a verification email
                        await sendEmailVerification(user);
                        alert("Verification email sent. Please check your inbox.");
                        return; // Exit the function early if the email is not verified
                    }

                    navigate('/'); // Redirect to home after successful login

                } catch (error) {
                    console.error("Error logging in:", error.message);
                    if (error.code === "auth/wrong-password") {
                        // Display an error message
                        alert("Invalid email or password. Please try again.");
                    } else {
                        // Handle other errors
                        alert("An error occurred. Please try again.");
                    }
                }
            }
        });

        // Trigger the reCAPTCHA check
        recaptchaVerifier.verify();

    } catch (error) {
        console.error("Error initializing reCAPTCHA:", error.message);
        alert("An error occurred. Please try again.");
    }
};


const handleRegister = async () => {
  // Validate the form data
  if (formData.password !== formData.confirmPassword) {
    console.error("Passwords do not match");
    alert("Passwords do not match. Please try again.");
    return;
  }

  if (!formData.termsAccepted) {
    console.error("Terms and Conditions not accepted");
    alert("Please accept the Terms and Conditions to proceed.");
    return;
  }

  // If form data is valid, attempt to register the user
  try {
    // Register the user using Firebase Authentication
    const userCredential = await authContext.register(formData.email, formData.password);

    // Get the user ID from the user credential
    const uid = userCredential.user.uid;

    // Store additional user details in Firestore
    await setDoc(doc(db, "users", uid), {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });

    // Navigate to the login page after successful registration
    navigate('/login');
    const user = userCredential.user;
    await sendEmailVerification(user);
    alert("Registration successful! Please verify your email before logging in.");
  } catch (error) {
    console.error("Error registering:", error.message);

    // Handle specific error codes and display appropriate error messages
    if (error.code === "auth/email-already-in-use") {
      alert("The email address is already in use by another account.");
    } else if (error.code === "auth/weak-password") {
      alert("Password should be at least 6 characters long.");
    } else {
      alert("An error occurred during registration. Please try again.");
    }
  }
};


const handleGoogleLogin = async (e) => {
  e.preventDefault();

  // Initialize the recaptchaVerifier
  const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    size: 'invisible',
    'callback': async (response) => {
      // reCAPTCHA solved - proceed with Google login.
      try {
        await authContext.loginWithGoogle(recaptchaVerifier);
        navigate('/'); // Navigate to home after successful login
      } catch (error) {
        console.error("Error logging in with Google:", error.message);
        alert("An error occurred. Please try again.");
      }
    }
  });

  try {
    // Trigger the reCAPTCHA check
    recaptchaVerifier.verify();
  } catch (error) {
    console.error("Error initializing reCAPTCHA:", error.message);
  }
};



  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formType === "login") {
      await handleLogin();
    } else if (formType === "register") {
      await handleRegister();
    }

    setIsLoading(false);
  };

  return (
    <Form className="CustomForm" onSubmit={handleSubmit}>
      {formType === "login" && (
        <>
          <Form.Field>
            <label>Email</label>
            <input type="email" name="email" placeholder='Email' value={formData.email} onChange={handleInputChange} />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input type="password" name="password" placeholder='Password' value={formData.password} onChange={handleInputChange} />
          </Form.Field>
        </>
      )}

      {formType === "register" && (
        <>
          <Form.Group widths='equal'>
            <Form.Input fluid label='First name' name="firstName" placeholder='First name' value={formData.firstName} onChange={handleInputChange} />
            <Form.Input fluid label='Last name' name="lastName" placeholder='Last name' value={formData.lastName} onChange={handleInputChange} />
          </Form.Group>
          <Form.Field>
            <label>Email</label>
            <input type="email" name="email" placeholder='Email' value={formData.email} onChange={handleInputChange} />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input type="password" name="password" placeholder='Password' value={formData.password} onChange={handleInputChange} />
          </Form.Field>
          <Form.Field>
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder='Confirm Password' value={formData.confirmPassword} onChange={handleInputChange} />
          </Form.Field>
          <Form.Field>
            <Checkbox label='I agree to the Terms and Conditions' checked={formData.termsAccepted} onChange={handleCheckboxChange} />
          </Form.Field>
        </>
      )}
      
      <Button loading={isLoading} type='submit'>{formType === "login" ? "Login" : "Register"}</Button>
      <hr />
      {formType === "login"?
      <><Button color='grey' onClick={handleGoogleLogin}><Icon name='google' />Login With Google</Button>
      <a href="/register">Don't have an account? Register here.</a>
      <div id="recaptcha-container"></div></> 
        :
        <a href="/login">Already have an account? Login here.</a>
      }      
    </Form>
  );
}

export default CustomForm;
