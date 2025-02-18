import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '../../redux/postsApi'
import classes from './CreateUser.module.scss'

interface FormData {
  username: string
  email: string
  password: string
  repeatPassword: string
}

const CreateUser: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>()

  const [registerMutation, { isSuccess, isError, error }] =
    useRegisterMutation()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) {
      navigate('/posts')
    }
  }, [isSuccess, navigate])

  const onSubmit: SubmitHandler<FormData> = (data) => {
    registerMutation({
      username: data.username.trim(),
      email: data.email.trim(),
      password: data.password,
    })
  }

  const password = watch('password')

  return (
    <div className={classes.createUser}>
      <form
        className={classes.createUser__form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className={classes.createUser__title}>Create new account</h1>
        <label className={classes.createUser__label}>
          Username
          <input
            {...register('username', { required: 'Username is required' })}
            className={classes.createUser__input}
            type="text"
            placeholder="Username"
          />
          {errors.username && (
            <p style={{ color: 'red' }}>{errors.username.message}</p>
          )}
        </label>
        <label className={classes.createUser__label}>
          Email
          <input
            {...register('email', { required: 'Email is required' })}
            className={classes.createUser__input}
            type="email"
            placeholder="Email"
          />
          {errors.email && (
            <p style={{ color: 'red' }}>{errors.email.message}</p>
          )}
        </label>
        <label className={classes.createUser__label}>
          Password
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            className={classes.createUser__input}
            style={{ borderColor: errors.password ? 'red' : 'initial' }}
            type="password"
            placeholder="Password"
          />
          {errors.password && (
            <p style={{ color: 'red' }}>{errors.password.message}</p>
          )}
        </label>
        <label className={classes.createUser__label}>
          Repeat password
          <input
            {...register('repeatPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
            className={classes.createUser__input}
            style={{ borderColor: errors.repeatPassword ? 'red' : 'initial' }}
            type="password"
            placeholder="Repeat password"
          />
          {errors.repeatPassword && (
            <p style={{ color: 'red' }}>{errors.repeatPassword.message}</p>
          )}
        </label>
        <button className={classes.createUser__button} type="submit">
          Sign Up
        </button>
        <div className={classes.createUser__link}>
          Already have an account? <Link to="/signin">Sign In.</Link>
        </div>
        {isSuccess && (
          <p style={{ color: 'green' }}>User created successfully!</p>
        )}
        {isError && (
          <p style={{ color: 'red' }}>
            Error: {error?.data?.message || 'Такой пользователь уже существует'}
          </p>
        )}
      </form>
    </div>
  )
}

export default CreateUser
