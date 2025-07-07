import React, { useEffect, useState } from 'react';
import { getMenuOverview } from '../../services/MenuService';
import { ChevronDownIcon, ChevronUpIcon } from  '@heroicons/react/20/solid';

const MenuOverview = () => {
  const [menuData, setMenuData] = useState([]);
  const [expandedList, setExpandedList] = useState(null);
  const [expandedType, setExpandedType] = useState(null);

  useEffect(() => {
    getMenuOverview().then(setMenuData).catch(console.error);
  }, []);

  const toggleList = id => setExpandedList(expandedList === id ? null : id);
  const toggleType = id => setExpandedType(expandedType === id ? null : id);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {menuData.map(list => (
        <div key={list.id} className="mb-4 border rounded-lg shadow-sm">
          <button
            className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-t-lg"
            onClick={() => toggleList(list.id)}
          >
            <span className="text-lg font-semibold">{list.name}</span>
            {expandedList === list.id ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
          {expandedList === list.id && (
            <div className="px-6 py-4 bg-white">
              {list.types.map(type => (
                <div key={type.id} className="mb-3">
                  <button
                    className="w-full flex justify-between items-center py-2 hover:bg-gray-50"
                    onClick={() => toggleType(type.id)}
                  >
                    <span className="text-md font-medium">{type.name}</span>
                    <span className="text-gray-600">LKR - {type.price}</span>
                  </button>
                  {expandedType === type.id && (
                    <div className="mt-2 pl-4">
                      {type.categories.map(cat => (
                        <div key={cat.id} className="mb-2">
                          <h4 className="font-medium">{cat.name} (Choose {cat.limit})</h4>
                          <ul className="list-disc list-inside ml-4">
                            {cat.items.map(item => (
                              <li key={item.id}>{item.name}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuOverview;