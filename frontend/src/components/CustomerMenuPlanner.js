import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerMenuSelection from "./CustomerMenuListSelection"; 
import CustomerMenuTypeSelection from "./CustomerMenuTypeSelection";
import CustomerCategorySelection from "./CustomerCategorySelection";
import CustomerItemSelection from "./CustomerItemSelection";


const CustomerMenuPlanner = () => {
  return (
    <Routes>
      <Route path="/menu-listtype/:menuListTypeId" element={<CustomerMenuSelection />} />
      <Route path="/menu-type/:menuTypeId" element={<CustomerMenuTypeSelection />} />
      <Route path="/menu-category/:categoryId" element={<CustomerCategorySelection/>}/>
      <Route path="/menu-item/:itemId" element={<CustomerItemSelection/>}/>
    </Routes>
  );
};

export default CustomerMenuPlanner;
