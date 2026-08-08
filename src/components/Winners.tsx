import { useEffect, useState } from 'react';

const coreUrl = 'http://localhost:3000';

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
        const res = await fetch(`${coreUrl}/winners?_limit=10`);
        if (!res.ok) throw new Error(`Failed to fetch winners: ${res.status}`);

        const rawWinners: { id: number; wins: number; time: number }[] = await res.json();

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
    <div className="p-6 font-mono text-slate-200">
      <h2 className="text-2xl font-black text-cyan-400 tracking-wider mb-4">WINNERS</h2>

      {winners.length === 0 ? (
        <p className="text-slate-500 italic">No winners yet</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-800 bg-[#060710] shadow-inner">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#0d0f1f] text-cyan-400 text-xs uppercase tracking-widest">
                <th className="px-4 py-3">№</th>
                <th className="px-4 py-3">Car</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Wins</th>
                <th className="px-4 py-3">Best Time</th>
              </tr>
            </thead>
            <tbody>
              {winners.map((winner, index) => (
                <tr
                  key={winner.id}
                  className="border-t border-slate-800 hover:bg-slate-900/60 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-400">{index + 1}</td>
                  <td className="px-4 py-3">
                    <svg
                      viewBox="0 0 100 48"
                      width="52  "
                      height="75 "
                      style={{
                        filter: `drop-shadow(${winner.color})`,
                      }}
                    >
                      <rect x="20" y="4" width="14" height="6" rx="1.5" fill="#1e293b" />
                      <rect x="66" y="4" width="14" height="6" rx="1.5" fill="#1e293b" />
                      <rect x="20" y="38" width="14" height="6" rx="1.5" fill="#1e293b" />
                      <rect x="66" y="38" width="14" height="6" rx="1.5" fill="#1e293b" />

                      <rect x="12" y="9" width="76" height="30" rx="8" fill={winner.color} />
                      <rect x="42" y="14" width="22" height="20" rx="4" fill="#0f172a" />
                      <rect
                        x="45"
                        y="16"
                        width="6"
                        height="16"
                        rx="1.5"
                        fill="#ffffff"
                        opacity="0.3"
                      />

                      <rect x="84" y="13" width="4" height="3" fill="#ffff99" opacity="0.9" />
                      <rect x="84" y="32" width="4" height="3" fill="#ffff99" opacity="0.9" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 text-slate-200 font-bold">{winner.name}</td>
                  <td className="px-4 py-3 text-emerald-400 font-black">{winner.wins}</td>
                  <td className="px-4 py-3 text-slate-300">{winner.time}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Winners;
