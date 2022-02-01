import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";

import { useParams } from "react-router-dom";

import { useUser } from "../contexts/useUser";

// import { useAuth0 } from "@auth0/auth0-react";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MWY1ZDdmMDU3YmQzYTQ1MWJjZmUyNjAiLCJuYW1lIjp7ImZpcnN0TmFtZSI6IlRpbSIsIm1pZGRsZU5hbWUiOiJLZXZpbiIsImxhc3ROYW1lIjoiUGhpbGwifSwiaWF0IjoxNjQzNTAxNjAwLCJleHAiOjE2NDYwOTM2MDB9.4sQiB07AI1GRc5Sp4AvE_5ds0zwe9AUo9yuQNBJN8A4";

// const token = userUser.userCookies.token;

const SingleProduct = () => {
  const [product, setProduct] = useState({});
  let { id } = useParams();

  const { user } = useUser();
  // const { user } = useAuth0();

  // console.log("user", user);

  // console.log("id", id);

  const getProduct = async () => {
    const response = await axios
      .get(`http://localhost:3000/api/v1/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "http://localhost:3001",
        },
      })
      .then((response) => {
        console.log(response.data.product);
        setProduct(response.data.product);
      })
      .catch((err) => console.log(err));
  };

  // console.log(id);
  // getProduct();
  useEffect(() => {
    getProduct();
  }, []);

  // console.log("userID", user.details.user.userID)

  const pushToCart = async () => {
    // console.log("product pushed to user's cart");

    

    // const userID = user.sub.split("|")[1];

    const userID = user.details.user.userID;
    // const userID = "61f5d7f057bd3a451bcfe260";

    
    console.log("userID", userID);

    // const response = await axios.post(
    //   `http://localhost:3000/api/v1/user/${userID}/cart/${id}`,
    //   product,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${user.details.user.token}`,
    //       "Access-Control-Allow-Origin": "http://localhost:3001",

    //     },
    //   }
    // )

    // push pruduct to user's cart
    const response = await axios.post(
      `http://localhost:3000/api/v1/user/${userID}/cart/${id}`,
      product,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "http://localhost:3001",
        },
      }
    );


    console.log(`cart response: ${response}`);
  };

  console.log("product", product);

  const { name, price, description, imageArray, likes } = product;

  console.log("imageArray", imageArray);
  // console.log(imageArray);
  return (
    <main className="single-product-page">
      <div className="single-product-container">
        <div className="product-image-slide">
          {/* {imageArray.map((image) => {
            return (
              <img
                key={Math.random()}
                src={image}
                alt="image of the product"
                className="product-image"
              />
            );
          })} */}
        </div>

        <div className="product-info">
          <h1>{name}</h1>
          <h2>&#65284;{price / 100}</h2>
          <p>{description}</p>
        </div>

        <button onClick={() => pushToCart()}>Add to Cart</button>
      </div>
    </main>
  );
};

export default SingleProduct;
