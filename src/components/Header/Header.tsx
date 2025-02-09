import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import userPhoto from '../../assets/user.svg';
import {
  useAuth,
  useGetUserByUsernameQuery,
  useGetUserQuery,
  useLogoutMutation,
} from '../../redux/postsApi';
import classes from './Header.module.scss';
import { useEffect } from 'react';

const Header: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [logout] = useLogoutMutation();
  const { data: user, isLoading, error, refetch } = useGetUserQuery();
  const { data: userData } = useGetUserByUsernameQuery(user?.user?.username, {
    skip: !user?.user?.username,
  });

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      refetch(); // Обновляем пользователя после выхода
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  useEffect(() => {
    refetch();
  }, [isLoggedIn, refetch]); // Добавляем isLoggedIn, чтобы обновлялся пользователь

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin />
      </div>
    );
  }

  if (error && 'message' in error) {
    return <div>Error: {String(error.message)}</div>;
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
                {userData?.profile?.username || 'Unknown User'}
              </span>
              <img
                className={classes['header__profile-image']}
                src={userData?.profile?.image || userPhoto}
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
