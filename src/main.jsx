import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CreatePost from './components/CreatePost.jsx'
import NotFound from './components/NotFound.jsx'
import EditPost from './components/EditPost.jsx'
import Comments from './components/Comments.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path="/create-post" element={<CreatePost/>} />
      <Route path="*" element={<NotFound/>} />
      <Route path="/edit/:postId" element={<EditPost/>} />
      <Route path="/comments/:postId" element={<Comments />} />
    </Routes>
  </BrowserRouter>
);