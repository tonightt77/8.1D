import React from "react";
import Header from "./components/FormHeader";
import Form from "./components/JobForm";

function NewJob() {
  return (
    <div style={{backgroundColor: "#f4f4f4", padding: "20px"}}>
      <Header text="New Job" />
        <Form />  
    </div>
  );
}

export default NewJob;