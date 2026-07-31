import React, { useContext, useState } from "react";
import { CarArrayContext } from "../context/context";
import "./FormCars.css";

const FormCars = () => {
  let [carName, setCarName] = useState("car");
  let [carColor, setCarColor] = useState("#22233");
  const {carsArray ,setCarsArray} = useContext(CarArrayContext)
  const coreUrl = `http://localhost:3000`
  
  const CAR_BRANDS = [
    "Chevrolet", "Daewoo", "Ravon", "UzDaewoo", "GM Uzbekistan",
  ];

  const CAR_MODELS = [
    "Nexia", "Cobalt", "Lacetti", "Gentra", "Spark",
    "Matiz", "Damas", "Labo", "Captiva", "Onix",
  ];

  function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }
  async function generateRandomCars() {
  const requests = Array.from({ length: 100 }, () => {
    const name = `${getRandomItem(CAR_BRANDS)} ${getRandomItem(CAR_MODELS)}`;
    const color = getRandomColor();

    return fetch(`${coreUrl}/garage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color }),
    }).then((res) => res.json());
  });

  try {
    const createdCars: { id: number; name: string; color: string }[] = await Promise.all(requests);

    setCarsArray((prev) => [
      ...prev,
      ...createdCars.map((car) => ({
        ...car,
        speed: 0,
        selected: false,
        position: 0,
        state: false,
        stopCar: false,
      })),
    ]);
  } catch (error) {
    console.log(error);
  }
}

  async function makeCarFromData(name: string, color: string) {
  try {
    const res = await fetch(`${coreUrl}/garage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color }),
    });
    if (!res.ok) throw new Error(await res.text());

    const createdCar: { id: number; name: string; color: string } = await res.json();

    setCarsArray((prev) => [
      ...prev,
      {
        ...createdCar,
        speed: 0,
        selected: false,
        position: 0,
        state: false,
        stopCar: false,
      },
    ]);
  } catch (error) {
    console.log(error);
  }
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
          <button 
          onClick={generateRandomCars}
          className="bg-gray-700 hover:bg-cyan-400 text-slate-950 px-4 py-1.5 rounded-lg transition-colors cursor-pointer">
            Generate 100 cars
          </button>
        </div>
      </form>
    </div>
  );
};




export default FormCars;
