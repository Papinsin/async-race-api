import ReactDom from 'react-dom'


import './Modal.css'

export default function Modal ({finishedCarsArray , closeModalFunction }){

  return ReactDom.createPortal(
    <div className='modal-container flex justify-center items-center' onClick={closeModalFunction}>
      <button className="modal_underlay"  onClick={(e)=> e.stopPropagation()} >
        <h1 className='modal__h1'>Finished Cars:</h1>

          <div className="finishedCars_list flex flex-col">
            {finishedCarsArray.map((carName, index ) => {

              if(index === 0) return <p className=' text-yellow-500 ' key={index}> {index + 1}. {carName}</p>
              else if(index === 1) return <p className=' text-gray-300 ' key={index}> {index + 1}. {carName}</p>
              else if(index === 2) return <p className=' text-orange-700 ' key={index}> {index + 1}. {carName}</p>
              else {  return <p className=' text-cyan-950 ' key={index}> {index + 1}. {carName}</p>}


              })}
        </div>

      </button>
    </div>,
    document.getElementById('modal')!
  )
}
