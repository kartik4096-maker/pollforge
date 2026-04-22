import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../config';

export default function CreatePoll() {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [invitees, setInvitees] = useState('');
  const [expiresAt, setExpires] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  const setOption = (i, v) => { const o = [...options]; o[i] = v; setOptions(o); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    const valid = options.filter(o => o.trim());
    if (!title.trim()) return setError('Title is required');
    if (valid.length < 2) return setError('At least 2 options required');
    try {
      const res = await fetch(`${API}/api/polls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: title.trim(), options: valid,
          invitees: invitees ? invitees.split(',').map(e => e.trim()).filter(Boolean) : [],
          expiresAt: expiresAt || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Failed');
      navigate(`/poll/${data._id}`);
    } catch { setError('Server error. Please try again.'); }
  };

  return (
    <div className="create-wrap">
      <h2>Create a Poll</h2>
      <p className="subtitle">Ask your question and collect responses</p>
      {error && <p className="error-msg" style={{marginBottom:'1.5rem'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h4>Question</h4>
          <input className="create-input" placeholder="What's your question?" value={title}
            onChange={e => setTitle(e.target.value)} required />
        </div>

        <div className="form-section">
          <h4>Options</h4>
          <div className="options-list">
            {options.map((o, i) => (
              <div className="option-input-wrap" key={i}>
                <input placeholder={`Option ${i + 1}`} value={o}
                  onChange={e => setOption(i, e.target.value)} />
              </div>
            ))}
          </div>
          <button type="button" className="btn-add-option"
            onClick={() => setOptions([...options, ''])}>
            + Add option
          </button>
        </div>

        <div className="form-section">
          <h4>Invite by email (optional)</h4>
          <input className="create-input" placeholder="alice@gmail.com, bob@gmail.com"
            value={invitees} onChange={e => setInvitees(e.target.value)} />
        </div>

        <div className="form-section">
          <h4>Expires at (optional)</h4>
          <input className="create-input" type="datetime-local" value={expiresAt}
            onChange={e => setExpires(e.target.value)} />
        </div>

        <button type="submit" className="btn-submit">Launch Poll 🚀</button>
      </form>
    </div>
  );
}