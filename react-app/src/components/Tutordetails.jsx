import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import './pd.css';
import './pf.css';


function Tutordetails() {
    const [tutor, setTutor] = useState(null);
    const [user, setUser] = useState(null);
    const [showSellerInfo, setShowSellerInfo] = useState(false);
    const { productId } = useParams();
    const [addedByUsername, setAddedByUsername] = useState('');

    useEffect(() => {
        const fetchTutorDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/get-subject/${productId}`);
                if (res.data.subject) {
                    setTutor(res.data.subject);
                    const userRes = await axios.get(`http://localhost:4000/get-user/${res.data.subject.addedBy}`);
                    if (userRes.data.user) {
                        setAddedByUsername(userRes.data.user.username);
                    }
                }
            } catch (err) {
                alert('Server Error.');
            }
        };
        fetchTutorDetails();
    }, [productId]);

    useEffect(() => {
        let url = 'http://localhost:4000/Myprofile/' + localStorage.getItem('userId');
        axios.get(url)
            .then((res) => {
                if (res.data.user) {
                    setUser(res.data.user);
                }
            })
            .catch((err) => {
                alert('Server Error.');
            });
    }, []);

    const handleContact = (addedBy) => {
        const url = 'http://localhost:4000/get-user/' + addedBy;
        axios.get(url)
            .then((res) => {
                if (res.data.user) {
                    setUser(res.data.user);
                    setShowSellerInfo(true);
                }
            })
            .catch((err) => {
                alert('Server Error.');
            });
    };

    return (
        <>
            <Header />
            <h3>TUTOR DETAILS:</h3><br/>
            <div className="product-container">
                {tutor && (
                    <div className="content">
                        <div className="video-section">
                            {tutor.videoUrl ? (
                                <div className="main-video">
                                    <video className="video-player" controls>
                                        <source src={`http://localhost:4000/${tutor.videoUrl}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ) : (
                                <div className="main-image">
                                    <img
                                        width="400px"
                                        height="400px"
                                        src={`http://localhost:4000/${tutor.pimages[0]}`}
                                        alt="Tutor"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="details-section">
                            <h4><b>Subject Name: </b>{tutor.sname}</h4>
                            <br />
                            <h5><b>Specialized Topics: </b>{tutor.tname}</h5>
                            <br />
                            <h5><b>Grade: </b>{tutor.grade}</h5>
                            <br />
                            <h5><b>Year: </b>{tutor.year}</h5>
                            <br />
                            <h5><b>Price (Per hour): </b>{tutor.tprice}</h5>
                            <br />
                            <h5>
                                <b>Added by: </b>
                                <a 
                                    href={`/userproducts/${tutor ? tutor.addedBy : ''}`} 
                                    className="link"
                                    onClick={() => console.log('Navigating to user ID:', tutor ? tutor.addedBy : '')}  // Log the navigation
                                >
                                    {addedByUsername}
                                </a>
                            </h5>
                            {!!localStorage.getItem('token') && tutor.addedBy &&
                                <button className="btn col m-9" onClick={() => handleContact(tutor.addedBy)}>Contact Seller</button>}
                        </div>
                    </div>
                )}
            </div>
            {showSellerInfo && user && (
                <div className="m-3 p-3">
                    <h3 className="text-center mt-2">SELLER INFO</h3>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th>Username</th>
                                <td>{user.username}</td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>{user.email}</td>
                            </tr>
                            <tr>
                                <th>Mobile</th>
                                <td>{user.mobile}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default Tutordetails;
