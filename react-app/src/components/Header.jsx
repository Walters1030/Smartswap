import { Link, useNavigate } from "react-router-dom";
import './Header.css';
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from 'axios';

function Header(props) {
    const navigate = useNavigate();
    const [selectedDepartment, setSelectedDepartment] = useState(localStorage.getItem('department') || "All Department");
    const [showOver, setShowOver] = useState(false);
    const [userInitial, setUserInitial] = useState('');

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (token && userId) {
            try {
                const response = await axios.get(`http://localhost:4000/Myprofile/${userId}`);
                if (response.data && response.data.user) {
                    const firstNameInitial = response.data.user.username.charAt(0).toUpperCase();
                    setUserInitial(firstNameInitial);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        } else {
            setUserInitial(''); // Clear userInitial if no token/userId
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        alert('We will Miss you ....');
        setUserInitial(''); // Clear the userInitial state on logout
        navigate('/');
    }

    const handleDepartmentChange = (e) => {
        const department = e.target.value;
        setSelectedDepartment(department);
        localStorage.setItem('department', department);
        console.log("Selected Department in Header:", department);
        props.onDepartmentChange && props.onDepartmentChange(department);
    }

    return( 
        <div className='header-container d-flex justify-content-between'>
            <div className="header">
                <h1 className="website-name">SmartSwap</h1>
                <h1 onClick={() => {
                    if (window.location.pathname !== '/') {
                        window.location.href = '/';
                    } else {
                        window.location.reload();
                    }
                }} className="links" style={{ cursor: 'pointer' }}>HOME</h1>

                <select 
                    className="department-select" 
                    value={selectedDepartment} 
                    onChange={handleDepartmentChange}
                >
                    {["All Department", "Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Business Administration"].map((dept, index) => (
                        <option key={index} value={dept}>{dept}</option>
                    ))}
                </select>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        className='search'
                        type='text'
                        value={props.search}
                        onChange={(e) => props.handleSearch && props.handleSearch(e.target.value)}
                    />
                    <button className='search-btn' onClick={props.handleClick}>
                        <FaSearch />
                    </button>
                </div>
            </div>
            <div>
                <div onClick={() => setShowOver(!showOver)} style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#002f34',
                    width: '40px',
                    height: '40px',
                    color: '#fff',
                    fontSize: '14px',
                    borderRadius: '50%',
                    cursor: 'pointer'
                }}>
                    {userInitial}
                </div>

                {showOver && <div style={{
                    minHeight: '60px',
                    width: '200px',
                    background: '#eee',
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    zIndex: 10,
                    marginTop: '50px',
                    marginRight: '50px',
                    color: 'red',
                    fontSize: '14px',
                    background: '#002f34',
                    borderRadius: '7px'
                }}>
                    {!!localStorage.getItem('token') && <Link to="/Liked"><button className="btn logout-btn">LIKES</button></Link>}
                    {!!localStorage.getItem('token') && <Link to="/Addproduct"><button className="btn logout-btn">ADD PRODUCT</button></Link>}
                    {!!localStorage.getItem('token') && <Link to="/Tutor"><button className="btn logout-btn">BECOME TUTOR</button></Link>}
                    {!!localStorage.getItem('token') && <Link to="/Myproducts"><button className="btn logout-btn">MY ADS</button></Link>}
                    {!!localStorage.getItem('token') && <Link to="/Myprofile"><button className="btn logout-btn">MY PROFILE</button></Link>}
                    {!localStorage.getItem('token') ? (
                        <>
                            <Link className="login" to="/Login">LOGIN</Link>
                            <br />
                            <Link className="login" to="/Signup">SIGNUP</Link>
                        </>
                    ) : (
                        <button className="btn logout-btn" onClick={handleLogout}>LOGOUT</button>
                    )}
                </div>}
            </div>
        </div>
    );
}

export default Header;
