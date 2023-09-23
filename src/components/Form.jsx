import React, {useState} from "react";
import { Button, Checkbox, Form } from "semantic-ui-react";
import "../components/CustomForm.css"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebaseConfig"
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';



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
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      authContext.login(); // Update the logged-in state
      navigate('/');// Redirect to home after successful login

    } catch (error) {
      console.error("Error logging in:", error.message);
      if (error.code === "auth/invalid-login-credentials") {
        // Display an error message
        alert("Invalid email or password. Please try again.");
      } else {
        // Handle other errors
        alert("An error occurred. Please try again.");
      }
    }
};

const handleRegister = async () => {
  if (formData.password !== formData.confirmPassword) {
    console.error("Passwords do not match");
    alert("Passwords do not match. Please try again.");
    return;
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    // get the user id
    const uid = userCredential.user.uid;

    // Add user details to Firestore
    await setDoc(doc(db, "users", uid), {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });

    navigate('/login');  // Redirect to login after successful registration

  } catch (error) {
    console.error("Error registering:", error.message);
    if (error.code === "auth/weak-password") {
      alert("Password should be at least 6 characters long.");
    } else {
      alert("An error occurred during registration. Please try again.");
    }
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
    </Form>
  );
}

export default CustomForm;
