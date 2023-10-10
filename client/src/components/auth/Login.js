import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'


function Login() {
    const [user, setUser] = useState({
        email:'', password: ''
    })

    const onChangeInput = e =>{
        const {name, value} = e.target;
        setUser({...user, [name]:value})
    }

    const loginSubmit = async e =>{
        e.preventDefault()
        try {
            const res = await axios.post(`/api_user/login`, {...user})
            if (res.data.success){
                localStorage.setItem('firstLogin', true)
                window.location.href = "/dashboard";
            } else {
                console.log(res.data.msg)
            }
        } catch (err) {
            alert(err)
        }
    }
    return (
        <div className="login-page">
           
            <form onSubmit={loginSubmit}>
                <h2>Login</h2>
                <input type="email" name="email" required autoComplete="on"
                
                placeholder="Email" value={user.email} onChange={onChangeInput} />

                <input type="password" name="password" required autoComplete="on"
                placeholder="Password" value={user.password} onChange={onChangeInput}/>

                <div className="row">
                    <button type="submit">Log In</button>
                </div>
                <div className='register'>
                    <Link to="/register">Create New Account</Link>
                </div>
            </form>
        </div>
    )
}

export default Login
 
