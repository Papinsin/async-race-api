import { useState } from 'react';

export default function CreatingCarForm() {
  const [name, setName] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Car name" />
      <button type="submit">Add Car</button>
    </form>
  );
}
