import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import { FaRegHeart, FaHeart } from "react-icons/fa"; // Import both icons for the liked and unliked states
import './Home.css';

function Home() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [search, setSearch] = useState('');
    const [cProducts, setCProducts] = useState([]);
    const [cTutors, setCTutors] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('All Department');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isSearch, setIsSearch] = useState(false);
    const [likedItems, setLikedItems] = useState([]); // State to store liked items

    // State to track hovered product and its image index
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [hoveredProductIndex, setHoveredProductIndex] = useState(0);

    const handleSearch = (value) => {
        setSearch(value);
    };

    const handleClick = () => {
        filterByCategoryAndSearch(selectedDepartment, selectedCategory, search);
    };

    const handleLike = (item, type, e) => {
        e.stopPropagation();
        let userId = localStorage.getItem('userId');

        if (!userId) {
            alert('Please Login First !!');
            return;
        }

        const url = 'http://localhost:4000/Likes';
        const data = { userId, productId: item._id, type };

        if (isItemLiked(item._id, type)) {
            axios.delete(url, { data })
                .then((res) => {
                    if (res.data.message) {
                        alert('Unliked');
                        fetchLikedItems(); // Reload liked items after unliking
                    }
                })
                .catch((err) => {
                    console.log(err);
                    alert('Server Error.');
                });
        } else {
            axios.post(url, data)
                .then((res) => {
                    if (res.data.message) {
                        alert('Liked');
                        fetchLikedItems(); // Reload liked items after liking
                    }
                })
                .catch((err) => {
                    console.log(err);
                    alert('Server Error.');
                });
        }
    };

    const handleProduct = (id, type) => {
        navigate(`/product/${id}`);
    };

    const handleSubject = (id) => {
        navigate('/Tutordetails/' + id);
    };

    const handleCategory = (value) => {
        setSelectedCategory(value);
    };

    const handleDepartmentChange = (value) => {
        setSelectedDepartment(value);
    };

    const filterByCategoryAndSearch = (department, category, searchQuery) => {
        let filteredProducts = products.filter((item) => {
            const matchesDepartment = department === "All Department" || item.department === department;
            const matchesCategory = category === '' || item.category === category;
            const matchesSearch = searchQuery === '' ||
                item.pname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.pdesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesDepartment && matchesCategory && matchesSearch;
        });

        let filteredTutors = tutors.filter((item) => {
            const matchesDepartment = department === "All Department" || item.department === department;
            const matchesCategory = category === '' || item.category === category;
            const matchesSearch = searchQuery === '' ||
                item.sname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.year.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesDepartment && matchesCategory && matchesSearch;
        });

        setCProducts(filteredProducts);
        setCTutors(filteredTutors);
        setIsSearch(searchQuery !== '');
    };

    const fetchLikedItems = () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        axios.get(`http://localhost:4000/user/${userId}/likes`)
            .then((res) => {
                if (res.data) {
                    setLikedItems(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
                alert('Server Error.');
            });
    };

    useEffect(() => {
        const url = 'http://localhost:4000/get-product';
        axios.get(url)
            .then((res) => {
                if (res.data.products) {
                    setProducts(res.data.products);
                    setCProducts(res.data.products);
                }
            })
            .catch((err) => {
                console.log(err);
                alert('Server Error.');
            });

        const tutorUrl = 'http://localhost:4000/get-tutors';
        axios.get(tutorUrl)
            .then((res) => {
                if (res.data.tutors) {
                    setTutors(res.data.tutors);
                    setCTutors(res.data.tutors);
                }
            })
            .catch((err) => {
                console.log(err);
                alert('Server Error.');
            });

        fetchLikedItems(); // Fetch liked items when component mounts
    }, []);

    useEffect(() => {
        filterByCategoryAndSearch(selectedDepartment, selectedCategory, search);
    }, [selectedDepartment, selectedCategory, search, products, tutors]);

    useEffect(() => {
        let interval;
        if (hoveredProduct) {
            interval = setInterval(() => {
                setHoveredProductIndex((prevIndex) => {
                    const newIndex = (prevIndex + 1) % products.find(p => p._id === hoveredProduct).pimages.length;
                    return newIndex;
                });
            }, 3000);
        }

        return () => clearInterval(interval);
    }, [hoveredProduct]);

    const isItemLiked = (itemId, type) => {
        return likedItems.some(like => like.id === itemId && like.type === type);
    };

    return (
        <div style={{ height: '100%' }}>
            <Header search={search} handleSearch={handleSearch} handleClick={handleClick} onDepartmentChange={handleDepartmentChange} />
            <Categories handleCategory={handleCategory} />
            <div className="idk">
                {isSearch && (
                    <>
                        <h5>
                            SEARCH RESULTS
                            <button className="clear-btn" onClick={() => {
                                setIsSearch(false);
                                setCProducts(products);
                                setCTutors(tutors);
                                setSearch('');
                                setSelectedDepartment('All Department');
                                setSelectedCategory('');
                            }}>CLEAR</button>
                        </h5>
                        {cProducts.length === 0 && cTutors.length === 0 && <h5>No Results Found</h5>}
                    </>
                )}
                <div className="d-flex justify-content-center flex-wrap">
                    {cProducts.length > 0 && cProducts.map((item) => (
                        <div 
                            onMouseEnter={() => {
                                setHoveredProduct(item._id);
                                setHoveredProductIndex(0);
                            }} 
                            onMouseLeave={() => setHoveredProduct(null)} 
                            onClick={() => handleProduct(item._id, 'product')} 
                            key={item._id} 
                            className="card m-3"
                        >
                            <div onClick={(e) => handleLike(item, 'product', e)} className="icon-con">
                                {isItemLiked(item._id, 'product') ? <FaHeart className="icons liked" color="#FF0000" /> : <FaRegHeart className="icons" />}
                            </div>
                            {item.pimages && item.pimages.length > 0 && (
                                <img 
                                    src={`http://localhost:4000/${item.pimages[hoveredProduct === item._id ? hoveredProductIndex : 0]}`} 
                                    alt={item.pname} 
                                />
                            )}
                            <div className="card-content">
                                <p className="product-title">{item.pname} | {item.category}</p>
                                <h3 className="text-danger">Rs {item.price}/-</h3>
                                <p className="product-description text-success">{item.pdesc}</p>
                            </div>
                        </div>
                    ))}
                    {cTutors.length > 0 && cTutors.map((tutor) => (
                        <div onClick={() => handleSubject(tutor._id)} key={tutor._id} className="scard m-3">
                            <div onClick={(e) => handleLike(tutor, 'tutor', e)} className="icon-con">
                                {isItemLiked(tutor._id, 'tutor') ? <FaHeart className="icons liked" color="#FF0000"/> : <FaRegHeart className="icons" />}
                            </div>
                            {tutor.videoUrl ? (
                                <div className="video-container">
                                    <video width="100%" height="auto" controls>
                                        <source src={`http://localhost:4000/${tutor.videoUrl}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ) : (
                                <img src={'http://localhost:4000/uploads/Resource.jpeg'} alt="Tutor" />
                            )}
                            <div className="scard-content">
                                <p className="product-title">{tutor.sname} | Grade: {tutor.grade}</p>
                                <h3 className="text-danger">Rs {tutor.tprice}/-</h3>
                                <p className="product-description text-success">{tutor.tname}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
