async function getTablesLengthChecker(dbBefore) {
  const usersBefore = await dbBefore('users');
  const postsBefore = await dbBefore('posts');
  const commentsBefore = await dbBefore('comments');

  const result = async (dbAfter, delta) => {
    const { usersDelta, postsDelta, commentsDelta } = delta;
    const usersAfter = await dbAfter('users');
    const postsAfter = await dbAfter('posts');
    const commentsAfter = await dbAfter('comments');
    expect(usersAfter.length).toBe(usersBefore.length + usersDelta);
    expect(postsAfter.length).toBe(postsBefore.length + postsDelta);
    expect(commentsAfter.length).toBe(commentsBefore.length + commentsDelta);
  };

  return result;
}

module.exports = getTablesLengthChecker;
