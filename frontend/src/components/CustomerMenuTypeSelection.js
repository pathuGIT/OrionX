import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllMenuViews, saveCustomerMenuSelection } from "../services/MenuService";
import { Loader2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

const CustomerMenuTypeSelection = () => {
  // Extract menuListTypeId from URL parameters
  const { menuListTypeId } = useParams();

  // State declarations
  const [menuViews, setMenuViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMenuTypeId, setExpandedMenuTypeId] = useState(null);
  const [selections, setSelections] = useState({}); // Store selected items

  // Fetch menu views when component loads
  useEffect(() => {
    const fetchMenuViews = async () => {
      try {
        const data = await getAllMenuViews();

        // Filter menu types by selected menu list type (e.g., Wedding, Party)
        const filtered = data.filter(
          (view) =>
            view.menu_list_type_id?.trim().toLowerCase() ===
            menuListTypeId?.trim().toLowerCase()
        );
        console.log("Filtered menu views:", filtered);
        setMenuViews(filtered);
      } catch (err) {
        console.error(err);
        setError("Failed to load menu types.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuViews();
  }, [menuListTypeId]);

  useEffect(() => {
    console.log("Selections updated:", selections);
  }, [selections]);

  // Update: handle selection with item_limit enforcement
  const handleSelect = (menuTypeId, categoryId, ICMT_Id, isSingleChoice) => {
    setSelections((prev) => {
      const prevMenu = prev[menuTypeId] || {};
      const prevCategory = prevMenu[categoryId] || [];

      let updatedCategory;
      if (isSingleChoice) {
        // Only one can be selected (radio)
        updatedCategory = [ICMT_Id];
      } else {
        // Multiple can be selected (checkbox)
        if (prevCategory.includes(ICMT_Id)) {
          // Deselect if already selected
          updatedCategory = prevCategory.filter((id) => id !== ICMT_Id);
        } else {
          // Add if under limit
          const categoryLimit = (
            menuViews.find(
              (v) =>
                v.menu_type_id === menuTypeId &&
                v.category_id === categoryId
            )?.item_limit || 1
          );
          if (prevCategory.length < categoryLimit) {
            updatedCategory = [...prevCategory, ICMT_Id];
          } else {
            // At limit, do not add more
            updatedCategory = prevCategory;
          }
        }
      }

      return {
        ...prev,
        [menuTypeId]: {
          ...prevMenu,
          [categoryId]: updatedCategory,
        },
      };
    });
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  // Show error message if fetch fails
  if (error) {
    return (
      <div className="text-red-600 flex items-center gap-2 px-4 py-4">
        <AlertCircle /> {error}
      </div>
    );
  }

  // Group menuViews by menu_type_id and organize by categories
  const groupedMenu = () => {
    const map = new Map();

    menuViews.forEach((item) => {
      if (!map.has(item.menu_type_id)) {
        map.set(item.menu_type_id, {
          menu_type_id: item.menu_type_id,
          menu_type_name: item.menu_type_name,
          price: item.price,
          categories: {},
        });
      }

      const menu = map.get(item.menu_type_id);

      if (!menu.categories[item.category_id]) {
        menu.categories[item.category_id] = {
          category_id: item.category_id,
          category_name: item.category_name,
          item_limit: item.item_limit,
          items: [],
        };
      }

      // Push items to appropriate category
      menu.categories[item.category_id].items.push({
        item_id: item.item_id,
        item_name: item.item_name,
        ICMT_Id: item.ICMT_Id,
      });
    });

    console.log("Grouped menu map:", map); // <-- Add this line to view the map in the console

    return Array.from(map.values());
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/menu8.jpg')" }} // Background image
    >
      <div className="min-h-screen bg-white bg-opacity-40 backdrop-blur-sm px-4 py-8">
        <div className="p-6 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-900 drop-shadow-md">
            Select a Menu Type
          </h2>

          {/* Display each grouped menu type */}
          {groupedMenu().map((menu) => {
            const isOpen = expandedMenuTypeId === menu.menu_type_id;

            return (
              <div key={menu.menu_type_id} className="border rounded mb-4 shadow bg-blue-100/60 backdrop-blur-sm">
                {/* Expand/collapse menu type */}
                <button
                  onClick={() =>
                    setExpandedMenuTypeId(isOpen ? null : menu.menu_type_id)
                  }
                  className="w-full flex justify-between items-center px-4 py-3 bg-blue-200 hover:bg-blue-300 text-lg font-semibold transition-colors"
                >
                  <span>
                    {menu.menu_type_name} — Rs.{menu.price}
                  </span>
                  {isOpen ? <ChevronUp /> : <ChevronDown />}
                </button>

                {/* Show category selection when expanded */}
                {isOpen && (
                  <div className="px-6 py-4 bg-blue-50/80 rounded-b space-y-6 transition-all">
                    {Object.values(menu.categories).map((category) => {
                      const isSingleChoice = category.item_limit === 1;
                      const selectedItems = selections[menu.menu_type_id]?.[category.category_id] || [];

                      return (
                        <div
                          key={category.category_id}
                          className="bg-blue-100 p-4 rounded shadow-sm"
                        >
                          <h3 className="text-lg font-semibold mb-2 text-blue-800">
                            {category.category_name} (Choose {category.item_limit})
                          </h3>

                          {/* List items for selection */}
                          <ul className="space-y-2">
                            {category.items.map((item) => (
                              <li
                                key={item.item_id}
                                className="flex items-center gap-3 p-2 bg-white rounded hover:bg-blue-100 transition"
                              >
                                <input
                                  type={isSingleChoice ? "radio" : "checkbox"}
                                  name={`${menu.menu_type_id}_${category.category_id}`}
                                  checked={selectedItems.includes(item.ICMT_Id)}
                                  onChange={() =>
                                    handleSelect(
                                      menu.menu_type_id,
                                      category.category_id,
                                      item.ICMT_Id,
                                      isSingleChoice
                                    )
                                  }
                                  className="accent-blue-600 w-5 h-5"
                                />
                                <label className="cursor-pointer text-blue-900 font-medium">
                                  {item.item_name}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Add Save button below the menu selection */}
        <div className="flex justify-center mt-8">
          <button
            className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-8 rounded shadow transition"
            onClick={async () => {
              // TODO: Replace with actual customer_id if available
              const customer_id = sessionStorage.getItem("id");
              // Flatten all ICMT_Ids from selections
              const ICMT_Ids = [];
              Object.values(selections).forEach((categories) => {
                Object.values(categories).forEach((ids) => {
                  ICMT_Ids.push(...ids);
                });
              });

              try {
                // Save each selection
                for (const ICMT_Id of ICMT_Ids) {
                  await saveCustomerMenuSelection(customer_id, ICMT_Id);
                }
                alert("Selections saved to backend!");
              } catch (err) {
                alert("Failed to save selections.");
                console.error(err);
              }
            }}
            type="button"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerMenuTypeSelection;
