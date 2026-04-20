import { Link } from 'react-router-dom';

export default function PollCard({ poll }) {
  const total = poll.options.reduce((s, o) => s + o.votes, 0);
  return (
    <div className="poll-card">
      <h3>{poll.title}</h3>
      <p className="meta">By {poll.creator?.username} · {total} votes</p>
      <div className="options-preview">
        {poll.options.slice(0, 3).map((o, i) => (
          <span key={i} className="option-chip">{o.text}</span>
        ))}
      </div>
      <Link to={`/poll/${poll._id}`} className="btn-link">View & Vote →</Link>
    </div>
  );
}