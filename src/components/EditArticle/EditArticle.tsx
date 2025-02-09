import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetArticleQuery, useUpdateArticleMutation } from '../../redux/postsApi';
import classes from './EditArticle.module.scss';

interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
}


const EditArticle = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetArticleQuery(slug || '');
  const [updateArticle] = useUpdateArticleMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>(['']);

  useEffect(() => {
    if (data?.article) {
      setTitle(data.article.title);
      setDescription(data.article.description);
      setBody(data.article.body);
      setTags(data.article.tagList || ['']);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!slug) {
      alert('Error: Missing article slug.');
      return;
    }

    const validTags = tags.filter(tag => tag.trim() !== '');

    const articleData = {
      slug,
      title,
      description,
      body,
      tagList: validTags,
    };

    try {
      await updateArticle(articleData).unwrap();
      navigate('/posts');
    } catch (err) {
      console.error('Failed to update article:', err);
      alert('Failed to update article. Please try again.');
    }
  };

  const handleAddTag = (): void => setTags([...tags, '']);

  const handleDeleteTag = (index: number): void => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags.length ? newTags : ['']);
  };

  const handleTagChange = (index: number, value: string): void => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, index: number): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tags[index].trim() !== '') {
        handleAddTag();
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin />
      </div>
    );
  }

  if (error) {
    return <div>Error: {(error as any)?.data?.message || 'Failed to load article.'}</div>;
  }

  return (
    <div>
      <form className={classes.editArticleForm} onSubmit={handleSubmit}>
        <h1 className={classes.editArticleForm__title}>Edit Article</h1>
        <label className={classes.editArticleForm__label}>
          Title
          <input type="text" className={classes.editArticleForm__input} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label className={classes.editArticleForm__label}>
          Short description
          <input type="text" className={classes.editArticleForm__shortDescription} placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label className={classes.editArticleForm__label}>
          Text
          <textarea className={classes.editArticleForm__text} placeholder="Text" value={body} onChange={(e) => setBody(e.target.value)} required />
        </label>
        <ul className={classes.editArticleForm__tags}>
          <li>Tags</li>
          {tags.map((tag, index) => (
            <li key={index} className={classes.editArticleForm__item}>
              <input type="text" className={classes.editArticleForm__tagInput} placeholder="Tag" value={tag} onChange={(e) => handleTagChange(index, e.target.value)} onKeyDown={(e) => handleKeyPress(e, index)} />
              {tags.length > 1 && (
                <button type="button" className={classes.editArticleForm__deleteButton} onClick={() => handleDeleteTag(index)}>Delete</button>
              )}
              {index === tags.length - 1 && (
                <button type="button" className={classes.editArticleForm__addButton} onClick={handleAddTag}>Add tag</button>
              )}
            </li>
          ))}
        </ul>
        <button type="submit" className={classes.editArticleForm__sendButton}>Send</button>
      </form>
    </div>
  );
};

export default EditArticle;
