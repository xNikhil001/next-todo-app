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
      <span onClick={()=>close('login')} className="close">&#10005;</span>
      <h1 className="login-heading">Login</h1>
      <form onSubmit={handleForm} className="login-form">
        <label className="label">Email</label>
        <input className="input" type="text" name="email" value={formData.email} onChange={handleChange} />
        <label className="label">Password</label>
        <input className="input" type="password" name="password" value={formData.password} onChange={handleChange}/>
        <button className="btn">Login</button>
      </form>
    </div>
    </>
  )
}