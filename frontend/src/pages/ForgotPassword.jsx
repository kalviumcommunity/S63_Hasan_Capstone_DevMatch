import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';

function ForgotPassword() {
  return (
    <div className="forgot-password-page flex flex-col items-center p-4 space-y-6">
      <h2 className="text-2xl font-semibold text-center">Reset Your Password</h2>
      <Input type="password" placeholder="New Password" className="w-full p-2 border border-gray-300 rounded mb-4" />
      <Input type="password" placeholder="Confirm Password" className="w-full p-2 border border-gray-300 rounded mb-4" />
      <Button label="Save" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" />
    </div>
  );
}

export default ForgotPassword;