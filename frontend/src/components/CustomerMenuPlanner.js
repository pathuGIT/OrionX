import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerMenuSelection from "./CustomerMenuListSelection"; 
import CustomerMenuTypeSelection from "./CustomerMenuTypeSelection";
import CustomerCategorySelection from "./CustomerCategorySelection";
import CustomerItemSelection from "./CustomerItemSelection";


const CustomerMenuPlanner = () => {
  return (
    <>
      <h2>Customer Menu Planner</h2>
      <CustomerItemSelection />
    </>
  );
};

export default CustomerMenuPlanner;
