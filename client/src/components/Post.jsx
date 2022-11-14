import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Icon from '@mdi/react';
import { mdiDelete, mdiReply } from '@mdi/js';
import Comments from './Comments';
import { deletePost } from '../api';
import fetchDataThunk from '../slices/fetchDataThunk';
import Commenter from './Commenter';
import CommentsCounter from './CommentsCounter';
import { hidePoster, showCommenter } from '../slices/visabilitySlice';

function Post({ post }) {
  const {
    id,
    user_id: postUserId,
    username: postUsername,
    header,
    text,
    created_at: createdAt,
    comments,
  } = post;

  const dispatch = useDispatch();

  const visibleComments = useSelector((state) => state.visability.comments);

  const visibleCommenter = useSelector((state) => state.visability.commenter);

  const isCommentsVisible = () => Boolean(visibleComments[id]);

  const isCommenterVisible = () => visibleCommenter === id;

  const { token, id: userId } = useSelector(state => state.user);

  const createdAtDate = moment(createdAt);

  const canDelete = () => userId === postUserId;

  const onClickReply = () => {
    dispatch(hidePoster());
    dispatch(showCommenter({ postId: id }));
  };

  const onDelete = () => deletePost({ token, postId: id })
    .then((response) => {
      if (response.status === 204) {
        dispatch(fetchDataThunk(token));
      }
    });

  return (
    <li className="mt-4">
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <span className="pe-3">
            <img src="images/default.jpg" className="img-fluid avatar-post rounded-circle shadow" alt="img" />
          </span>
          <div className="d-flex flex-column">
            <h6 className="mb-0"><span className="media-heading text-dark">{postUsername}</span></h6>
            <small className="text-muted">{createdAtDate.fromNow()}</small>
            <CommentsCounter postId={id} />
          </div>
        </div>
        <div className="d-flex">
          {canDelete() && (
            <div className="cursor-pointer text-muted ms-3 strong-hover" role="button" onClick={onDelete}>
              <Icon path={mdiDelete} title="Reply post" size={1} color="red" />
              {' '}
              Delete
            </div>
          )}
          <div className="cursor-pointer text-muted ms-3" role="button" onClick={onClickReply}>
            <Icon path={mdiReply} title="Reply post" size={1} />
            {' '}
            Reply
          </div>
        </div>
      </div>
      <div className="mt-3 text-muted fst-italic bg-light p-3">
        <h6>{header}</h6>
        <p>{text}</p>
      </div>
      {isCommenterVisible() && <Commenter postId={id} />}
      {isCommentsVisible() && <Comments postId={id} comments={comments} />}
    </li>
  );
}

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    header: PropTypes.string,
    text: PropTypes.string,
    created_at: PropTypes.string,
    comments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      post_id: PropTypes.number,
      username: PropTypes.string,
      text: PropTypes.string,
      created_at: PropTypes.string,
    })),
  }),
};

Post.defaultProps = PropTypes.shape({
  post: {},
});

export default Post;
