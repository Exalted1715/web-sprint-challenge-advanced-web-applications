import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function Articles({ articles, getArticles, deleteArticle, setCurrentArticleId, currentArticleId }) {
  useEffect(() => {
    // Fetch articles on component mount
    getArticles();
  }, []);

  // Check if token exists, otherwise navigate to login
  if (!localStorage.getItem('token')) {
    return <Navigate to="/" />;
  }

  return (
    <div className="articles">
      <h2>Articles</h2>
      {
        articles.length === 0
          ? 'No articles yet'
          : articles.map(art => (
              <div className="article" key={art.article_id}>
                <div>
                  <h3>{art.title}</h3>
                  <p>{art.text}</p>
                  <p>Topic: {art.topic}</p>
                </div>
                <div>
                  <button onClick={() => setCurrentArticleId(art.article_id)}>Edit</button>
                  <button onClick={() => deleteArticle(art.article_id)}>Delete</button>
                </div>
              </div>
            ))
      }
    </div>
  );
}

Articles.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      article_id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      topic: PropTypes.string.isRequired
    })
  ).isRequired,
  getArticles: PropTypes.func.isRequired,
  deleteArticle: PropTypes.func.isRequired,
  setCurrentArticleId: PropTypes.func.isRequired,
  currentArticleId: PropTypes.number // can be undefined or null
};
