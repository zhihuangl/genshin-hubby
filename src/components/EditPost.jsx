import React, { useState, useEffect } from 'react';
import { supabase } from '../../client';
import { useParams } from 'react-router-dom';
import Nav from './Nav';

const EditPost = () => {
    const { postId } = useParams();
    const [post, setPost] = useState({
        post_title: '',
        post_text: '',
        genshin_character: '', //cannot be changed a bit hard
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data, error } = await supabase.from('posts').select('*').eq('id', postId);

                if (error) {
                    console.error('Error fetching post:', error);
                } else {
                    const selectedPost = data[0];
                    setPost({
                        post_title: selectedPost.post_title,
                        post_text: selectedPost.post_text,
                        genshin_character: selectedPost.genshin_character,
                    });
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [postId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPost((prevPost) => ({ ...prevPost, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { error } = await supabase
                .from('posts')
                .update({
                    post_title: post.post_title,
                    post_text: post.post_text,
                })
                .eq('id', postId);

            if (error) {
                console.error('Error updating post:', error);
            } else {
                window.location.href = `/`;
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    return (
        <>
            <Nav />
            <div className='edit-post'>
               <h2>Edit Post</h2> 
                <div className='see-through'>
                    <h3>{post.genshin_character} Posted: </h3>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Title:
                            <br />
                            <input
                                type="text"
                                name="post_title"
                                value={post.post_title}
                                onChange={handleInputChange}
                            />
                        </label>
                        <br />
                        <br />
                        <label>
                            Content:
                            <br />
                            <textarea
                                name="post_text"
                                value={post.post_text}
                                onChange={handleInputChange}
                            />
                        </label>
                        <br />
                        <button type="submit">Update Post</button>
                    </form>
                </div>
                
                
            </div>
        </>

    );
};

export default EditPost;
