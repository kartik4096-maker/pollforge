import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../config';

export default function PollDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');

  const load = () => fetch(`${API}/api/polls/${id}`).then(r => r.json()).then(setPoll);
  useEffect(() => { load(); }, [id]);

  const msg = (text, type = 'success') => { setMessage(text); setMsgType(type); };

  const castVote = async () => {
    if (selected === null) return msg('Please select an option', 'error');
    const res = await fetch(`${API}/api/votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ pollId: id, optionIdx: selected }),
    });
    const data = await res.json();
    msg(data.message, res.ok ? 'success' : 'error');
    if (res.ok) load();
  };

  const loadAnalytics = async () => {
    const res = await fetch(`${API}/api/polls/${id}/analytics`);
    const data = await res.json();
    setAnalytics(data);
  };

  if (!poll) return (
    <div style={{textAlign:'center', padding:'5rem', color:'var(--text2)'}}>
      Loading poll...
    </div>
  );

  const total = poll.options.reduce((s, o) => s + o.votes, 0);

  return (
    <div className="poll-detail-wrap">
      <h2>{poll.title}</h2>
      <p className="meta">Created by {poll.creator?.username} · {total} vote{total !== 1 ? 's' : ''}</p>

      {message && (
        <p className={msgType === 'error' ? 'error-msg' : 'success-msg'}
          style={{marginBottom:'1.5rem'}}>{message}</p>
      )}

      <div className="options-vote">
        {poll.options.map((o, i) => {
          const pct = total > 0 ? Math.round(o.votes / total * 100) : 0;
          return (
            <div key={i}
              className={`option-vote-row ${selected === i ? 'selected' : ''}`}
              onClick={() => setSelected(i)}>
              <div className="option-vote-bar" style={{width: `${pct}%`}}></div>
              <div className="option-vote-content">
                <span className="option-vote-text">{o.text}</span>
                <span className="option-vote-pct">{pct}% ({o.votes})</span>
              </div>
            </div>
          );
        })}
      </div>

      {token && poll.isActive && (
        <button className="btn-vote" onClick={castVote}>Cast My Vote</button>
      )}

      <div className="section-card">
        <h4>Analytics</h4>
        <button className="btn-analytics" onClick={loadAnalytics}>
          Load Analytics (FastAPI) →
        </button>
        {analytics && (
          <div className="analytics-result">
            <p className="analytics-winner">🏆 Winner: {analytics.winner || 'Tie'}</p>
            <p style={{color:'var(--text2)', fontSize:'0.85rem', marginBottom:'1rem'}}>
              Total votes: {analytics.total_votes}
            </p>
            {analytics.options?.map((o, i) => (
              <div className="analytics-bar-wrap" key={i}>
                <div className="analytics-label">
                  <span>{o.text}</span>
                  <span>{o.percentage}%</span>
                </div>
                <div className="analytics-bar-bg">
                  <div className="analytics-bar-fill" style={{width:`${o.percentage}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}