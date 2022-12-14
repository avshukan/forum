import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { hideComments, showComments } from '../slices/visabilitySlice';

function –°ommentsCounter({ postId }) {
  const dispatch = useDispatch();

  const [post] = useSelector((store) => store.data.posts.filter(({ id }) => id === postId));

  const visibleComments = useSelector((store) => store.visability.comments);

  const isCommentsVisible = () => Boolean(visibleComments[postId]);

  const verb = isCommentsVisible() ? 'Hide' : 'Show';

  const onClick = () => (isCommentsVisible()
    ? dispatch(hideComments({ postId }))
    : dispatch(showComments({ postId })));

  return post?.comments?.length > 0
    ? (
      <small className="text-muted" role="button" onClick={onClick} style={{ cursor: 'pointer' }}>
        {`${verb} all ${post?.comments?.length} comments`}
      </small>
    )
    : <small className="text-muted">No comments</small>;
}

–°ommentsCounter.propTypes = {
  postId: PropTypes.number,
};

–°ommentsCounter.defaultProps = {
  postId: 0,
};

export default –°ommentsCounter;
