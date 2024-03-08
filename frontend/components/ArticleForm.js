import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const initialFormValues = { title: '', text: '', topic: '' };

export default function ArticleForm({
  postArticle,
  updateArticle,
  setCurrentArticleId,
  currentArticle
}) {
  const [values, setValues] = useState(initialFormValues);

  useEffect(() => {
    if (currentArticle) {
      setValues(currentArticle);
    } else {
      setValues(initialFormValues);
    }
  }, [currentArticle]);

  const onChange = evt => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const onSubmit = evt => {
    evt.preventDefault();
    const trimmedValues = {
      title: values.title.trim(),
      text: values.text.trim(),
      topic: values.topic
    };

    if (currentArticle) {
      updateArticle({ article_id: currentArticle.article_id, article: trimmedValues });
    } else {
      postArticle(trimmedValues); // Passing trimmedValues to postArticle function
    }
  };

  const isDisabled = () => {
    return !values.title.trim() || !values.text.trim() || !values.topic.trim();
  };

  return (
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? 'Edit Article' : 'Create Article'}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        {currentArticle && (
          <button onClick={() => setCurrentArticleId(null)}>Cancel edit</button>
        )}
      </div>
    </form>
  );
}

ArticleForm.propTypes = {
  postArticle: PropTypes.func.isRequired,
  updateArticle: PropTypes.func.isRequired,
  setCurrentArticleId: PropTypes.func.isRequired,
  currentArticle: PropTypes.shape({
    article_id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired
  })
};
