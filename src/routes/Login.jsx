import React from "react";
import "../components/Form.css"

import CustomForm from "../components/Form";

const Login = () => {
    return (
        <div className="Form">
        <h1>Login</h1>
        <CustomForm formType="login" />
        </div>
    );
    };

    export default Login;