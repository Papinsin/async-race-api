import { useState, type JSX } from "react";
import FormCars from "./FormCars";
import { type CarsProps } from "../context/context";
import ModifyCars from './ModifyCars'

interface CarsInterface extends CarsProps {
  id: number;
  name: string;
  color: string;
  selected: boolean;
  speed: number;
  position: number; 
  stopCar:boolean;
  removeCar: (CarID : number, car: CarsProps) =>void;
  stopSingleCar: (CarID: number) => void ;
  startSingleCarRace: (startedCarID: number | string) => void;
}

const Cars = (car: CarsInterface): JSX.Element => {
  return (
    <div
      className="flex items-center cardDesigh border-t-2 border-b-2 border-gray-700 p-1.5 m-1"
      aria-label={car.name}
      title={car.name}
    >
      { car.selected &&   
        <ModifyCars carID = {car.id} ></ModifyCars>
        }
      <div className="flex flex-col items-center">
        <div className="car_movement_Btns flex">
          <button
            onClick={() => car.startSingleCarRace(car.id)}
            className="px-3 py-1.5 rounded border text-[18px] font-mono font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 select-none bg-slate-900/90 border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-950/20 disabled:opacity-20 disabled:pointer-events-none"
            disabled={car.state}
          >
            A
          </button>
          <button 
          onClick={()=> car.stopSingleCar(car.id)}
          className="px-3 py-1.5 rounded border text-[18px] font-mono font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 select-none bg-slate-900/90 border-slate-800 text-slate-400 hover:text-red-800 hover:border-red-500/40 hover:bg-emerald-950/20 disabled:opacity-20 disabled:pointer-events-none"
          disabled={!car.state}

          >
            B
          </button>
        </div>
        <div className="flex flex-col car_setting_Btns">
          <button className="bg-rose-950/40 text-rose-400 p-1 disabled:opacity-30 disabled:pointer-events-none"
          disabled={car.state}
          onClick={()=> car.removeCar(car.id , car)}>
            remove
          </button>
          
          <button
           className="bg-purple-900/40 text-white p-1 disabled:opacity-30 disabled:pointer-events-none" 
           disabled={car.state}
            onClick={()=>{ car.onSelect(car.id , car)}}>select</button>
            
        </div>
      </div>
      <div
        className="car_svg scale-150"
        style={{
          position: "relative",
          left: car.position  + "vw",
          transition: `1200ms`,
          zIndex: 1,
        }}
      >
        <svg
          viewBox="0 0 100 48"
          width="52  "
          height="75 "
          style={{
            filter: `drop-shadow(${car.color})`,
          }}
        >
          <rect x="20" y="4" width="14" height="6" rx="1.5" fill="#1e293b" />
          <rect x="66" y="4" width="14" height="6" rx="1.5" fill="#1e293b" />
          <rect x="20" y="38" width="14" height="6" rx="1.5" fill="#1e293b" />
          <rect x="66" y="38" width="14" height="6" rx="1.5" fill="#1e293b" />

          <rect
            x="12"
            y="9"
            width="76"
            height="30"
            rx="8"
            fill={car.color || "red"}
          />
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

          <rect
            x="84"
            y="13"
            width="4"
            height="3"
            fill="#ffff99"
            opacity="0.9"
          />
          <rect
            x="84"
            y="32"
            width="4"
            height="3"
            fill="#ffff99"
            opacity="0.9"
          />
        </svg>
      </div>
    </div>
  );
};
export default Cars;
