import { useNavigate, useParams } from 'react-router-dom'
import userPhoto from '../../assets/user.svg'
import {
  useAuth,
  useDeleteArticleMutation,
  useFavoriteArticleMutation,
  useGetArticleQuery,
  useGetUserQuery,
  useUnfavoriteArticleMutation,
} from '../../redux/postsApi'
import { formatDate } from '../../utils/formatdate'
import { Spin } from 'antd'
import classes from './Post.module.scss'
import { useEffect } from 'react'
import { FavoriteIcon } from '../../utils/FavoriteIcon'

const Post = () => {
  const { isLoggedIn } = useAuth()
  const { slug } = useParams()
  const { data: user } = useGetUserQuery()
  const { data, error, isLoading, refetch } = useGetArticleQuery(slug)
  const [deleteArticle] = useDeleteArticleMutation()
  const [favoriteArticle] = useFavoriteArticleMutation()
  const [unfavoriteArticle] = useUnfavoriteArticleMutation()

  const navigate = useNavigate()

  const isAuthor = user?.user?.username === data?.article?.author.username

  const handleFavorite = async (slug: string) => {
    try {
      await favoriteArticle(slug).unwrap() // Ждем, пока запрос выполнится
      refetch()
    } catch (error) {
      console.error("Ошибка при добавлении в избранное:", error)
    }
  }
  
  const handleUnfavorite = async (slug: string) => {
    try {
      await unfavoriteArticle(slug).unwrap() // Ждем, пока запрос выполнится
      refetch()
    } catch (error) {
      console.error("Ошибка при удалении из избранного:", error)
    }
  }


  useEffect(() => {
    refetch()
  }, [slug])

  const onEdit = () => {
    refetch()
    navigate(`/articles/${slug}/edit`)
  }

  const onDelete = () => {
    refetch()
    deleteArticle(slug)
    navigate('/posts')
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (isLoading) {
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
  }

  return (
    <>
      <div className={classes.post}>
        <div className={classes.post__item}>
          <div className={classes.postLists__item__header}>
            <div className={classes.postLists__item__header__title}>
              <div
                className={classes.postLists__item__header__title__container}
              >
                <h3 className={classes.postLists__item__header__title__text}>
                  {data?.article?.title}
                </h3>
                <button
                    className={classes.postLists__item__header__title__button}
                    onClick={data?.article?.favorited ? () => handleUnfavorite(data?.article?.slug) : () => handleFavorite(data?.article?.slug)}
                  >
                    <FavoriteIcon favorited={data?.article?.favorited} />
                  </button>
                <span className={classes.postLists__item__header__title__span}>
                  {data?.article?.favoritesCount || 0}
                </span>
              </div>
              <ul
                className={classes.postLists__item__header__title__tags__list}
              >
                {data?.article?.tagList
                  .filter((tag) => tag !== '')
                  .map((tag, index) => (
                    <li
                      className={
                        classes.postLists__item__header__title__tags__item
                      }
                      key={data?.slug + tag + index}
                    >
                      {tag}
                    </li>
                  ))}
              </ul>
            </div>
            <div className={classes.postLists__item__header__user}>
              <div className={classes.postLists__item__header__user__info}>
                <span
                  className={classes.postLists__item__header__user__info__name}
                >
                  {data?.article?.author.username}
                </span>
                <span
                  className={classes.postLists__item__header__user__info__date}
                >
                  {formatDate(data?.article?.createdAt)}
                </span>
              </div>
              <img
                src={data?.article?.author.image || userPhoto}
                alt="user"
                className={classes.postLists__item__header__user__info__image}
              />
            </div>
          </div>
          <div className={classes.postLists__item__content}>
            <p>{data?.article?.description}</p>
            {isAuthor && isLoggedIn && (
              <div className={classes.postLists__item__content__buttons}>
                <button
                  className={classes.postLists__item__content__buttons__delete}
                  onClick={onDelete}
                >
                  Delete
                </button>
                <button
                  className={classes.postLists__item__content__buttons__edit}
                  onClick={onEdit}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={classes.post__title}>
          <p>{data?.article?.body}</p>
        </div>
      </div>
    </>
  )
}

export default Post
