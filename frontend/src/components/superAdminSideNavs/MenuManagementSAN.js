import React, { useEffect } from 'react'
import { Logout } from '../../components/Logout'
import GetMenus from '../../pages/superAdmin/GetMenus';
import CreateMenuListType from '../../pages/superAdmin/CreateMenuListType';
import CreateMenuType from '../../pages/superAdmin/CreateMenuTypes';

const MenuManagementSAN = ({ setRenderContent }) => {
  useEffect(() => {
    handleRenderContent('null')
  }, [])
  
  const handleRenderContent = (display) => {
    console.log(display)
    switch (display) {
      case 'getMenus':
        setRenderContent(() => () => <GetMenus />);
        break;
      case 'createMenuListTypes':
        setRenderContent(() => () => <CreateMenuListType />);
        break;
      case 'createMenuTypes':
        setRenderContent(() => () => <CreateMenuType />);
        break;
      default:
        setRenderContent(() => () => <p>Page not found</p>);
    }
  };
  return (
    <div className=''>
      <ul class="flex flex-col py-4 ">
        <li>
          <button onClick={() => handleRenderContent('getMenus')} class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-800">
            <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-white"><i class="bx bx-home"></i></span>
            <span class="text-sm font-medium">Get Menus</span>
          </button>
        </li>
        <li>
          <button onClick={() => handleRenderContent('createMenuListTypes')} class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-800">
            <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-white"><i class="bx bx-home"></i></span>
            <span class="text-sm font-medium">Create Menu List Types</span>
          </button>
        </li>
        <li>
          <button onClick={() => handleRenderContent('createMenuTypes')} class="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-800">
            <span class="inline-flex items-center justify-center h-12 w-12 text-lg text-white"><i class="bx bx-home"></i></span>
            <span class="text-sm font-medium">Get Menu Types</span>
          </button>
        </li>
        <li>
          <a href="#" class=" text-white hover:text-gray-800">
            <span class="inline-flex items-center justify-center h-12 w-12 texttext-white"><i class="bx bx-log-out"></i></span>
            <span class="text-sm font-medium"> <Logout /> </span>
          </a>
        </li>
      </ul>
    </div>
  )
}

export default MenuManagementSAN