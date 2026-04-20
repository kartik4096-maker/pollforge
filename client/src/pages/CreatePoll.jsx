import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../config';

export default function CreatePoll() {
  const [title, setTitle]       = useState('');
  const [options, setOptions]   = useState(['', '']);
  const [invitees, setInvitees] = useState('');
  const [expiresAt, setExpires] = useState('');
  const [error, setError]       = useState('');
  const { token } = useAuth();
  const navigate  = useNavigate();

  const addOption = () => setOptions([...options, '']);
  const setOption = (i, v) => {
    const o = [...options];
    o[i] = v;
    setOptions(o);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validOptions = options.filter(o => o.trim() !== '');
    if (!title.trim()) return setError('Title is required');
    if (validOptions.length < 2) return setError('At least 2 options required');
    try {
      const res = await fetch(`${API}/api/polls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          options: validOptions,
          invitees: invitees
            ? invitees.split(',').map(e => e.trim()).filter(Boolean)
            : [],
          expiresAt: expiresAt || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Failed to create poll');
      navigate(`/poll/${data._id}`);
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="auth-card">
      <h2>Create a Poll</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Poll question / title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <h4>Options</h4>
        {options.map((o, i) => (
          <input
            key={i}
            placeholder={`Option ${i + 1}`}
            value={o}
            onChange={e => setOption(i, e.target.value)}
          />
        ))}
        <button type="button" onClick={addOption}>+ Add option</button>
        <h4>Invite by email (comma separated)</h4>
        <input
          placeholder="alice@example.com, bob@example.com"
          value={invitees}
          onChange={e => setInvitees(e.target.value)}
        />
        <h4>Expires at (optional)</h4>
        <input
          type="datetime-local"
          value={expiresAt}
          onChange={e => setExpires(e.target.value)}
        />
        <button type="submit" className="btn-primary">Create Poll</button>
      </form>
    </div>
  );
}