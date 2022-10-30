import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Commenter from './Commenter';
import Comment from './Comment';

function Comments({ postId, comments }) {
  return (
    // <div className="ms-5">
    //   <Commenter postId={postId} />
    //   {_.reverse(_.sortBy(comments, ['created_at'])).map((comment) => <Comment key={comment.id} comment={comment} />)}
    // </div>
    <ul className="list-unstyled ps-4 ps-md-5 sub-comment">
      {_.reverse(_.sortBy(comments, ['created_at'])).map((comment) => <Comment key={comment.id} comment={comment} />)}
    </ul>
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
};

Comments.defaultProps = {
  postId: 0,
  comments: [{}],
};

export default Comments;
