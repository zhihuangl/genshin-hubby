import React, { useState, useEffect } from 'react';
import { supabase } from '../../client';
import { useParams } from 'react-router-dom';
import Nav from './Nav';

const Comments = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        // Fetch the specific post from supabase
        const fetchPost = async () => {
            try {
                const { data, error } = await supabase.from('posts').select('*').eq('id', postId);

                if (error) {
                    console.error('Error fetching post:', error);
                } else if (data !== null && data.length > 0) {
                    const selectedPost = data[0];
                    setPost({
                        post_title: selectedPost.post_title,
                        post_text: selectedPost.post_text,
                        genshin_character: selectedPost.genshin_character,
                    });
                } else {
                    // Handle case where no data is returned
                    console.error('No data found for post ID:', postId);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        // Fetch comments for the specific post from supabase
        const fetchComments = async () => {
            try {
                const { data, error } = await supabase.from('comments').select('*').eq('post_id', postId);

                if (error) {
                    console.error('Error fetching comments:', error);
                } else {
                    setComments(data || []);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchPost();
        fetchComments();
    }, [postId]);

    const handleAddComment = async () => {
        // Add a new comment to the supabase.comments table
        try {
            const { data, error } = await supabase
                .from('comments')
                .insert([{ post_id: postId, comment_text: newComment }]);
            window.location.href = `/comments/${postId}`;
            if (error) {
                console.error('Error adding comment:', error);
            } else if (data && data.length > 0) {
                // Update the state to include the new comment
                setComments((prevComments) => [...prevComments, data[0]]);
                // Clear the input field
                setNewComment('');
            } else {
                console.error('No data returned after adding comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const clearComments = async () => {
        try {
            // Delete all comments for the specific post from the supabase.comments table
            const { data, error } = await supabase
                .from('comments')
                .delete()
                .eq('post_id', postId);

            if (error) {
                console.error('Error clearing comments:', error);
            } else {
                // Update the state to remove all comments
                setComments([]);
            }
        } catch (error) {
            console.error('Error clearing comments:', error);
        }
    };


    return (
        <>
            <Nav />
            <div className='comments'>
                <h1>Post Comments</h1>
                <div className='see-through'>
                    {post && (
                        <div className="post-info">
                            <h2>{post.genshin_character} Posted: </h2>
                            <h3>{post.post_title}</h3>
                            <p>{post.post_text}</p>

                        </div>
                    )}
                    <br />
                    <h3>Comments for Post:</h3>
                    {comments.length > 0 ? (
                        <div className="comments-list">
                            {comments.map((comment, index=1) => (
                                <p key={comment.id}>{index++}. {comment.comment_text}</p>
                            ))}
                        </div>
                    ) : (
                        <p>No comments for this post yet.</p>
                    )}

                    <div className="add-comment-container">
                        <textarea
                            placeholder="Leave a comment"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <br />
                        <button className="add-comment-button" onClick={handleAddComment}>
                            Add Comment
                        </button>
                        <button className="clear-comment" onClick={clearComments}>
                            Clear Comments
                        </button>
                    </div>
                </div>
            </div>

        </>

    );
};

export default Comments;
