
const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { ObjectId } = require('mongodb');

// Set up Express app
const app = express();
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 4000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


// Connect to MongoDB
mongoose.connect('mongodb+srv://rachelwalters7080_db_user:Dk3J8My6Ai2JIvoD@cluster0.cz5exsz.mongodb.net/');

// Define MongoDB models
const Users = mongoose.model('Users', { pid: String, username: String, password: String,mobile:{ type: Number, unique: true } ,email:String,department:String,Likes: [{ type: { type: String }, id: mongoose.Schema.Types.ObjectId }] });
const Products = mongoose.model('Products', { pname: String, pdesc: String, price: Number, category: String, pimages: [String], addedBy: mongoose.Schema.Types.ObjectId , 
  department:String});
  const Subjects = mongoose.model('Subjects', {
    sname: String,
    tname: String,
    year: String,
    category: String,
    grade: Number,
    tprice: Number,
    addedBy: mongoose.Schema.Types.ObjectId,
    department: String,
    videoUrl: String // Add this field
  });
  


  

// Define routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/Search', (req, res) => {
  console.log(req.query);
  let department = req.query.department;
  let search = req.query.search;

  let query = {};

  if (search) {
    query.$or = [
      { pname: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } }
    ];
  }

  if (department) {
    query.department = department;
  }

  Products.find(query)
    .then((results) => {
      res.send({ message: 'success', products: results });
    })
    .catch((error) => {
      console.error('Search error:', error);
      res.status(500).send({ message: 'search error' });
    });
});


app.post('/Likes', (req, res) => {
  let { productId, userId, type } = req.body;
  const update = { $addToSet: { Likes: { type, id: productId } } };

  Users.updateOne({ _id: userId }, update)
      .then(() => res.send({ message: 'Liked!' }))
      .catch(() => res.send({ message: 'server error' }));
});


app.post('/Addproduct', upload.array('pimage', 10), (req, res) => {

console.log(req.files);
console.log(req.body);


  try {
    const pimages = req.files.map(file => file.path);
    const { pname, pdesc, price, category, userId } = req.body;

    // Check if userId exists
    Users.findById(userId)
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: 'User not found!' });
        }

        // Create the product with the department information
        const product = new Products({
          pname,
          pdesc,
          price,
          category,
          pimages,
          addedBy: userId,
          department: user.department // Assign user's department to the product
        });



        product.save()
          .then(() => res.send({ message: 'Saved Successfully!' }))
          .catch((err) => {
            console.error('Error saving product:', err);
            res.status(500).send({ message: 'Server error' });
          });
      })
      .catch(error => {
        console.error('Error finding user:', error);
        res.status(500).send({ message: 'Server error' });
      });
  } catch (err) {
    console.error('Error in route handler:', err);
    res.status(500).send({ message: 'Server error' });
  }
});


app.get('/get-products/:id', (req, res) => {
  Products.findOne({ _id: req.params.id })
    .then((result) => res.send({ message: 'success', product: result }))
    .catch(() => res.send({ message: 'fetch error' }));
});

