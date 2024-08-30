export default function Post({ post }) {
  return (
    <div className="p-4 border rounded mb-2">
      <h3 className="text-lg font-bold">{post.title}</h3>
      <p>{post.caption}</p>
      {/* Add any additional post details you want to show */}
    </div>
  );
}
