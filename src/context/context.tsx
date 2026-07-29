import { createContext } from "react";

export interface Car {
  id: number;
  name: string;
  speed: number;
  color: string;
  position: number;
  state: boolean;
  selected: boolean,
  stopCar:boolean,
}

export interface CarsProps extends Car{
  onSelect: (carID : number | string) => void,
}

interface CarContextType {
  carsArray: Car[] | undefined,
  // Define it as a standard function that takes an array of Cars and returns nothing
  setCarsArray: ( cars:Car[]| ((prev: Car[]) => Car[] )) => void
}

export const CarArrayContext = createContext<CarContextType>({
  carsArray: [],
  setCarsArray: () => {},
});



