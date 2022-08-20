import {useState} from 'react'
import {useRouter} from 'next/router';

export default function Register({close}){
  const router = useRouter();
  const [formData,setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const handleForm = async (e)=>{
    e.preventDefault();
    const url = 'http://localhost:8001/api/user/register';
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
    //console.log(res)
  }
  const handleChange = (e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setFormData({...formData,[name]:value})
  }
  return(
    <>
    <div className="login">
      <span onClick={()=>close('reg')} className="close">&#10005;</span>
      <h1 className="login-heading">Register</h1>
      <form onSubmit={handleForm} className="login-form">
        <label className="label">Name</label>
        <input className="input" type="text" name="name" value={formData.name} onChange={handleChange} />
        <label className="label">Email</label>
        <input className="input" type="text" name="email" value={formData.email} onChange={handleChange} />
        <label className="label">Password</label>
        <input className="input" type="password" name="password" value={formData.password} onChange={handleChange}/>
        <button className="btn">Register</button>
      </form>
    </div>
    </>
  )
}