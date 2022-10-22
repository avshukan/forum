import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

function Comments({ comments, refreshPosts }) {
  return (
    <div className="ms-5">
      {_.reverse(_.sortBy(comments, ['created_at'])).map((comment) => <div>{JSON.stringify(comment)}</div>)}
    </div>
  );
}

Comments.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.func),
  refreshPosts: PropTypes.func,
};

Comments.defaultProps = {
  comments: [],
  refreshPosts: () => { },
};

export default Comments;
