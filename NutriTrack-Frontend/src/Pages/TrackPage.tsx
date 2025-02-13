import React, { useState } from "react";
import header from "@/Services/header.js";
import TrackSearch from "@/Components/ui/trackSearch";
import FoodDetails from "@/Components/ui/foodDetails";
import FoodItem from "@/Components/ui/foodItem"
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
