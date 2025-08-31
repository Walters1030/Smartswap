import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";
import axios from "axios";

function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [pid, setPid] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const departments = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Business Administration"];

    const handleApi = () => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@(shiats.edu.in|shuats.edu.in)$/;

        // Basic front-end validation
        if (!pid || !username || !password || !mobile || !email || !selectedDepartment) {
            setErrorMessage("All fields are required!");
            return;
        }

        if (!emailPattern.test(email)) {
            setErrorMessage("Please use college email ID");
            return;
        }

        const mobileNumberPattern = /^\d{10}$/;
        if (!mobileNumberPattern.test(mobile)) {
            setErrorMessage('Mobile number must be exactly 10 digits!');
            return;
        }

        const url = 'http://localhost:4000/Signup';
        const data = { pid, username, password, mobile, email, department: selectedDepartment };

        axios.post(url, data)
            .then((res) => {
                if (res.data.message) {
                    alert(res.data.message);
                    navigate('/Login');
                }
            })
            .catch((err) => {
                if (err.response && err.response.data && err.response.data.message) {
                    setErrorMessage(err.response.data.message);
                } else {
                    setErrorMessage("SERVER ERROR");
                }
            });
    }

    return (
        <div>
            <Header />
            <h1 className="text-center mt-2">Welcome to Signup ......</h1>
            <br />
            <div className="p-3 m-3">
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <h5>PID</h5>
                <input className="form-control" type="text" value={pid} onChange={(e) => setPid(e.target.value)} />
                <br />
                <h5>USERNAME</h5>
                <input className="form-control" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                <br />
                <h5>PASSWORD</h5>
                <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <h5>PHONE NUMBER</h5>
                <input className="form-control" type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                <br />
                <h5>EMAIL</h5>
                <input className="form-control" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <h5>DEPARTMENT</h5>
                <select className="form-control" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                    <option value="">Select Department</option>
                    {departments.map((dept, index) => (
                        <option key={index} value={dept}>{dept}</option>
                    ))}
                </select>
                <br />
                <button className="btn logout-btn m-9" onClick={handleApi}> Signup </button>
                <br />
                <Link className="btn logout-btn m-9" to="/Login">LOGIN</Link>
            </div>
        </div>
    )
}

export default Signup;
