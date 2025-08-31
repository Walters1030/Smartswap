

import './index.css';
import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Addproduct from './components/Addproduct';
import Liked from './components/Liked';
import Productdetails from './components/Productdetails';
import Category from './components/Category';
import Myproducts from './components/Myproducts';
import Myprofile from './components/Myprofile';
import Tutor from './components/Tutor';
import Tutordetails from './components/Tutordetails';
import Userproducts from './components/Userproducts'; 


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Home />
    ),
  },
  {
    path: "about",
    element: <div>About</div>,
  },
  {
    path: "/login",
    element: (<Login />),
  },
  {
    path: "/Signup",
    element: (<Signup />),
  },
  {
    path: "/Addproduct",
    element: (<Addproduct />),
  },
  {
    path: "/Liked",
    element: (<Liked />),
  },
  {
    path: "/product/:productId",
    element: (<Productdetails />),
  },
  {
    path: "/Category/:catName",
    element: (<Category />),
  },
  {
    path: "/Myproducts",
    element: (<Myproducts />),
  },
  {
    path: "/Myprofile",
    element: (<Myprofile />),
  },
  {
    path: "/Tutor",
    element: (<Tutor />),
  },
  {
    path: "/Tutordetails/:productId",
    element: (<Tutordetails />),
  },
  {
    path: "/userproducts/:userId",  // Updated route
    element: <Userproducts />,
  },
]);



createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);




