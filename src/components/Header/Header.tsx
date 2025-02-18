import { Spin } from 'antd';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userPhoto from '../../assets/user.svg';
import {
  useAuth,
  useGetUserByUsernameQuery,
  useGetUserQuery,
  useLogoutMutation,
} from '../../redux/postsApi';
import classes from './Header.module.scss';

const Header: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [logout] = useLogoutMutation();
  const { data: user, isLoading, error } = useGetUserQuery();
  const username = user?.user?.username;
  const navigate = useNavigate();

  const { data: profile, refetch } = useGetUserByUsernameQuery(username, {
    skip: !username, 
  });

  useEffect(() => {
    if (username) {
      refetch(); 
    }
  }, [username, refetch]);

  const handleLogout = async () => {
    try {
      await logout().unwrap(); 
      navigate('/signin'); 
    } catch (err) {
      console.error('Logout failed:', err); 
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error?.data?.message || error?.message || 'Unknown error'}</div>;
  }

  return (
    <header className={classes.header}>
      {isLoggedIn ? (
        <div className={classes.header__logged}>
          <Link to="/posts" className={classes.header__title}>
            Realworld Blog
          </Link>
          <div className={classes.header__logged__out}>
            <Link to="/create-article" className={classes['header__create-article']}>
              Create article
            </Link>
            <Link to="/profile" className={classes['header__profile']}>
              <span className={classes['header__profile-text']}>
                {username || 'Unknown User'}
              </span>
              <img
                className={classes['header__profile-image']}
                src={profile?.profile?.image || userPhoto}
                alt="profile"
              />
            </Link>
            <button onClick={handleLogout} className={classes['header__logout']}>
              <span className={classes['header__logout-text']}>Logout</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <Link to="/posts" className={classes.header__title}>
            Realworld Blog
          </Link>
          <div className={classes.header__sign}>
            <Link to="/signin" className={classes['header__sign-in']}>
              Sign In
            </Link>
            <Link to="/create-user" className={classes['header__sign-up']}>
              Sign Up
            </Link>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;