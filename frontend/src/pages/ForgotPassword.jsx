import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import '../styles/ForgotPassword.css'

function ForgotPassword() {
  return (
    <div className="forgot-password-page">
      <h2>Reset Your Password</h2>
      <Input type="password" placeholder="New Password" />
      <Input type="password" placeholder="Confirm Password" />
      <Button label="Save" />
    </div>
  );
}

export default ForgotPassword;