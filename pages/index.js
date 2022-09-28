import {useState,useEffect} from 'react';
import Login from '../components/Login.js'
import Register from '../components/Register.js'

import useSWR from 'swr'
import {useRouter} from 'next/router';

const options = {
  mode: "cors",
  method: "GET",
  credentials: 'include',
  headers:{
    "Content-Type":"application/json",
    'Access-Control-Allow-Origin':'http://localhost:3000'
  }
}
const fetcher = async (url)=>{
  const data = await fetch(url,options).then((data)=>data.json());
  return data.todo;
}
export default function Home(){
  const router = useRouter();
  const [openLogin,setOpenLogin] = useState(false)
  const [error,setError] = useState({})
  const [openRegister,setOpenRegister] = useState(false)
  const [update,setUpdate] = useState(false)
  const [id,setId] = useState(null)
  const [isLoggedIn,setIsLoggedIn] = useState(null)
  const url = 'http://localhost:8001/api/todo';
  const {data,mutate} = useSWR(url,fetcher)
  
  useEffect(()=>{
    setIsLoggedIn(window.localStorage.getItem('isLoggedIn'))
    //console.log(window.localStorage)
  },[])
  
  const todo = data || []
  const close = (item)=>{
    if (item == 'login') {
      setOpenLogin(!openLogin);
      setOpenRegister(false)
    }
    if (item == 'reg') {
      setOpenRegister(!openRegister)
      setOpenLogin(false)
    }
  }
  const [formData,setFormData] = useState({
    heading: "",
  })
  const handleForm = async (e)=>{
    e.preventDefault();
    if(formData.heading.length <= 0){
      setError({heading:'Heading cannot be empty!'})
      return;
    }
    mutate([...data],false);
    const url = 'http://localhost:8001/api/todo';
    const result = await fetch(url,{
      mode: "cors",
      method: "POST",
      credentials: 'include',
      body: JSON.stringify(formData),
      headers:{
        "Content-Type":"application/json",
        'Access-Control-Allow-Origin':'http://localhost:3000'
      }
    })
    const res = await result.json();
    
    mutate([...data])
    if(res.ok) setFormData({heading:"",description:""})
    if(!res.ok){
      if(res.msg){
        setList(res.msg)
        setTimeout(function() {
          setList("")
        }, 5000);
      }
      if(res.errors) setError(res.errors)
    }
  }
  const handleChange = (e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setFormData({...formData,[name]:value})
  }
  const updateTodo = async (a,b,c)=>{
    //alert(c)
    setUpdate(true)
    setFormData({heading:b,description:c})
    setId(a)
  }
  const updTodo = async (e)=>{
    e.preventDefault();
    mutate([...data],false);
    const url = `http://localhost:8001/api/todo/${id}`;
    const result = await fetch(url,{
      mode: "cors",
      method: "PATCH",
      credentials: 'include',
      body: JSON.stringify(formData),
      headers:{
        "Content-Type":"application/json",
        'Access-Control-Allow-Origin':'http://localhost:3000'
      }
    })
    const res = await result.json();
    mutate([...data])
    if(!res.ok) setList(res.msg)
    if(res.ok){
      setId(null)
      setFormData({heading:"",description:""})
      setUpdate(false)
    }
  }
  const complete = async (id)=>{
    mutate([...data],false);
    const url = `http://localhost:8001/api/todo/complete/${id}`;
    const result = await fetch(url,{
      mode: "cors",
      method: "PATCH",
      credentials: 'include',
      headers:{
        "Content-Type":"application/json",
        'Access-Control-Allow-Origin':'http://localhost:3000'
      }
    })
    const res = await result.json();
    mutate([...data])
    if(!res.ok) setList(res.msg)
  }
  const deleteTodo = async (id)=>{
    mutate([...data],false);
    const url = `http://localhost:8001/api/todo/${id}`;
    const result = await fetch(url,{
      mode: "cors",
      method: "DELETE",
      credentials: 'include',
      headers:{
        "Content-Type":"application/json",
        'Access-Control-Allow-Origin':'http://localhost:3000'
      }
    })
    const res = await result.json();
    mutate([...data])
    if(!res.ok) setList(res.msg)
  }
  const logout = async ()=>{
    const url = `http://localhost:8001/api/user/logout`;
    const result = await fetch(url,{
      mode: "cors",
      method: "GET",
      credentials: 'include',
      headers:{
        "Content-Type":"application/json",
        'Access-Control-Allow-Origin':'http://localhost:3000'
      }
    })
    const res = await result.json();
    //mutate([...data])
    if(!res.ok) setList(res.msg)
    localStorage.clear();
    if(res.ok){
      router.reload()
    }
  }
  
  return(
    <>
     <Toast msg={list}/>
     
      <div className="max-w-[1240px] w-11/12 mx-auto">
        {openLogin && <Login close={close}/>}
        {openRegister && <Register close={close}/>}
        {!isLoggedIn && 
        <div className="my-2 absolute top-1 right-4">
          <button className="px-6 py-2 hover:bg-blue-300 rounded border-[2px] border-blue-500 uppercase" onClick={()=>close("login")}>
            Login
          </button>
          <button className="ml-2 px-6 py-2 hover:bg-green-300 rounded border-[2px] border-green-500 uppercase" onClick={()=>close("reg")}>
            Register
          </button>
        </div>}
        {isLoggedIn && <button className="absolute top-1 right-4 px-6 py-2 hover:bg-red-300 rounded border-[2px] border-red-500 uppercase my-2" onClick={logout}>Logout</button>}
      
      <div className="pt-28 sm:pt-40">
        <h2 className="uppercase text-xl font-bold text-center">Todo App with Auth</h2>
        <form className="my-4 max-w-[600px] w-full mx-auto shadow-lg bg-gray-300 rounded p-4 h-[70px] flex justify-between items-center">
        <input className="outline-none border-[2px] border-black/60 bg-inherit py-1 w-8/12 md:w-10/12 rounded px-1 placeholder-red-600" type="text" name="heading" value={formData.heading} onChange={handleChange} placeholder={`${error.heading? error.heading : ''}`} />
        {update && <button onClick={updTodo}  className="bg-amber-400 uppercase font-bold rounded p-1">Update</button>}
        {!update && <button onClick={handleForm}  className="bg-amber-400 uppercase font-bold rounded px-4 py-1" disabled={!isLoggedIn}>Add</button>}
        </form>
      
        { isLoggedIn && (<div className="my-12 max-w-[600px] w-full mx-auto border border-gray-200 shadow-lg p-2">
          {todo && todo.map((el)=>
            <div key={el._id} className="flex bg-gray-300 my-4 w-full p-2">
              <div className="flex items-center my-2 w-9/12">
                <input type="checkbox" 
                  onChange={()=>{
                    complete(el._id,)}
                  } 
                  className="" 
                  checked={el.isComplete}/>
            {el.isComplete && 
              <s className="px-2">{el.heading}</s> 
            }
            {!el.isComplete && 
              <p className="px-2">{el.heading}</p>
            }
        </div>
        <div className="flex justify-between items-center w-3/12">
          {!el.isComplete &&
          <span className="text-2xl" onClick={()=>updateTodo(el._id,el.heading,el.description)}>&#9998;</span>
           }
          <span className="text-2xl mr-2" onClick={()=>deleteTodo(el._id)}>&#10005;</span>
        </div></div>)}
        
        </div>) }
      </div>
      
      </div>
    </>
  )
}