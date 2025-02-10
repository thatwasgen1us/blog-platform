import { Spin } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import userPhoto from '../../assets/user.svg';
import {
  useAuth,
  useGetUserQuery,
  useGetUserByUsernameQuery,
  useLogoutMutation,
} from '../../redux/postsApi';
import classes from './Header.module.scss';

const Header: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [logout] = useLogoutMutation();
  const { data: user, isLoading, error } = useGetUserQuery();
  const { data: profile, refetch } = useGetUserByUsernameQuery(user?.user?.username, {
    skip: !user?.user?.username, // Запрос делается только если есть username
  });

  useEffect(() => {
    refetch(); // Обновить данные профиля при изменении username
  }, [user?.user?.username, refetch]);

  console.log('User:', user);
  console.log('Profile:', profile);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      refetch(); // Очистить данные после выхода
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
                {user?.user?.username || 'Unknown User'}
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
