
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthContainer = () => {
  const [isRegister, setIsRegister] = useState(false);

  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {isRegister ? (
        <RegisterForm onToggleForm={toggleForm} />
      ) : (
        <LoginForm onToggleForm={toggleForm} />
      )}
    </div>
  );
};

export default AuthContainer;
