import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";

import { useParams } from "react-router-dom";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MWUzMDc1Y2IyODkxNGRmZjJjMTZkYWUiLCJuYW1lIjp7ImZpcnN0TmFtZSI6IlRpbSIsIm1pZGRsZU5hbWUiOiJLZXZpbiIsImxhc3ROYW1lIjoiUGhpbGwifSwiaWF0IjoxNjQyMjY4NTUxLCJleHAiOjE2NDQ4NjA1NTF9.CGunPBk6voT_LHSEL1ZEZKSogjt7QoJievoi65uV7jk";

const SingleProduct = () => {
  const [product, setProduct] = useState({});
  let { id } = useParams();

  const getProduct = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/v1/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "http://localhost:3001",
        },
      }
    );
    // console.log(response.data.product);
    setProduct(response.data.product);
  };

  // console.log(id);
  // getProduct();
  useEffect(() => {
    getProduct();
  }, []);

  const { name, price, description, imageArray, likes } = product;

  console.log(imageArray);
  return (
    <main className="single-product-page">
      <Navbar />

      <div className="single-product-container">
        <div className="product-image-slide">
          {imageArray.map((image, index) => {
            return (
              <img
                key={index}
                src={image}
                alt="image of the product"
                className="product-image"
              />
            );
          })}
        </div>

        <div className="product-info">
          <h1>{name}</h1>
          <h2>&#65284;{price / 100}</h2>
          <p>{description}</p>
        </div>
      </div>
    </main>
  );
};

export default SingleProduct;