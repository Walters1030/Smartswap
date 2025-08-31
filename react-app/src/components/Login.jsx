import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";
import axios from "axios";
// import './Header.css'



function Login(){
    const navigate = useNavigate()

    const [pid, setpid]=useState('');
    const [password, setpassword]=useState('');
   

    const handleApi = () => {
        console.log({ pid, password });
        const url = 'http://localhost:4000/login';
        const data = { pid, password };
        axios.post(url, data)
            .then((res) => {
                console.log(res.data);
                if (res.data.message) {
                    alert(res.data.message);
                    if (res.data.token) {
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('userId', res.data.userId);
    
                        
    
                        navigate('/');
                    }
                }
            })
            .catch((err) => {
                alert('SERVER ERR')
            })
    }
    

    return(
        <div>
            <Header />
            <h1 className="text-center mt-2" >Welcome to Login ......</h1>
            <br></br>
            <div className="p-3 m-3">
            <h5>PID</h5>
                <input className="form-control" type="text" value={pid} onChange={(e) => {
                    setpid(e.target.value)
                }} />
                <br></br>
                
                <h5>PASSWORD</h5>
                <input className="form-control" type="text" value={password} onChange={(e) => {
                    setpassword(e.target.value)
                }} />
                <br></br>
                <button className="btn logout-btn m-9" onClick={handleApi}> LOGIN </button>
                <br></br>
                <Link className="btn logout-btn m-9" to="/signup">SIGNUP</Link>
                
            
        </div>
        </div> )
}

export default Login;