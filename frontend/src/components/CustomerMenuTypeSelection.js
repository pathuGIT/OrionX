// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getMenusByListType } from "../services/MenuService";
// import { ArrowLeft, ArrowRight } from "lucide-react";

// const CustomerMenuTypeSelection = () => {
//     const { listTypeId } = useParams();
//     const [menus, setMenus] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         getMenusByListType(listTypeId).then(setMenus);
//     }, [listTypeId]);

//     return (
//         <div className="p-6 max-w-5xl mx-auto">
//             <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-blue-600">
//                 <ArrowLeft className="mr-2" /> Back
//             </button>
//             <h2 className="text-2xl font-bold mb-6 text-center">Choose a Menu Type</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {menus.map(menu => (
//                     <div
//                         key={menu.menu_type_id}
//                         className="bg-white p-5 shadow-md rounded-xl hover:shadow-lg transition"
//                     >
//                         <h3 className="text-xl font-semibold">{menu.menu_type_name}</h3>
//                         <p className="text-gray-600 mt-2">Price: Rs. {menu.price}</p>
//                         <button
//                             onClick={() => navigate(`/menu-categories/${menu.menu_type_id}`)}
//                             className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex justify-center items-center gap-2"
//                         >
//                             Select <ArrowRight size={18} />
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default CustomerMenuTypeSelection;
