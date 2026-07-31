import { useEffect, useState } from "react";

const coreUrl = "http://localhost:3000";

interface Winner {
  id: number;
  wins: number;
  time: number;
  name: string;
  color: string;
}

const Winners = () => {
  const [winners, setWinners] = useState<Winner[]>([]);

  useEffect(() => {
    async function loadWinners() {
      try {
        const res = await fetch(`${coreUrl}/winners`);
        if (!res.ok) throw new Error(`Failed to fetch winners: ${res.status}`);

        const rawWinners: { id: number; wins: number; time: number }[] = await res.json();

        console.log(rawWinners)
        const winnersWithCarData = await Promise.all(
          rawWinners.map(async (winner) => {
            const carRes = await fetch(`${coreUrl}/garage/${winner.id}`);
            const car: { name: string; color: string } = await carRes.json();
            return { ...winner, name: car.name, color: car.color };
          })
        );

        setWinners(winnersWithCarData);
      } catch (error) {
        console.log(error);
      }
    }
    loadWinners();
  }, []);

  return (
    <div className="winners_container">
      <h2>Winners</h2>

      {winners.length === 0 ? (
        <p>No winners yet</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Car</th>
              <th>Name</th>
              <th>Wins</th>
              <th>Best Time</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((winner, index) => (
              <tr key={winner.id}>
                <td>{index + 1}</td>
                <td>
                  <svg viewBox="0 0 100 48" width="40" height="20">
                    <rect x="12" y="9" width="76" height="30" rx="8" fill={winner.color} />
                  </svg>
                </td>
                <td>{winner.name}</td>
                <td>{winner.wins}</td>
                <td>{winner.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Winners;