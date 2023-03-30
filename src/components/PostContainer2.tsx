
import React from 'react';
import { PostApi } from '../store/service/PostService';
import PostItem from './PostItem';

const PostContainer2 = () => {
    const {data: posts, error, isLoading} = PostApi.useFetchAllPostsQuery(5)    
    return (
        <div>
            <div className="post__list">
                {isLoading && <h1>posts loading ...</h1>}
                {error && <h1> error in loading posts</h1>}
                {posts && posts.map(post=>
                    <PostItem post={post}/>
                    )}
            </div>
        </div>
    );
};

export default PostContainer2;