import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Commenter from './Commenter';
import Comment from './Comment';

function Comments({ postId, comments, refreshPosts }) {
  return (
    <div className="ms-5">
      <Commenter postId={postId} refreshPosts={refreshPosts} />
      {_.reverse(_.sortBy(comments, ['created_at'])).map((comment) => <Comment key={comment.id} comment={comment} refreshPosts={refreshPosts} />)}
    </div>
  );
}

Comments.propTypes = {
  postId: PropTypes.number,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      post_id: PropTypes.number,
      username: PropTypes.string,
      text: PropTypes.string,
      created_at: PropTypes.string,
    }),
  ),
  refreshPosts: PropTypes.func,
};

Comments.defaultProps = {
  postId: 0,
  comments: [{}],
  refreshPosts: () => { },
};

export default Comments;
