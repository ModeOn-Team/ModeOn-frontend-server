const Comments = ({ className, comment }) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg p-4 border border-gray-200 ${className}`}
    >
      <div className="flex justify-between items-start gap-2">
        {/* 댓글 내용 */}
        <div className="text-gray-800 font-medium">{comment.content}</div>

        {/* 작성자 & 날짜 */}
        <div className="text-gray-500 text-sm text-right">
          <div>{comment.user.username}</div>
          <div>{new Date(comment.createdAt).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
