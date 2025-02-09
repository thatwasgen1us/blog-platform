import { Pagination, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import user from '../../assets/user.svg'
import { useFavoriteArticleMutation, useGetPostsQuery, useUnfavoriteArticleMutation } from '../../redux/postsApi'
import { FavoriteIcon } from '../../utils/FavoriteIcon'
import { formatDate } from '../../utils/formatdate'
import classes from './PostLists.module.scss'

const handleImageError = (e) => {
  e.currentTarget.src = user
}

const PostLists = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { slug } = useParams()
  const limit = 5 // Количество постов на странице
  const offset = (currentPage - 1) * limit // Вычисляем offset
  const [favoriteArticle] = useFavoriteArticleMutation()
  const [unfavoriteArticle] = useUnfavoriteArticleMutation()
  const { data, isLoading, error, refetch } = useGetPostsQuery({ offset, limit })

  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }

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

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className={classes.postLists__container}>
      <ul className={classes.postLists}>
        {data?.articles?.map((data) => (
          <li className={classes.postLists__item} key={data.slug}>
            <div className={classes.postLists__item__header}>
              <div className={classes.postLists__item__header__title}>
                <div
                  className={classes.postLists__item__header__title__container}
                >
                  <Link
                    to={`/article/${data.slug}`}
                    className={classes.postLists__item__header__title__text}
                  >
                    {data.title}
                  </Link>
                  <button
                    className={classes.postLists__item__header__title__button}
                    onClick={data.favorited ? () => handleUnfavorite(data.slug) : () => handleFavorite(data.slug)}
                  >
                    <FavoriteIcon favorited={data.favorited} />
                  </button>
                  <span>{data.favoritesCount || 0}</span>
                </div>
                <ul
                  className={classes.postLists__item__header__title__tags__list}
                >
                  {data.tagList
                    .filter((tag) => tag !== '')
                    .map((tag, index) => (
                      <li
                        className={
                          classes.postLists__item__header__title__tags__item
                        }
                        key={data.slug + tag + index}
                      >
                        {tag}
                      </li>
                    ))}
                </ul>
              </div>
              <div className={classes.postLists__item__header__user}>
                <div className={classes.postLists__item__header__user__info}>
                  <span
                    className={
                      classes.postLists__item__header__user__info__name
                    }
                  >
                    {data.author.username}
                  </span>
                  <span
                    className={
                      classes.postLists__item__header__user__info__date
                    }
                  >
                    {formatDate(data.createdAt)}
                  </span>
                </div>
                <img
                  className={classes.user__image}
                  src={data.author.image}
                  alt="user"
                  onError={handleImageError}
                />
              </div>
            </div>
            <p className={classes.postLists__item__content}>
              {data.description}
            </p>
          </li>
        ))}
      </ul>
      <Pagination
        align="center"
        current={currentPage} // Устанавливаем текущую страницу
        pageSize={limit} // Количество постов на странице
        total={data?.articlesCount || 0}
        onChange={onPageChange}
        showSizeChanger={false} // Обработчик изменения страницы
        className={classes.postLists__pagination}
        itemRender={(page, type, originalElement) => {
          if (type === 'page') {
            return <a>{page}</a>
          }
          return originalElement
        }}
      />
    </div>
  )
}

export default PostLists
