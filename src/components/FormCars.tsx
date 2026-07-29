import React, { useContext, useState } from "react";
import { CarArrayContext } from "../context/context";
import "./FormCars.css";

const FormCars = () => {
  let [carName, setCarName] = useState("car");
  let [carColor, setCarColor] = useState("#22233");
  const {carsArray ,setCarsArray} = useContext(CarArrayContext)

  function makeCarFromData(name: string, color: string) {
    let newCar = {
        id: Math.random()*100,
        name: name,
        speed: 1,
        selected: false,
        color: color,
        position:0,
        state: false,
        stopCar:false,
    }
    setCarsArray((prev)=>{
      return [...prev , newCar]
   } )
    
  }
  return (
    <div className="form_container">
      <form action="/" method="get" onSubmit={(e) => e.preventDefault()}>
        <div className="flex items-center justify-between font-mono text-[20px] font-black text-slate-400 gap-4">
          {/* NAME FIELD */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 focus-within:border-cyan-400 focus-within:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all">
            <label htmlFor="name" className="text-slate-400 select-none">
              NAME:
            </label>
            <input
              id="name"
              className="bg-transparent border-none outline-none text-white w-full"
              required
              type="text"
              name="name"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
            />
          </div>

          {/* COLOR FIELD */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 focus-within:border-cyan-400 focus-within:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all">
            <label htmlFor="color" className="text-slate-400 select-none">
              COLOR:
            </label>
            <input
              id="color"
              required
              type="color"
              name="color"
              value={carColor}
              onChange={(e) => setCarColor(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer w-8 h-8 rounded shrink-0"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            onClick={()=>{makeCarFromData(carName , carColor)}}
            className="bg-gray-700 hover:bg-cyan-400 text-slate-950 px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};




export default FormCars;
