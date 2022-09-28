


export default function Toast({msg}){
  //const test = true;
  return(
    <>
      <div className={`bg-red-400 h-[60px] mx-auto my-2 flex justify-center text-lg items-center absolute bottom-8 right-3 rounded w-10/12 ${msg? 'translate-x-0' : '-translate-x-[200%]'} ease-in duration-300 z-50`}>
        <p className="text-white font-bold">{msg}</p>
      </div>
    </>
  )
}