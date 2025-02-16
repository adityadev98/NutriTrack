import React, { useState } from "react";
import header from "@/";
import TrackSearch from "@/Pages/TrackSearch";
import FoodItem from "@/Pages/TrackfoodItem"
import '../TrackPage.css';

const TrackPage: React.FC = () => {
  const [selectedFood, setSelectedFood] = useState(null);
  return (
    <section className="container track-container">
      <header />
      <TrackSearch setSelectedFood={setSelectedFood} />
      {selectedFood && <FoodItem food={selectedFood} />}
    </section>
  );
};

export default TrackPage;
