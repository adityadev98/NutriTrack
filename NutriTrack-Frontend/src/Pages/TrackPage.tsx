import React, { useState} from "react";
import TrackSearch from "@/Pages/TrackSearch";
import FoodItem from "@/Pages/TrackFoodItem";
import {Sidenav} from "../Components/Sections";
import '../App.css';

const TrackPage: React.FC = () => {
  const [selectedFood, setSelectedFood] = useState(null);
  return (
    <Sidenav>
      <section className="container track-container">
        <header />
        <TrackSearch setSelectedFood={setSelectedFood} />
        {selectedFood && <FoodItem food={selectedFood} />}
      </section>
    </Sidenav>
  );
};

export default TrackPage;
