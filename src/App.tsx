import React from 'react';
import { useEffect, useRef, useState } from 'react';
import Layout from './components/Layout';
import Cars from './components/Cars';
import Modal from './components/Modal';
import FormCars from './components/FormCars';
import './App.css';
import { CarArrayContext, type Car } from './context/context';

const coreUrl = 'http://localhost:3000';

export default function App() {
  let [carsArray, setCarsArray] = useState<Car[]>([]);

  let [showModal, setShowModal] = useState(false);
  let [finishedCarsArray, setFinishedCarsArray] = useState<string[]>([]);
  let [isRacing, setIsRacing] = useState<boolean>(false);

  let [postPerPage, setPostPerPage] = useState(7);
  let lastPage = Math.ceil(carsArray.length / postPerPage);

  let [currentPage, setCurrentPage] = useState(1);
  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPosts = carsArray.slice(firstPostIndex, lastPostIndex);

  const Track_length = 90;

  const finishedCarsRef = useRef<number[]>([]);
  let racingCarsRef = useRef<number[]>([]);
  const carIntervalsRef = useRef<{ [carId: string]: ReturnType<typeof setInterval> }>({});

  // fetch cars from the backend on mount
  useEffect(() => {
    async function loadCars(url: string) {
      try {
        const res = await fetch(`${url}/garage`);
        if (!res.ok) {
          throw new Error('failed to fetch cars array' + res.status);
        }
        const cars: { name: string; color: string; id: number }[] = await res.json();

        setCarsArray(
          cars.map((car) => ({
            ...car,
            speed: 0,
            selected: false,
            position: 0,
            state: false,
            stopCar: false,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    }
    loadCars(coreUrl);
  }, []);

  async function startSingleCarRace(startedCarID: number | string) {
    // if this car already has an interval running, clear it first so we never stack two loops on one car
    if (carIntervalsRef.current[startedCarID]) {
      clearInterval(carIntervalsRef.current[startedCarID]);
    }

    // starting (or re-starting) a car always resumes it, even if it was stopped
    setCarsArray((prevCars) =>
      prevCars.map((car) =>
        car.id === startedCarID ? { ...car, stopCar: false, state: true } : car
      )
    );

    let velocity: number;
    let distance: number;

    try {
      const res = await fetch(`${coreUrl}/engine?id=${startedCarID}&status=started`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error(await res.text());
      ({ velocity, distance } = await res.json());
    } catch (error) {
      console.log(error);
      return;
    }

    // car was stopped while "started" was in flight — abandon this race
    if (
      !carIntervalsRef.current[startedCarID] &&
      carIntervalsRef.current[startedCarID] !== undefined
    ) {
      // placeholder guard kept for clarity; real guard is the check below
    }

    const duration = distance / velocity;
    const start = performance.now();

    const intervalId = setInterval(() => {
      setCarsArray((prevCars) => {
        return prevCars.map((car) => {
          if (car.id === startedCarID && !car.selected && !car.stopCar) {
            const progress = Math.min((performance.now() - start) / duration, 1);
            return {
              ...car,
              position: progress * Track_length,
            };
          }
          return { ...car };
        });
      });
    }, 100);
    carIntervalsRef.current[startedCarID] = intervalId;

    try {
      const res = await fetch(`${coreUrl}/engine?id=${startedCarID}&status=drive`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error(await res.text());

      if (carIntervalsRef.current[startedCarID] === intervalId) {
        setCarsArray((prev) =>
          prev.map((car) =>
            car.id === startedCarID ? { ...car, position: Track_length, state: false } : car
          )
        );
        const timeInSeconds = (performance.now() - start) / 1000;

        if (finishedCarsRef.current.length === 0) {
          // this is the first car to finish this race
          recordWinner(startedCarID as number, timeInSeconds);
        }
        finishedCarsRef.current.push(startedCarID as number);
        const car = carsArray.find((c) => c.id === startedCarID);
        if (car) setFinishedCarsArray((prev) => [...prev, car.name]);

        recordWinner(startedCarID as number, timeInSeconds);
      }
    } catch (error) {
      console.log(error);
      setCarsArray((prev) =>
        prev.map((car) => (car.id === startedCarID ? { ...car, state: false } : car))
      );
    } finally {
      if (carIntervalsRef.current[startedCarID] === intervalId) {
        clearInterval(intervalId);
        delete carIntervalsRef.current[startedCarID];
      }

      racingCarsRef.current = racingCarsRef.current.filter((id) => id !== startedCarID);
      if (racingCarsRef.current.length === 0 && finishedCarsRef.current.length >= 1) {
        setTimeout(() => setShowModal(true), 4000);
      }
    }
  }

  async function stopSingleCar(carID: number) {
    // clear the interval immediately so any pending "drive" result for this car gets ignored
    if (carIntervalsRef.current[carID]) {
      clearInterval(carIntervalsRef.current[carID]);
      delete carIntervalsRef.current[carID];
    }

    try {
      const res = await fetch(`${coreUrl}/engine?id=${carID}&status=stopped`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (error) {
      console.log(error);
      return;
    }

    setCarsArray((prev) =>
      prev.map((car) =>
        car.id === carID ? { ...car, position: 0, state: false, stopCar: true } : car
      )
    );
  }

  function startRace() {
    finishedCarsRef.current = [];
    setFinishedCarsArray([]);
    setIsRacing(true);
    setShowModal(false);

    currentPosts.forEach((car) => {
      startSingleCarRace(car.id);
    });
  }

  async function resetRace() {
    Object.values(carIntervalsRef.current).forEach((id) => clearInterval(id));
    carIntervalsRef.current = {};
    finishedCarsRef.current = [];
    setFinishedCarsArray([]);
    setShowModal(false);
    setIsRacing(false);

    await Promise.all(
      carsArray.map((car) =>
        fetch(`${coreUrl}/engine?id=${car.id}&status=stopped`, { method: 'PATCH' }).catch(() => {})
      )
    );

    setCarsArray((prev) =>
      prev.map((car) => ({ ...car, position: 0, state: false, stopCar: false }))
    );
  }

  async function recordWinner(carId: number, time: number) {
    try {
      const res = await fetch(`${coreUrl}/winners/${carId}`);

      if (res.ok) {
        const existing: { wins: number; time: number } = await res.json();
        await fetch(`${coreUrl}/winners/${carId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wins: existing.wins + 1,
            time: Math.min(existing.time, time),
          }),
        });
      } else {
        await fetch(`${coreUrl}/winners`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: carId, wins: 1, time }),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  function onSelect(carID: number | string, car: Car) {
    if (car.state) return;
    setCarsArray((prev) => {
      return prev.map((car) => {
        return {
          ...car,
          selected: car.selected ? false : car.id === carID ? true : false,
        };
      });
    });
  }

  async function removeCar(CarID: number, car: Car) {
    if (car.state) return;
    try {
      let res = await fetch(`${coreUrl}/garage/${CarID}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('failed to delete a car ');
    } catch (error) {
      console.log(error);
      return;
    }

    setCarsArray((prev) => {
      return prev.filter((car) => car.id !== CarID);
    });
  }

  function closeModalFunction() {
    console.log('closing modal');
    setShowModal(false);
    setIsRacing(false);
    setFinishedCarsArray([]);
    finishedCarsRef.current = [];
    Object.values(carIntervalsRef.current).forEach((id) => clearInterval(id));
    carIntervalsRef.current = {};
    setCarsArray((prevCars) => {
      return prevCars.map((car) => {
        let restartedCar = {
          ...car,
          position: 0,
          state: false,
          stopCar: false,
        };
        return restartedCar;
      });
    });
  }

  function handlePageChange(command: string) {
    if (command === 'add') {
      setCurrentPage((x) => (x + 1 <= lastPage ? x + 1 : lastPage));
    } else if (command === 'sub') {
      setCurrentPage((x) => (x - 1 <= 1 ? 1 : x - 1));
    }
  }

  return (
    <CarArrayContext.Provider value={{ carsArray, setCarsArray }}>
      <div className="bg-slate-900 text-white flex flex-col justify-between font-sans relative overflow-x-hidden h-svh">
        {showModal && (
          <Modal
            finishedCarsArray={finishedCarsArray}
            closeModalFunction={closeModalFunction}
          ></Modal>
        )}
        <Layout>
          <FormCars></FormCars>
          <button onClick={startRace}>Start Race</button>
          <button onClick={resetRace}>Reset Race</button>
          <div className="pagination_btns justify-center bg-[#060710] border border-[#232742] px-4 py-1.5 rounded-lg font-mono text-xs text-cyan-400 font-bold tracking-wider shadow-inner flex items-center gap-1.5">
            <button
              onClick={() => {
                handlePageChange('sub');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#161830] border border-[#272a4d] text-slate-200 font-mono text-xs font-bold transition-all hover:bg-[#25284a] hover:border-[#3b3f73] hover:text-white active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 shadow-sm"
            >
              PREV
            </button>
            <span className="text-slate-400 text-[10px]">PAGE</span>
            <span className="text-cyan-300 font-black">{currentPage}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">{lastPage}</span>
            <button
              onClick={() => {
                handlePageChange('add');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#161830] border border-[#272a4d] text-slate-200 font-mono text-xs font-bold transition-all hover:bg-[#25284a] hover:border-[#3b3f73] hover:text-white active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 shadow-sm"
            >
              NEXT
            </button>
          </div>
          {currentPosts.map((car) => {
            return (
              <div key={car.id} className="carWrapper">
                <Cars
                  {...car}
                  onSelect={onSelect}
                  removeCar={removeCar}
                  startSingleCarRace={startSingleCarRace}
                  stopSingleCar={stopSingleCar}
                />
              </div>
            );
          })}
        </Layout>
      </div>
    </CarArrayContext.Provider>
  );
}
