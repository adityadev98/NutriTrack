import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TrackSearch from "@/Pages/TrackSearch";
import FoodItem from "@/Pages/TrackFoodItem";
import '../App.css';

const TrackPage: React.FC = () => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [authError, setAuthError] = useState(false);  // Track authentication status
  const [loading, setLoading] = useState(true);  // Loading state to prevent render until token is verified
  const navigate = useNavigate();
  
  useEffect(() => {
    // Function to check if the token is valid
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthError(true);  // No token, set error
        setLoading(false);  // Set loading to false once we check
        return;
      }

      try {
        const response = await fetch("/api/auth/protected", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setAuthError(false);  // Token is valid, allow access
        } else {
          setAuthError(true);  // Invalid token, set error
          localStorage.removeItem("token");  // Remove invalid token
        }
      } catch (error) {
        setAuthError(true);  // Error during token verification
        localStorage.removeItem("token");  // Remove invalid token
      }

      setLoading(false);  // Set loading to false once token verification is done
    };

    // Run token verification when the component mounts
    verifyToken();
  }, [navigate]);  // Only rerun the effect when navigate changes

  useEffect(() => {
    if (authError) {
      alert("Failed to track food: No valid token, login to continue");
      navigate("/home");  // Redirect immediately
    }
  }, [authError, navigate]);

  // If we're still loading or there's an auth error, prevent rendering the page
  if (loading || authError) {
    return null;  // Prevent rendering the page if there's an auth error or it's still loading
  }

  return (
    <section className="container track-container">
      <header />
      <TrackSearch setSelectedFood={setSelectedFood} />
      {selectedFood && <FoodItem food={selectedFood} />}
    </section>
  );
};

export default TrackPage;
