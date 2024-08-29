export default function User({ user }) {
  return (
    <div className="p-4 border rounded mb-2">
      <img
        src={user.avatar}
        alt={user.username}
        className="w-10 h-10 rounded-full"
      />
      <h3 className="text-lg font-bold">{user.username}</h3>
      <p>{user.description}</p>
    </div>
  );
}
