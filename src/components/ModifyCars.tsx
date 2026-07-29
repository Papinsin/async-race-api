import React, { useContext, useState } from 'react'
import {CarArrayContext} from '../context/context'
import "./FormCars.css";


interface FormCarsProps {
  carID: string | number;
}

export default function ModifyCars({carID}:FormCarsProps){
  console.log(carID + "ww")
  let[newName , setNewName] = useState<string>('name')
  let[newColor , setNewColor] = useState<string>('color')
  const {carsArray ,setCarsArray} = useContext(CarArrayContext)

  console.log(carID)
  function changeProperties(){
       setCarsArray((prev)=>{
        return prev.map((car)=>{
          if(car.id === carID){
            return {
              ...car, 
              name: newName,
              color: newColor,
            }
          }
          else{
            return car
          }
        })
      })
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
                  value={newName}
                  onChange={(e) => setNewName(e.target.value) }
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
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="bg-transparent border-none outline-none cursor-pointer w-8 h-8 rounded shrink-0"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                onClick={()=>changeProperties()}
                className="bg-gray-700 hover:bg-cyan-400 text-slate-950 px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      );
}
