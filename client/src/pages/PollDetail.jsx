import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../config';

export default function PollDetail() {
  const { id }    = useParams();
  const { token } = useAuth();
  const [poll, setPoll]           = useState(null);
  const [selected, setSelected]   = useState(null);
  const [subEmail, setSubEmail]   = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [message, setMessage]     = useState('');

  useEffect(() => {
    fetch(`${API}/api/polls/${id}`)
      .then(r => r.json()).then(setPoll);
  }, [id]);

  const castVote = async () => {
    if (selected === null) return;
    const res = await fetch(`${API}/api/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ pollId: id, optionIdx: selected }),
    });
    const data = await res.json();
    setMessage(data.message);
    fetch(`${API}/api/polls/${id}`).then(r => r.json()).then(setPoll);
  };

  const subscribe = async () => {
    const res = await fetch(`${API}/api/polls/${id}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: subEmail }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  const loadAnalytics = async () => {
    const res  = await fetch(`${API}/api/polls/${id}/analytics`);
    const data = await res.json();
    setAnalytics(data);
  };

  if (!poll) return <p>Loading...</p>;
  const total = poll.options.reduce((s, o) => s + o.votes, 0);

  return (
    <div className="poll-detail">
      <h2>{poll.title}</h2>
      <p className="meta">By {poll.creator?.username}</p>
      {message && <p className="success">{message}</p>}
      <div className="options-list">
        {poll.options.map((o, i) => {
          const pct = total > 0 ? Math.round(o.votes / total * 100) : 0;
          return (
            <div key={i}
              className={`option-row ${selected === i ? 'selected' : ''}`}
              onClick={() => setSelected(i)}>
              <span>{o.text}</span>
              <div className="bar-wrap">
                <div className="bar" style={{ width: `${pct}%` }}></div>
              </div>
              <span className="pct">{pct}% ({o.votes})</span>
            </div>
          );
        })}
      </div>
      {token && poll.isActive && (
        <button className="btn-primary" onClick={castVote}>Cast Vote</button>
      )}
      <div className="subscribe-box">
        <h4>Get results by email</h4>
        <input
          type="email"
          placeholder="your@email.com"
          value={subEmail}
          onChange={e => setSubEmail(e.target.value)}
        />
        <button onClick={subscribe}>Subscribe</button>
      </div>
      <button className="btn-secondary" onClick={loadAnalytics}>
        Load Analytics (FastAPI)
      </button>
      {analytics && (
        <div className="analytics-box">
          <h4>Analytics — Winner: {analytics.winner}</h4>
          <p>Total votes: {analytics.total_votes}</p>
          {analytics.options.map((o, i) => (
            <p key={i}>{o.text}: {o.percentage}%</p>
          ))}
        </div>
      )}
    </div>
  );
}