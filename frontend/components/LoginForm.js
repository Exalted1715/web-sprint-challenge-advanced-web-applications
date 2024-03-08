import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const initialFormValues = {
  username: '',
  password: '',
};

export default function LoginForm({ login }) {
  const [values, setValues] = useState(initialFormValues);

  const onChange = evt => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const onSubmit = evt => {
    evt.preventDefault();
    login(values); // Call the login function with the form values
  };

  const isDisabled = () => {
    return values.username.trim().length < 3 || values.password.trim().length < 8;
  };

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
        type="password" // Set input type to password
      />
      <button disabled={isDisabled()} id="submitCredentials">Submit credentials</button>
    </form>
  );
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};
