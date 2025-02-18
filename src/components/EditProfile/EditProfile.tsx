import classes from './EditProfile.module.scss'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, UserProfile } from '../../interface/interface'
import { Spin } from 'antd'
import { useDispatch } from 'react-redux'
import {
  postsApi,
  useGetUserQuery,
  useUpdateUserMutation,
} from '../../redux/postsApi'

const EditProfile: React.FC = () => {
  const { data: user, isLoading, isError, refetch } = useGetUserQuery()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const { register, handleSubmit, reset } = useForm<UserProfile>()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.user) {
      reset({
        username: user.user.username || '',
        email: user.user.email || '',
        bio: user.user.bio || '',
        image: user.user.image || '',
      })
    }
  }, [user, reset])

  // ...

  const dispatch = useDispatch()

  const onSubmit: SubmitHandler<UserProfile> = async (data) => {
  const userData = {
    user: {
      email: data.email?.trim(),
      username: data.username?.trim(),
      bio: data.bio?.trim(),
      image: data.image?.trim(),
    },
  }

  try {
    const response = await updateUser(userData as unknown as User).unwrap();

    dispatch(
      postsApi.util.updateQueryData('getUser', undefined, (draft) => {
        if (draft.user) {
          draft.user.username = response.user.username || draft.user.username;
          draft.user.email = response.user.email || draft.user.email;
          draft.user.image = data.image || draft.user.image;
        }
      })
    );

    console.log('Profile updated successfully!');
    await refetch();
    navigate('/posts');
  } catch (err) {
    console.error('Failed to update profile:', err);
    alert('Failed to update profile. Please try again later.');
  }
}

  if (isLoading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin />
      </div>
    )
  if (isError) return <div>Error loading user data.</div>

  return (
    <div className={classes.editProfile}>
      <form
        className={classes.editProfile__form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1>Edit Profile</h1>
        <div className={classes.editProfile__form__field}>
          <label htmlFor="username">
            Username
            <input
              type="text"
              id="username"
              placeholder="Username"
              {...register('username', { required: true })}
            />
          </label>
          <label htmlFor="email">
            Email
            <input
              type="email"
              id="email"
              placeholder="Email"
              {...register('email', { required: true })}
            />
          </label>
          <label htmlFor="bio">
            Bio
            <input
              type="text"
              id="bio"
              placeholder="Bio"
              {...register('bio')}
            />
          </label>
          <label htmlFor="image">
            Avatar image (URL)
            <input
              type="url"
              id="image"
              placeholder="Avatar image (URL)"
              {...register('image')}
            />
          </label>
        </div>
        <button type="submit" disabled={isUpdating}>
          Save
        </button>
      </form>
    </div>
  )
}

export default EditProfile
