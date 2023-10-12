import React from "react";
import { Link } from 'react-router-dom';
import { Icon } from "semantic-ui-react";
import './footer.css'

const Footer = () => {
  return (
    <div className="footer">
        <div className="footer_top">
            <div className="footer_top_left">
                <h3>For Dev</h3>
                    <li><Link to="/find-job">How it works</Link></li>
                    <li><Link to="/profile">How to create a profile</Link></li>
                    <li><Link to="/find-job">Find Jobs</Link></li>
            </div>
            <div className="footer_top_mid">
                <h3>For Clients</h3>
                    <li><Link to="/find-dev">How it works</Link></li>
                    <li><Link to="/find-dev">How to post a job</Link></li>
                    <li><Link to="/find-dev">Find Dev</Link></li>
            </div>
            <div className="footer_top_right">
                <h3>Stay Connected</h3>
                <div className="icon">
                <Icon name='facebook square' size='big' />
                <Icon name='twitter' size='big'/>
                <Icon name='instagram' size='big'/>
                </div>
            </div>        
        </div>
        <div className="footer_bottom">
            <li><Link to="https://firebase.google.com/terms">Privacy Policy</Link></li>
            <li><Link to="https://firebase.google.com/terms">Code of Conduct</Link></li>
            <li><Link to="https://firebase.google.com/terms">Terms & Conditions</Link></li>
        </div>
      <p>© 2023 | All Rights Reserved</p>
    </div>
  );
}

export default Footer;