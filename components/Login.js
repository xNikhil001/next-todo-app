import {useState} from 'react'
import {useRouter} from 'next/router';

export default function Login({close}){
  const router = useRouter();
  const [formData,setFormData] = useState({
    email: "",
    password: ""
  })
  const handleForm = async (e)=>{
    e.preventDefault();
    const url = 'http://localhost:8001/api/user/login';
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
    if(res.ok){
      localStorage.setItem('isLoggedIn',true)
      router.reload()
    }
    if(!res.ok) alert(res.msg)
    //console.log(res)
  }
  const handleChange = (e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setFormData({...formData,[name]:value})
  }
  return(
    <>
    <div className="absolute top-0 left-0 w-full h-screen bg-black/70 z-50">
      <div className="bg-red-100 w-[300px] h-[380px] flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span onClick={()=>close('login')} className="p-3 text-lg">&#10005;</span>
        <h1 className="uppercase text-center text-lg">Login</h1>
        <form onSubmit={handleForm} className="flex flex-col p-4">
        <label className="">Email</label>
        <input className="outline-none border-b-[2px] border-black/70 bg-inherit" type="text" name="email" value={formData.email} onChange={handleChange} />
        <label className="mt-8">Password</label>
        <input className="outline-none border-b-[2px] border-black/70 bg-inherit" type="password" name="password" value={formData.password} onChange={handleChange}/>
        <button className="w-4/12 mx-auto mt-16 border-[2px] py-2 border-black/70">Login</button>
      </form>
      </div>
    </div>
    </>
  )
}