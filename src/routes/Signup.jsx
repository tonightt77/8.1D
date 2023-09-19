import React from "react";
import "../components/Form.css"

import CustomForm from "../components/Form";

const Signup = () => {
    return (
        <div className="Form">
        <h1>Create a DevLink Account</h1>
        <CustomForm formType="register" />
        </div>
    );
    };

    export default Signup;