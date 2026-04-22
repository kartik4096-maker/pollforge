import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../config';

export default function Home() {
  const [polls, setPolls] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetch(`${API}/api/polls`)
      .then(r => r.json())
      .then(setPolls)
      .catch(() => {});
  }, []);

  const total = (poll) => poll.options.reduce((s, o) => s + o.votes, 0);

  return (
    <div className="container">
      {!user && (
        <div className="hero">
          <h1>Vote on things<br/>that <span>matter</span></h1>
          <p>Create polls, invite friends, and get real-time results. No sign-up needed to vote.</p>
          <Link to="/register" className="btn-primary" style={{display:'inline-block', textDecoration:'none', padding:'0.85rem 2.5rem', borderRadius:'50px', fontSize:'1rem'}}>
            Get Started →
          </Link>
        </div>
      )}

      <div className="section-title" style={{marginTop: user ? '2rem' : '0'}}>
        <h2>Active Polls</h2>
        <span>{polls.length} polls</span>
      </div>

      {polls.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🗳</div>
          <h3>No polls yet</h3>
          <p>Be the first to create a poll!</p>
        </div>
      ) : (
        <div className="polls-grid">
          {polls.map((poll, i) => (
            <Link
              to={`/poll/${poll._id}`}
              className="poll-card"
              key={poll._id}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <h3>{poll.title}</h3>
              <p className="poll-meta">By {poll.creator?.username}</p>
              <div className="poll-options-preview">
                {poll.options.slice(0, 3).map((o, j) => (
                  <span className="option-tag" key={j}>{o.text}</span>
                ))}
              </div>
              <div className="vote-count">
                <span className="vote-dot"></span>
                {total(poll)} vote{total(poll) !== 1 ? 's' : ''}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}