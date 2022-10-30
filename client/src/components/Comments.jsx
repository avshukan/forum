import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Comment from './Comment';

function Comments({ comments }) {
  return (
    <ul className="list-unstyled ps-4 ps-md-5 sub-comment">
      {_.reverse(_.sortBy(comments, ['created_at'])).map((comment) => <Comment key={comment.id} comment={comment} />)}
    </ul>
  );
}

Comments.propTypes = {
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
  comments: [{}],
};

export default Comments;
