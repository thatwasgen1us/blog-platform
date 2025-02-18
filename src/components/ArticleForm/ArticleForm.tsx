import {
  useState,
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useAddArticleMutation,
  useGetArticleQuery,
  useUpdateArticleMutation,
} from '../../redux/postsApi'
import classes from './ArticleForm.module.scss'
import { Spin } from 'antd'

interface FormData {
  title: string
  description: string
  body: string
}

interface Article {
  title: string
  description: string
  body: string
  tagList: string[]
}

interface ApiResponse {
  article: Article
}

const ArticleForm = () => {
  const { slug } = useParams<{ slug?: string }>()
  const navigate = useNavigate()
  const isEditMode = !!slug

  const {
    data,
    error,
    isLoading: isArticleLoading,
  } = useGetArticleQuery(slug || '', { skip: !slug }) as {
    data?: ApiResponse
    error?: any
    isLoading: boolean
  }

  const [addArticle, { isLoading: isAddLoading }] = useAddArticleMutation()
  const [updateArticle, { isLoading: isUpdateLoading }] =
    useUpdateArticleMutation()

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    body: '',
  })
  const [tags, setTags] = useState<string[]>([''])

  useEffect(() => {
    if (isEditMode && data) {
      setFormData({
        title: data.article.title,
        description: data.article.description,
        body: data.article.body,
      })
      setTags(data.article.tagList.length > 0 ? data.article.tagList : [''])
    }
  }, [data, isEditMode])

  const handleAddTag = (): void => setTags([...tags, ''])
  const handleDeleteTag = (index: number): void => {
    const newTags = tags.filter((_, i) => i !== index)
    setTags(newTags.length ? newTags : [''])
  }
  const handleTagChange = (index: number, value: string): void => {
    const newTags = [...tags]
    newTags[index] = value
    setTags(newTags)
  }
  const handleKeyPress = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (tags[index].trim() !== '') {
        handleAddTag()
      }
    }
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = (): boolean => {
    return (
      formData.title.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.body.trim() !== ''
    )
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!validateForm()) {
      alert('Please fill in all required fields')
      return
    }

    const validTags = tags.filter((tag) => tag.trim() !== '')

    const articleData = {
      article: {
        title: formData.title,
        description: formData.description,
        body: formData.body,
        tagList: validTags,
      },
    }

    try {
      if (isEditMode) {
        await updateArticle({
          slug: slug!,
          article: articleData.article,
        }).unwrap()
      } else {
        await addArticle(articleData).unwrap()
      }
      navigate('/posts')
    } catch (error) {
      console.error('Failed to save article:', error)
      alert('Failed to save article. Please try again.')
    }
  }

  if (isArticleLoading) {
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
    return (
      <div>
        Error: {(error as any)?.data?.message || 'Failed to load article.'}
      </div>
    )
  }

  return (
    <div>
      <form className={classes.articleForm} onSubmit={handleSubmit}>
        <h1 className={classes.articleForm__title}>
          {isEditMode ? 'Edit Article' : 'Create New Article'}
        </h1>
        <label className={classes.articleForm__label}>
          Title
          <input
            type="text"
            name="title"
            className={classes.articleForm__input}
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </label>
        <label className={classes.articleForm__label}>
          Short description
          <input
            type="text"
            name="description"
            className={classes.articleForm__shortDescription}
            placeholder="Short description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </label>
        <label className={classes.articleForm__label}>
          Text
          <textarea
            name="body"
            className={classes.articleForm__text}
            placeholder="Text"
            value={formData.body}
            onChange={handleInputChange}
            required
          />
        </label>
        <ul className={classes.articleForm__tags}>
          <li>Tags</li>
          {tags.map((tag, index) => (
            <li key={index} className={classes.articleForm__item}>
              <input
                type="text"
                className={classes.articleForm__tagInput}
                placeholder="Tag"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, index)}
              />
              {tags.length > 1 && (
                <button
                  type="button"
                  className={classes.articleForm__deleteButton}
                  onClick={() => handleDeleteTag(index)}
                  disabled={isAddLoading || isUpdateLoading}
                >
                  Delete
                </button>
              )}
              {index === tags.length - 1 && (
                <button
                  type="button"
                  className={classes.articleForm__addButton}
                  onClick={handleAddTag}
                  disabled={isAddLoading || isUpdateLoading}
                >
                  Add tag
                </button>
              )}
            </li>
          ))}
        </ul>
        <button
          type="submit"
          className={classes.articleForm__sendButton}
          disabled={isAddLoading || isUpdateLoading}
        >
          {isAddLoading || isUpdateLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default ArticleForm