app.get('/get-product', (req, res) => {
  const catName = req.query.catName;
  let filter = catName ? { category: catName } : {};

  Products.find(filter)
    .then((result) => res.send({ message: 'success', products: result }))
    .catch(() => res.send({ message: 'fetch error' }));
});
app.get('/user/:userId/likes', async (req, res) => {
  try {
    const user = await Users.findById(req.params.userId).populate('Likes.id');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user.Likes);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Backend route to get products by IDs
app.post('/get-products-by-ids', async (req, res) => {
  try {
      const products = await Products.find({ '_id': { $in: req.body.ids } });
      res.json(products);
  } catch (error) {
      res.status(500).send('Server Error');
  }
});

// Backend route to get tutors by IDs
app.post('/get-tutors-by-ids', async (req, res) => {
  try {
      const tutors = await Subjects.find({ '_id': { $in: req.body.ids } });
      res.json(tutors);
  } catch (error) {
      res.status(500).send('Server Error');
  }
});


app.post('/Liked', (req, res) => {
  const userId = req.body.userId;

  Users.findOne({ _id: userId }).populate({
      path: 'Likes.id',
      model: function(doc) {
          return doc.type === 'product' ? 'Products' : 'Subjects';
      }
  })
  .then(user => {
      const likedProducts = user.Likes.filter(item => item.type === 'product').map(item => item.id);
      const likedTutors = user.Likes.filter(item => item.type === 'tutor').map(item => item.id);

      res.send({ message: 'success', likedProducts, likedTutors });
  })
  .catch(() => res.send({ message: 'fetch error' }));
});

app.post('/userproducts', (req, res) => {
  const userId = req.body.userId;

  // Find products and tutors added by the user
  Promise.all([
    Products.find({ addedBy: userId }),
    Subjects.find({ addedBy: userId })
  ])
    .then(([products, tutors]) => {
      res.send({ message: 'success', products, tutors });
    })
    .catch((error) => {
      console.error('Error fetching products and tutors:', error);
      res.status(500).send({ message: 'Server error', error: error.message });
    });
});

app.post('/Myproducts', (req, res) => {
  const userId = req.body.userId;

  // Find products and tutors added by the user
  Promise.all([
    Products.find({ addedBy: userId }),
    Subjects.find({ addedBy: userId })
  ])
    .then(([products, tutors]) => {
      res.send({ message: 'success', products, tutors });
    })
    .catch((error) => {
      console.error('Error fetching products and tutors:', error);
      res.status(500).send({ message: 'Server error', error: error.message });
    });
});

app.get('/my-tutors', (req, res) => {
  const userId = req.user.id; // Assuming you're using JWT authentication
  Tutor.find({ userId })
      .then(tutors => {
          res.json({ tutors });
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Server Error' });
      });
});
// app.post('/Myproducts', (req, res) => {
  
  
//   const userId = req.body.userId;

  
  
//     Products.find({ addedBy: userId }),
//     Subjects.find({ addedBy: userId })
  
//     .then((result) => {
//       res.send({ message: 'success', products:result, tutors: result });
//     })
//     .catch((error) => {
//       console.error('Error fetching products and tutors:', error);
//       res.status(500).send({ message: 'Server error', error: error.message });
//     });
// });

app.get('/Myprofile/:userId',(req,res)=>{
  let uid = req.params.userId
  Users.findOne({_id:uid})
  .then((result) => res.send({ message: 'success', user:{
    pid:result.pid,
    email:result.email,
    mobile:result.mobile,
    username:result.username,
    department:result.department
  } }))
    .catch(() => res.send({ message: 'fetch error' }));
  
})

app.delete('/delete-product/:productId', (req, res) => {
  const productId = req.params.productId;
  const userId = req.body.userId;

  
  Products.findOne({ _id: productId, addedBy: userId })
   .then((product) => {
      if (!product) {
        return res.status(403).send({ message: 'You are not authorized to delete this product.' });
      }

      
      Products.deleteOne({ _id: productId })
       .then(() => res.send({ message: 'Product deleted successfully.' }))
       .catch((error) => {
          console.error('Error deleting product:', error);
          res.status(500).send({ message: 'Server error' });
        });
    })
   .catch((error) => {
      console.error('Error finding product:', error);
      res.status(500).send({ message: 'Server error' });
    });
});

app.delete('/delete-tutor/:tutorId', (req, res) => {
  const tutorId = req.params.tutorId; // Get tutorId from URL parameters
  const userId = req.body.userId; // Get userId from request body

  // Find the tutor with the specified ID and ensure it was added by the requesting user
  Subjects.findOne({ _id: tutorId, addedBy: userId })
    .then((tutor) => {
      if (!tutor) {
        return res.status(403).send({ message: 'You are not authorized to delete this tutor.' });
      }

      // Delete the tutor
      Subjects.deleteOne({ _id: tutorId })
        .then(() => res.send({ message: 'Tutor deleted successfully.' }))
        .catch((error) => {
          console.error('Error deleting tutor:', error);
          res.status(500).send({ message: 'Server error' });
        });
    })
    .catch((error) => {
      console.error('Error finding tutor:', error);
      res.status(500).send({ message: 'Server error' });
    });
});



app.post('/Signup', (req, res) => {
  const { pid, username, password, mobile, email, department } = req.body;

  // Validate mobile number format
  const mobileNumberPattern = /^\d{10}$/;
  if (!mobileNumberPattern.test(mobile)) {
    return res.status(400).send({ message: 'Mobile number must be exactly 10 digits!' });
  }

  // Check if PID or email or mobile already exists
  Users.findOne({ $or: [{ pid }, { email }, { mobile: Number(mobile) }] })
    .then(existingUser => {
      if (existingUser) {
        if (existingUser.pid === pid) {
          return res.status(400).send({ message: 'PID already exists!' });
        } else if (existingUser.email === email) {
          return res.status(400).send({ message: 'Email already exists!' });
        } else if (existingUser.mobile === Number(mobile)) {
          return res.status(400).send({ message: 'Mobile number already exists!' });
        }
      }

      // If no duplicates found, create new user
      const user = new Users({ pid, username, password, mobile: Number(mobile), email, department });

      user.save()
        .then(() => res.send({ message: 'Sign-up Successful!' }))
        .catch(() => res.status(500).send({ message: 'Server error' }));
    })
    .catch(() => res.status(500).send({ message: 'Server error' }));
});



app.post('/login', (req, res) => {
  const { pid, password } = req.body;

  Users.findOne({ pid })
    .then((result) => {
      if (!result) {
        res.send({ message: 'User Not Found!' });
      } else if (result.password === password) {
        const token = jwt.sign({ data: result }, 'Mykey', { expiresIn: '1h' });
        res.send({ message: 'Login Successful!', token, userId: result._id });
      } else {
        res.send({ message: 'Password incorrect!' });
      }
    })
    .catch(() => res.send({ message: 'login error' }));
});



app.get('/get-user/:uId',(req,res)=>{
const userId = req.params.uId;


  Users.findOne({ _id: userId })
  .then((result) => res.send({ message: 'Successful!',user:{email:result.email,mobile:result.mobile,username: result.username}}))
  .catch(() => res.send({ message: 'error' }));


})

app.post('/Tutor', upload.single('video'), (req, res) => {
  console.log("Request body:", req.body);

  const { sname, tname, tprice, grade, year, category, userId } = req.body;
  const videoUrl = req.file ? req.file.path : '';

  Users.findById(userId)
    .then(user => {
      if (!user) {
        console.log("User not found:", userId);
        return res.status(404).send({ message: 'User not found!' });
      }

      const subject = new Subjects({
        sname,
        tname,
        tprice,
        year,
        category,
        grade,
        addedBy: userId,
        department: user.department,
        videoUrl // Save the video URL
      });

      subject.save()
        .then(() => {
          console.log("Subject saved successfully");
          res.send({ message: 'Saved Successfully!' });
        })
        .catch((err) => {
          console.error('Error saving subject:', err);
          res.status(500).send({ message: 'Server error' });
        });
    })
    .catch(error => {
      console.error('Error finding user:', error);
      res.status(500).send({ message: 'Server error' });
    });
});
app.get('/get-video/:id', (req, res) => {
  const videoId = req.params.id;
  // Retrieve and serve the video based on its ID or path
});



app.get('/get-tutors', (req, res) => {
  Subjects.find({})
     .then(tutors => {
          const tutorsWithImages = tutors.map(tutor => ({
             ...tutor.toObject(),
              imageUrl: '/uploads/Resource.jpeg'
          }));
          res.status(200).json({ tutors: tutorsWithImages });
      })
     .catch(err => {
          console.error(err);
          res.status(500).json({ message: 'Server error' });
      });
});
app.delete('/Likes', (req, res) => {
  let { productId, userId, type } = req.body;
  const update = { $pull: { Likes: { type, id: productId } } };

  Users.updateOne({ _id: userId }, update)
      .then(() => res.send({ message: 'Unliked!' }))
      .catch(() => res.send({ message: 'server error' }));
});


app.get('/get-subject/:id', (req, res) => {
  Subjects.findOne({ _id: req.params.id })
    .then((result) => res.send({ message: 'success', subject: result }))
    .catch(() => res.send({ message: 'fetch error' }));
});

app.get('/get-user/:uId', (req, res) => {
  const userId = req.params.uId;

  Users.findOne({ _id: userId })
    .then((result) => res.send({ message: 'Successful!', user: { email: result.email, mobile: result.mobile, username: result.username } }))
    .catch(() => res.send({ message: 'error' }));
});


// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
