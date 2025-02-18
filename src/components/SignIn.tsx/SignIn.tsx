import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { Spin } from 'antd'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../../redux/postsApi'
import classes from './SignIn.module.scss'

interface ErrorData {
  message: string;
}

const SignIn: React.FC = () => {
  const [loginMutation, { isLoading, isSuccess, isError, error }] =
    useLoginMutation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    loginMutation({
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    })
      .unwrap()
      .then(() => navigate('/posts'))
      .catch((error) => console.error('Login failed:', error))
  }

  return (
    <div className={classes.signIn}>
      <form className={classes.signIn__form} onSubmit={handleSubmit}>
        <h1 className={classes.signIn__title}>Sign In</h1>
        <label className={classes.signIn__label}>
          Email address
          <input
            className={classes.signIn__input}
            type="email"
            placeholder="Email address"
            required
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className={classes.signIn__label}>
          Password
          <input
            className={classes.signIn__input}
            type="password"
            placeholder="Password"
            required
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className={classes.signIn__button} type="submit">
          Login
        </button>
        <div className={classes.signIn__link}>
          Don't have an account?
          <Link to="/create-user"> Sign Up.</Link>
        </div>
        {isLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spin />
          </div>
        )}
        {isSuccess && <p>Login Successful!</p>}
        {isError && (
          <p style={{ color: 'red' }}>
            Error:{' '}
            {(error as FetchBaseQueryError & { data: ErrorData })?.data?.message ||
              'Неправильный email или пароль'}
          </p>
        )}
      </form>
    </div>
  )
}

export default SignIn
