import { useEffect, useState } from 'react';
import PollCard from '../components/PollCard';
import API from '../config';

export default function Home() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/polls`)
      .then(r => r.json())
      .then(setPolls);
  }, []);

  return (
    <div>
      <h1>Active Polls</h1>
      {polls.length === 0
        ? <p>No active polls right now.</p>
        : polls.map(p => <PollCard key={p._id} poll={p} />)
      }
    </div>
  );
}