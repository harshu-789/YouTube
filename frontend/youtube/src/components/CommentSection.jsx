import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import store from '../store/authStore';
import axios from '../lib/axios';

function CommentSection({ videoId, comments: initialComments }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const { user } = store();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await axios.post('/comments', {
        content: newComment,
        videoId,
      });
      setComments([data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`/comments/${commentId}`);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const { data } = await axios.put(`/comments/${commentId}`, {
        content: editContent,
      });

      setComments(
        comments.map((comment) =>
          comment._id === commentId ? { ...comment, content: data.content } : comment
        )
      );
      handleCancelEdit();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">
        {comments.length} Comments
      </h3>

      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-4">
            <img
              src={user.avatar || 'https://via.placeholder.com/40'}
              alt={user.username}
              className="h-10 w-10 rounded-full"
            />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border-b border-gray-200 focus:border-blue-500 focus:outline-none py-2"
            />
          </div>
          <div className="flex justify-end gap-4 mt-2">
            <button
              type="button"
              onClick={() => setNewComment('')}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-full disabled:opacity-50"
            >
              Comment
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4">
            <img
              src={comment.user.avatar || 'https://via.placeholder.com/40'}
              alt={comment.user.username}
              className="h-10 w-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{comment.user.username}</span>
                <span className="text-sm text-gray-600">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {editingCommentId === comment._id ? (
                <div className="mt-1">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1"
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleSaveEdit(comment._id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-sm text-gray-600 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-1">{comment.content}</p>
              )}

              {user?._id === comment.user._id && editingCommentId !== comment._id && (
                <div className="flex gap-4 text-sm mt-2">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
