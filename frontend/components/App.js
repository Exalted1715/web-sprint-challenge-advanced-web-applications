import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';
import axios from 'axios';

const articlesUrl = 'http://localhost:9000/api/articles';
const loginUrl = 'http://localhost:9000/api/login';

export default function App() {
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/');
  };

  const redirectToArticles = () => {
    navigate('/articles');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin();
  };

  

  const login = async ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);

    try {
      const response = await axios.post(loginUrl, {
        username: username,
        password: password
      });

      if (response.status === 200) {
        const authToken = response.data.token;
        localStorage.setItem('token', authToken);
        setMessage(response.data.message);
        redirectToArticles();
      } else {
        setMessage('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('Login failed');
    } finally {
      setSpinnerOn(false);
    }
  };

  const getArticles = async () => {
    
    setSpinnerOn(true);
  
    try {
      const authToken = localStorage.getItem('token');
      const response = await axios.get(articlesUrl, {
        headers: {
          Authorization: `${authToken}`
        }
      });
  
      if (response.status === 200) {
        setArticles(response.data.articles);
        setMessage(response.data.message);
      } else {
        setMessage('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      } else {
        setMessage('Failed to fetch articles');
      }
    } finally {
      setSpinnerOn(false);
    }
  };

  const postArticle = async (article) => {
    setSpinnerOn(true);
  
    try {
      const authToken = localStorage.getItem('token');
      const response = await axios.post(
        articlesUrl,
        {
          title: article.title.trim(),
          text: article.text.trim(),
          topic: article.topic
        },
        {
          headers: {
            Authorization: `${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.status === 201) {
        // Update articles without fetching again
        setArticles(prevArticles => [...prevArticles, response.data.article]);
        setMessage(response.data.message);
      } else {
        setMessage('Failed to post article');
      }
    } catch (error) {
      console.error('Error posting article:', error);
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      } else {
        setMessage('Failed to post article');
      }
    } finally {
      setSpinnerOn(false);
    }
  };
  

  const updateArticle = async ({ article_id, article }) => {
    setSpinnerOn(true);
  
    try {
      const authToken = localStorage.getItem('token');
      const response = await axios.put(
        `${articlesUrl}/${article_id}`,
        {
          title: article.title.trim(),
          text: article.text.trim(),
          topic: article.topic
        },
        {
          headers: {
            Authorization: `${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.status === 200) {
        // Update articles without fetching again
        setArticles(prevArticles =>
          prevArticles.map(prevArticle =>
            prevArticle.article_id === article_id ? { ...prevArticle, ...article } : prevArticle
          )
        );
        setMessage(response.data.message);
        setCurrentArticleId(null); // Reset currentArticleId
      } else {
        setMessage('Failed to update article');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      } else {
        setMessage('Failed to update article');
      }
    } finally {
      setSpinnerOn(false);
    }
  };
  
  

  const deleteArticle = async (article_id) => {
    setSpinnerOn(true);
  
    try {
      const authToken = localStorage.getItem('token');
      const response = await axios.delete(`${articlesUrl}/${article_id}`, {
        headers: {
          Authorization: `${authToken}`
        }
      });
  
      if (response.status === 200) {
        // Filter out the deleted article from the articles state
        setArticles(prevArticles => prevArticles.filter(article => article.article_id !== article_id));
        setMessage(response.data.message);
      } else {
        setMessage('Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      } else {
        setMessage('Failed to delete article');
      }
    } finally {
      setSpinnerOn(false);
    }
  };
  

  

  return (
    <>
      <Spinner show={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
  <Route path="/" element={<LoginForm login={login} />} />
  <Route path="/articles" element={
    <>
      <ArticleForm 
        postArticle={postArticle}
        updateArticle={updateArticle}
        setCurrentArticleId={setCurrentArticleId}
        currentArticle={articles.find(article => article.article_id === currentArticleId)} // Find the current article object based on its ID
      />
      <Articles
        articles={articles}
        getArticles={getArticles}
        deleteArticle={deleteArticle}
        setCurrentArticleId={setCurrentArticleId}
        currentArticleId={currentArticleId}
      />
    </>
  } />
</Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
