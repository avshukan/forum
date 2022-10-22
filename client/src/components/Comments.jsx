import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Commenter from './Commenter';

function Comments({ postId, comments, refreshPosts }) {
  return (
    <div className="ms-5">
      <Commenter postId={postId} refreshPosts={refreshPosts} />
      {_.reverse(_.sortBy(comments, ['created_at'])).map((comment) => <div id={comment.id}>{JSON.stringify(comment)}</div>)}
    </div>
  );
}

Comments.propTypes = {
  postId: PropTypes.number,
  comments: PropTypes.arrayOf(PropTypes.func),
  refreshPosts: PropTypes.func,
};

Comments.defaultProps = {
  postId: 0,
  comments: [],
  refreshPosts: () => { },
};

export default Comments;
