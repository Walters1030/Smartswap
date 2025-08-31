import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import './pd.css';

function Productdetails() {
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);
    const [showSellerInfo, setShowSellerInfo] = useState(false);
    const { productId } = useParams();
    const [currentImage, setCurrentImage] = useState(0);
    const [addedByUsername, setAddedByUsername] = useState('');

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/get-products/${productId}`);
                if (res.data.product) {
                    setProduct(res.data.product);
                    console.log('Product:', res.data.product);  // Debugging line
                    const userRes = await axios.get(`http://localhost:4000/get-user/${res.data.product.addedBy}`);
                    if (userRes.data.user) {
                        setAddedByUsername(userRes.data.user.username);
                        console.log('User ID:', userRes.data.user._id);  // Log the user ID
                    }
                }
            } catch (err) {
                alert('Server Error.');
            }
        };
        fetchProductDetails();
    }, [productId]);

    useEffect(() => {
        if (product && product.pimages.length > 0) {
            const interval = setInterval(() => {
                setCurrentImage((prevImage) => (prevImage + 1) % product.pimages.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [product]);

    const handleContact = (addedBy) => {
        console.log('Contacting user ID:', addedBy);  // Log the user ID for contact
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
            <h3>PRODUCT DETAILS:</h3><br/>
            <div className="product-container">
                {product && (
                    <div className="content">
                        <div className="image-section">
                            <div className="main-image">
                                <img
                                    width="400px"
                                    height="400px"
                                    src={`http://localhost:4000/${product.pimages[currentImage]}`}
                                    alt={`Product image ${currentImage + 1}`}
                                />
                            </div>
                            <div className="image-grid">
                                {product.pimages.map((image, index) => (
                                    <img
                                        key={index}
                                        width="50px"
                                        height="50px"
                                        src={`http://localhost:4000/${image}`}
                                        alt={`Product image ${index + 1}`}
                                        className="m-2"
                                        onClick={() => setCurrentImage(index)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="details-section">
                            <h4><b>Name: </b>{product.pname} |<b> Category: </b>{product.category}</h4>
                            <br />
                            <h5><b>About:</b><br />{product.pdesc}</h5>
                            <br />
                            <h3 className="price-text">Rs. {product.price} /-</h3>
                            <h5>
                                <b>Added by: </b>
                                <a 
                                    href={`/userproducts/${product ? product.addedBy : ''}`} 
                                    className="link"
                                    onClick={() => console.log('Navigating to user ID:', product ? product.addedBy : '')}  // Log the navigation
                                >
                                    {addedByUsername}
                                </a>
                            </h5>
                            {!!localStorage.getItem('token') && product.addedBy &&
                                <button className="btn col m-9" onClick={() => handleContact(product.addedBy)}>Contact Seller</button>}
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

export default Productdetails;
