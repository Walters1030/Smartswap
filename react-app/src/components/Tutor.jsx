import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Tutor() {
    const navigate = useNavigate();

    const [sname, setsname] = useState('');
    const [tname, settname] = useState('');
    const [tprice, settprice] = useState('');
    const [year, setyear] = useState('');
    const [grade, setgrade] = useState('');
    const [category, setcategory] = useState('Tutor');
    const [video, setVideo] = useState(null);

    const [department, setDepartment] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
        const userDepartment = localStorage.getItem('department');
        setDepartment(userDepartment);
    }, [navigate]);

    const handleApi = () => {
        const formData = new FormData();
        formData.append('sname', sname);
        formData.append('tname', tname);
        formData.append('tprice', tprice);
        formData.append('grade', grade);
        formData.append('year', year);
        formData.append('category', 'Tutor');
        formData.append('userId', localStorage.getItem('userId'));
        formData.append('department', localStorage.getItem('department'));
        if (video) {
            formData.append('video', video);
        }

        console.log("FormData:", formData); // Log FormData

        const url = 'http://localhost:4000/Tutor';
        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            if (res.data.message) {
                alert(res.data.message);
                if (res.data.department) {
                    localStorage.setItem('department', res.data.department); 
                }
                navigate('/');
            }
        })
        .catch((err) => {
            console.error('Server error:', err);
        });
    };
    
    return (
        <div>
            <Header />
            <h1 className="text-center mt-2">ADD DETAILS HERE: </h1>
            <div className="p-3">
                <label><h5>Subject Name</h5></label>
                <input className="form-control" type="text" value={sname} onChange={(e) => setsname(e.target.value)} />
                <br />
                <label><h5>Specilized Topics</h5></label>
                <input className="form-control" type="text" value={tname} onChange={(e) => settname(e.target.value)} />
                <br />
                <label><h5>Current Year</h5></label>
                <select className="form-control" value={year} onChange={(e) => setyear(e.target.value)}>
                    <option value="">Year</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                </select>
                <br />
                <label><h5>Grade Accquired in the Subject</h5></label>
                <input className="form-control" type="text" value={grade} onChange={(e) => setgrade(e.target.value)} />
                <br />
                <label><h5>Price Per Hour</h5></label>
                <input className="form-control" type="text" value={tprice} onChange={(e) => settprice(e.target.value)} />
                <br />
                <label><h5>Upload Video</h5></label>
                <input 
                    className="form-control" 
                    type="file" 
                    accept="video/*" 
                    onChange={(e) => setVideo(e.target.files[0])} 
                />
                <br />
                <button onClick={handleApi} className="btn logout-btn mt-3">SUBMIT</button>
            </div>
        </div>
    );
}

export default Tutor;
