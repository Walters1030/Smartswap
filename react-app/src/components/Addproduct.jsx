

import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Addproduct() {
    const navigate = useNavigate();

    const [pname, setpname] = useState('');
    const [pdesc, setpdesc] = useState('');
    const [price, setprice] = useState('');
    const [category, setcategory] = useState('');
    const [pimage, setpimage] = useState([]);
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
        formData.append('pname', pname);
        formData.append('pdesc', pdesc);
             formData.append('price', price);
        formData.append('category', category);
                 pimage.forEach(image => formData.append('pimage', image));
                  formData.append('userId', localStorage.getItem('userId'));
        formData.append('department', localStorage.getItem('department'));


        const url = 'http://localhost:4000/Addproduct';
        axios.post(url, formData)
            .then((res) => {
                if (res.data.message) {
                    alert(res.data.message);
                    // Assuming 'department' is included in the response from the backend
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
            <h1 className="text-center mt-2" >ADD PRODUCT HERE: </h1>
            <div className=" p-3">
                <label> <h5>Product Name</h5> </label>
                <input  className="form-control" type="text" value={pname} onChange={(e) => setpname(e.target.value)} />
                <br></br>
                <label> <h5>Product Description</h5> </label>
          <input className="form-control" type="text" value={pdesc} onChange={(e) => setpdesc(e.target.value)} />
                <br></br>
    <label> <h5>Product Price</h5></label>
     <input className="form-control" type="text" value={price} onChange={(e) => setprice(e.target.value)} />
    <br></br>
     <label>  <h5>Product Category</h5></label>
     <select className="form-control" value={category} onChange={(e) => setcategory(e.target.value)}>
                <option value="">Category</option>
                    <option> Books </option>
                    <option> Notes </option>
                    <option> Cloth </option>
                    <option> Equipment </option>
                    <option> Mobile </option>
                    <option> Laptops </option>
                    <option> Miscellaneous </option>
                </select>
                <br></br>
       <label>  <h5>Product Image</h5></label>
      <input className="form-control" type="file" multiple onChange={(e) => setpimage(Array.from(e.target.files))} />
      <br></br>
                <button onClick={handleApi} className="btn logout-btn mt-3"> SUBMIT </button>
            </div>
        </div>
    );
}

export default Addproduct;