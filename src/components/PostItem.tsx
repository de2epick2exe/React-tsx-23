import React, {FC} from 'react';
import { Post } from '../store/models/Post';

interface PostItemProps{
    post : Post;
}


const PostItem: FC<PostItemProps> = ({post}) => {
    return (
        <div className='post'>
            {post.id}. {post.title}
            <button>delete</button>
        </div>
    );
};

export default PostItem;