import React from "react";
import { Icon } from "semantic-ui-react";
import './footer.css'

const Footer = () => {
  return (
    <div className="footer">
        <div className="footer_top">
            <div className="footer_top_left">
                <h3>For Dev</h3>
                    <li><a href="#">How it works</a></li>
                    <li><a href="#">How to create a profile</a></li>
                    <li><a href="#">Find Jobs</a></li>
            </div>
            <div className="footer_top_mid">
                <h3>For Clients</h3>
                    <li><a href="#">How it works</a></li>
                    <li><a href="#">How to post a job</a></li>
                    <li><a href="#">Find Dev</a></li>
            </div>
            <div className="footer_top_right">
                <h3>Stay Connected</h3>
                <Icon name='facebook square' size='big' />
                <Icon name='twitter' size='big'/>
                <Icon name='instagram' size='big'/>
            </div>           
        </div>
        <div className="footer_bottom">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Code of Conduct</a></li>
            <li><a href="#">Terms & Conditions</a></li>
        </div>
      <p>© 2023 | All Rights Reserved</p>
    </div>
  );
}

export default Footer;