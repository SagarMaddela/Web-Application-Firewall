import React, { useEffect, useState } from 'react';

function Comments() {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/comments')
            .then(response => response.json())
            .then(data => setComments(data.comments))
            .catch(error => console.error(error));
    }, []);

    const postcomment = async (e) => {
        e.preventDefault();
        const comment = {
            Name: e.target.Name.value,
            text: e.target.text.value
        };

        const response = await fetch('http://localhost:5000/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(comment)
        });

        const data = await response.json();

        if (response.ok) {
            window.location.reload();
        } else {
            console.error(data.message);
        }
    };

    return (
        <div>
            <h1>Post a Comment</h1>
            <form method="post" onSubmit={postcomment}>
                <input type="text" name="Name" placeholder="Name" required />
                <input type="text" name="text" placeholder="Comment" required />
                <button type="submit">Post Comment</button>
            </form>

            <h1>Comments</h1>

            {comments.map(comment => (
                <div key={comment._id}>
                    <h3>Name: {comment.Name}</h3>
                    
                    {/* XSS Vulnerability - Rendering raw HTML */}
                    <p dangerouslySetInnerHTML={{ __html: comment.text }}></p>
                </div>
            ))}
        </div>
    );
}

export default Comments;
