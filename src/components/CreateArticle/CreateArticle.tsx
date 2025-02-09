import { useState, ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import classes from './CreateArticle.module.scss'
import { useNavigate } from 'react-router-dom'
import { useAddArticleMutation } from '../../redux/postsApi'
import { ArticleData, FormData } from '../../interface/interface'


const CreateArticle = () => {
  const navigate = useNavigate()
  const [tags, setTags] = useState<string[]>([''])
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    body: '' // изменено с text на body
  })
  const [addArticle, { isLoading }] = useAddArticleMutation()

  const handleAddTag = (): void => {
    setTags([...tags, ''])
  }

  const handleDeleteTag = (index: number): void => {
    const newTags = tags.filter((_, i) => i !== index)
    setTags(newTags.length ? newTags : [''])
  }

  const handleTagChange = (index: number, value: string): void => {
    const newTags = [...tags]
    newTags[index] = value
    setTags(newTags)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>, index: number): void => {
    if (e.key === 'Enter') {
      e.preventDefault() 
      if (tags[index].trim() !== '') { 
        handleAddTag()
      }
    }
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

    const validTags = tags.filter(tag => tag.trim() !== '')
    
    // Формируем данные в формате, который ожидает API
    const articleData = {
      article: {
        ...formData,
        tagList: validTags.filter(Boolean) // фильтруем пустые теги
      }
    }

    try {
      await addArticle(articleData as unknown as Omit<ArticleData, "slug">).unwrap()
      setFormData({
        title: '',
        description: '',
        body: ''
      })
      setTags([''])
      navigate('/posts')
    } catch (error) {
      console.error('Failed to create article:', error)
      alert('Failed to create article. Please try again.')
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div>
      <form className={classes.createArticleForm} onSubmit={handleSubmit}>
        <h1 className={classes.createArticleForm__title}>Create new article</h1>
        <label className={classes.createArticleForm__label}>
          Title
          <input
            type="text"
            name="title"
            className={classes.createArticleForm__input}
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </label>
        <label className={classes.createArticleForm__label}>
          Short description
          <input
            type="text"
            name="description"
            className={classes.createArticleForm__shortDescription}
            placeholder="Short description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </label>
        <label className={classes.createArticleForm__label}>
          Text
          <textarea
            name="body"
            className={classes.createArticleForm__text}
            placeholder="Text"
            value={formData.body}
            onChange={handleInputChange}
            required
          />
        </label>
        <ul className={classes.createArticleForm__tags}>
          <li>Tags</li>
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <li key={index} className={classes.createArticleForm__item}>
                <input
                  type="text"
                  className={classes.createArticleForm__tagInput}
                  placeholder="Tag"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, index)}
                />
                {tags.length > 1 && (
                  <button
                    type="button"
                    className={classes.createArticleForm__deleteButton}
                    onClick={() => handleDeleteTag(index)}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                )}
                {index === tags.length - 1 && (
                  <button
                    type="button"
                    className={classes.createArticleForm__addButton}
                    onClick={handleAddTag}
                    disabled={isLoading}
                  >
                    Add tag
                  </button>
                )}
              </li>
            ))
          ) : (
            <li className={classes.createArticleForm__item}>
              <input
                type="text"
                className={classes.createArticleForm__tagInput}
                placeholder="Tag"
                onChange={(e) => handleTagChange(0, e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, 0)}
              />
              <button
                type="button"
                className={classes.createArticleForm__addButton}
                onClick={handleAddTag}
                disabled={isLoading}
              >
                Add tag
              </button>
            </li>
          )}
        </ul>

        <button
          type="submit"
          className={classes.createArticleForm__sendButton}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default CreateArticle