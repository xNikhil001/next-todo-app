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
    description: ""
  })
  const handleForm = async (e)=>{
    e.preventDefault();
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
    //console.log(res)
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
    localStorage.clear();
    if(res.ok){
      router.reload()
    }
  }
  return(
    <>
    <h2>Todo App with Auth</h2>
    {openLogin && <Login close={close}/>}
    {openRegister && <Register close={close}/>}
    {!isLoggedIn && <><button onClick={()=>close("login")}>Login</button><button onClick={()=>close("reg")}>Register</button></>}
    {isLoggedIn && <button onClick={logout}>Logout</button>}
    <div className="todo-container">
    {todo && todo.map((el)=><div key={el._id} className="todos"><div className="heading"><input type="checkbox" 
    onChange={()=>{
      complete(el._id,)}
    } className="done-btn" checked={el.isComplete}/>
   {el.isComplete && <s>{el.heading}</s> }
   {!el.isComplete && <p>{el.heading}</p>}
   </div>
      <div className="img-container">
      <img className="del-img" src="./delete.svg" width="30px" height="30px" onClick={()=>deleteTodo(el._id)} />
    {!el.isComplete &&
      <img className="upd-img" src="./edit.svg" width="20px" height="20px" onClick={()=>updateTodo(el._id,el.heading,el.description)} />
    }</div></div>)}
    </div>
      <form className="login-form">
        <label className="label">Heading</label>
        <input className="input" type="text" name="heading" value={formData.heading} onChange={handleChange} />
        <label className="label">Description</label>
        <input className="input" type="description" name="description" value={formData.description} onChange={handleChange}/>
        {update && <button onClick={updTodo}  className="btn">Update</button>}
        {!update && <button onClick={handleForm}  className="btn">Add</button>}
      </form>
    </>
  )
}