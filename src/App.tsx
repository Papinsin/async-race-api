import React from "react";
import { useEffect, useRef, useState } from "react";
import Layout from "./components/Layout";
import Cars from "./components/Cars";
import Modal from "./components/Modal";
import FormCars from "./components/FormCars";
import "./App.css";
import { CarArrayContext , type Car } from "./context/context";

export default function App() {
  let [carsArray, setCarsArray] = useState<Car[]>([
    {
      id: Math.random()*100,
      name: "car 1",
      speed: 1,
      color: "red",
      selected:false,
      position: 0,
      state: false,
      stopCar:false,
    },
    {
      id: Math.random() * 100,
      name: "car 2",
      speed: 10,
      color: "grey",
      selected:false,
      position: 0,
      state: false,
      stopCar:false,
    },
    {
      id: Math.random() * 100,
      name: "Dawud",
      speed: 5,
      color: "green",
      selected:false,
      position: 0,
      state: false,
      stopCar:false,
    },
    {
      id: Math.random() * 100,
      name: "Dawud 1",
      speed: 4,
      color: "black",
      selected:false,
      position: 0,
      state: false,
      stopCar:false,
    },
  ]);




  let [showModal, setShowModal] = useState(false);
  let [finishedCarsArray, setFinishedCarsArray] = useState<string[]>([]);
  let [isRacing, setIsRacing] = useState<boolean>(false);

  let [postPerPage, setPostPerPage] = useState(4);
  let lastPage = Math.ceil(carsArray.length / postPerPage)

  let [currentPage, setCurrentPage] = useState(1);
  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPosts = carsArray.slice(firstPostIndex, lastPostIndex);

  const Track_length = 90;

  const finishedCarsRef = useRef<number[]>([]);
  const carIntervalsRef = useRef<{ [carId: string]: ReturnType<typeof setInterval> }>({});

  function startRace() {
    finishedCarsRef.current = [];
    setFinishedCarsArray([]);
    setShowModal(false);
    setCarsArray((prevCars) => {
      return prevCars.map((car) => {
        return {
          ...car,
          state: true,
        };
      });
    });
    setIsRacing((prev) => !prev);
  }


  function startSingleCarRace(startedCarID : number | string) {
    let reachedFinish = false;

    // if this car already has an interval running, clear it first so we never stack two loops on one car
    if (carIntervalsRef.current[startedCarID]) {
      clearInterval(carIntervalsRef.current[startedCarID]);
    }

    // starting (or re-starting) a car always resumes it, even if it was stopped
    setCarsArray((prevCars) =>
      prevCars.map((car) =>
        car.id === startedCarID ? { ...car, stopCar: false } : car
      )
    );

    const intervalId = setInterval(() => {
      setCarsArray((prevCars) => {
        return prevCars.map((car) => {
          if (car.id === startedCarID && !car.selected ) {

            if (car.stopCar) {
              return car; // stay paused until resumed
            }

            car.state = true;
            let nextPosition = car.position + car.speed;
  

            if (nextPosition >= Track_length) {
              reachedFinish = true;
            }
            if (
              reachedFinish &&
              !finishedCarsRef.current.includes(startedCarID)
            ) {
              finishedCarsRef.current.push(startedCarID);
              clearInterval(intervalId);
              delete carIntervalsRef.current[startedCarID];
              finishedRace(car.name);
            }

            return {
              ...car,
              position: Math.min(nextPosition, Track_length),
            };
          }
          return {...car} ;
        });
      });
    }, 100);

    carIntervalsRef.current[startedCarID] = intervalId;
  }

  function finishedRace(carName: string) {
    setFinishedCarsArray((prev) => {
      const nextFinishedCars = [...prev, carName];
      let activeCarsCount = carsArray.filter((car) => car.state).length;
      console.log(activeCarsCount);

      if (nextFinishedCars.length === activeCarsCount && activeCarsCount > 0) {
        setTimeout(() => {
          setShowModal(true);
          activeCarsCount = 0;
        }, 2500);
      }
      return nextFinishedCars;
    });
  }

  function onSelect(carID : number | string){
     setCarsArray((prev) => {
      return prev.map((car) => {
        return{
          ...car,
          selected : car.selected ? false : (car.id === carID ? true : false), 
        }
      })
     })

  }

  function removeCar(CarID:number){
    setCarsArray((prev)=>{
      return prev.filter((car)=> car.id !== CarID)
    })
  }

  function stopSingleCar(CarID:number){
    setCarsArray((prev)=>{
      return prev.map((car)=>{
        console.log(car)
        return car.id === CarID ? {...car, stopCar: true } : car
      })
    })
  }



  function closeModalFunction() {
    console.log("closing modal");
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

  function handlePageChange(command : string){
    if(command === 'add'){
      setCurrentPage( x => x + 1 <= lastPage ? x + 1 : lastPage)
    }
    else if(command === 'sub'){
      setCurrentPage(x => x - 1 <= 1 ? 1 : x -1 )
    }

  }


  useEffect(() => {
    if (!isRacing) return;
    const intervalId = setInterval(() => {
      setCarsArray((prevCars) => {
        return prevCars.map((car) => {


          let nextPosition = car.position;

          const updatedCar = {
            ...car,
            position: Math.min(nextPosition + car.speed, Track_length),
          };
          if (
            car.state &&
            updatedCar.position >= Track_length &&
            !finishedCarsRef.current.includes(car.id)
          ) {
            finishedCarsRef.current.push(car.id);
            finishedRace(updatedCar.name);
          }
          return updatedCar;
        });
      });
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [isRacing]);

  return (
    <CarArrayContext.Provider value={{carsArray , setCarsArray}}>
      <div className="bg-slate-900 text-white flex flex-col justify-between font-sans relative overflow-x-hidden h-svh">

        {showModal && (
          <Modal
            finishedCarsArray={finishedCarsArray}
            closeModalFunction={closeModalFunction}
          ></Modal>
        )}
        <Layout>
          <FormCars></FormCars>
          <button onClick={startRace}> start race </button>
          <div className="pagination_btns justify-center bg-[#060710] border border-[#232742] px-4 py-1.5 rounded-lg font-mono text-xs text-cyan-400 font-bold tracking-wider shadow-inner flex items-center gap-1.5">
            <button onClick={()=>{handlePageChange('sub')}} className="px-3 py-1.5 rounded-lg bg-[#161830] border border-[#272a4d] text-slate-200 font-mono text-xs font-bold transition-all hover:bg-[#25284a] hover:border-[#3b3f73] hover:text-white active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 shadow-sm"> PREV</button>
              <span className="text-slate-400 text-[10px]">PAGE</span>
              <span className="text-cyan-300 font-black">{currentPage}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">{lastPage}</span>
            <button onClick={()=>{handlePageChange('add')}} className="px-3 py-1.5 rounded-lg bg-[#161830] border border-[#272a4d] text-slate-200 font-mono text-xs font-bold transition-all hover:bg-[#25284a] hover:border-[#3b3f73] hover:text-white active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 shadow-sm">NEXT</button>  
          </div>
          {currentPosts.map((car) => {
            return (
              <div key={car.id} className="carWrapper">
                <Cars {...car} onSelect={onSelect}  removeCar={removeCar} startSingleCarRace={startSingleCarRace} stopSingleCar={stopSingleCar}  />
              </div>
            );
          })}
        </Layout>
      </div>  
    </CarArrayContext.Provider>
  );
}