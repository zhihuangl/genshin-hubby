import React, { useState, useEffect } from 'react';
import Nav from './components/Nav';
import { supabase } from '../client';
import { Link } from 'react-router-dom';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('timeCreated');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    // Fetch posts from supabase.posts
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from('posts').select('*');

        if (error) {
          console.error('Error fetching posts:', error);
        } else {
          setPosts(data || []);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      // Delete the post from supabase.posts
      const { error } = await supabase.from('posts').delete().eq('id', postId);

      if (error) {
        console.error('Error deleting post:', error);
      } else {
        // Update the state to reflect the deletion
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      // Fetch the current upvotes count for the post
      const { data, error } = await supabase
        .from('posts')
        .select('upvotes')
        .eq('id', postId);

      if (error) {
        console.error('Error fetching upvotes:', error);
        return;
      }

      const currentUpvotes = data[0]?.upvotes || 0;

      // Increment the upvotes for the post in supabase.posts
      const { updateData, updateError } = await supabase
        .from('posts')
        .update({ upvotes: currentUpvotes + 1 })
        .eq('id', postId);

      if (updateError) {
        console.error('Error updating upvotes:', updateError);
      } else {
        // Update the state to reflect the upvote
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, upvotes: currentUpvotes + 1 } : post
          )
        );
      }
    } catch (error) {
      console.error('Error updating upvotes:', error);
    }
  };

  // Function to toggle read more/less
  const toggleReadMore = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, showFullText: !post.showFullText } : post
      )
    );
  };

  const filteredPosts = posts.filter((post) =>
    post.post_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortOption === 'timeCreated') {
      return sortOrder === 'asc' ? a.created_at - b.created_at : b.created_at - a.created_at;
    } else if (sortOption === 'upvotes') {
      return sortOrder === 'asc' ? a.upvotes - b.upvotes : b.upvotes - a.upvotes;
    }
    return 0;
  });

  const getTimeElapsed = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const elapsedMilliseconds = now - createdDate;

    const seconds = Math.floor(elapsedMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `Posted ${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
      return `Posted ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes > 0) {
      return `Posted ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return `Posted just now`;
    }
  };

  return (
    <>
      <Nav />
      <div className='app'>
        <h1>Posts</h1>
        <h4>Search Bar</h4>
        <input
          type="text"
          placeholder="Search by post title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div>
          <h4>Sort By:</h4>
          <button onClick={() => setSortOption('timeCreated')}>Time Created</button>
          <button onClick={() => setSortOption('upvotes')}>Upvote Count</button>
        </div>
        <div className='post-card-container'>
          {sortedPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div>
                <p>{getTimeElapsed(post.created_at)}</p>
              </div>
              <div className='post-imgs'>
                <img src={`/media/character_icons/${post.genshin_character.replace(' ', '_')}_Icon.png`} alt={`${post.genshin_character}`} />
                <img src={`/media/region_icons/${post.region}.png`} alt={`${post.region}`}/>
                <img src={`/media/vision_icons/${post.vision}.png`} alt={`${post.vision}`}/>
              </div>
              <h2>
                  {post.genshin_character} ({post.region}) Posted:
                </h2>
              <div className="post-content">
                <h3>{post.post_title}</h3>
                <p>
                  {post.showFullText || post.post_text.length <= 200
                    ? post.post_text
                    : `${post.post_text.slice(0, 200)}...`}
                </p>
                {post.post_text.length > 200 && (
                  <button className="read-more-button" onClick={() => toggleReadMore(post.id)}>
                    {post.showFullText ? 'Read Less' : 'Read More'}
                  </button>
                )}
                <p>Upvotes: {post.upvotes}</p>
              </div>
              {/* Delete, Edit, and Upvote buttons */}
              <div>
                <Link className='edit-button' to={`/edit/${post.id}`}>Edit</Link>
                <button onClick={() => handleDelete(post.id)}>Delete</button>
                <button onClick={() => handleUpvote(post.id)}>Upvote</button>
                <Link className='comments-button' to={`/comments/${post.id}`}>View Comments</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
