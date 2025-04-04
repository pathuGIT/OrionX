import React, { useEffect ,useState} from 'react'
import { Logout } from '../../components/Logout'
import GetMenus from '../../pages/superAdmin/GetMenus';
import CreateMenuListType from '../../pages/superAdmin/CreateMenuListType';
import CreateMenuType from '../../pages/superAdmin/CreateMenuType';
import CreateCategory from '../../pages/superAdmin/CreateCategories';
import CreateItem from '../../pages/superAdmin/CreateItem';
import CreateCategoryMenuType from '../../pages/superAdmin/CreateCategoryMenuType';

const MenuManagementSAN = ({ setRenderContent }) => {
  const [selected , setSelected] = useState('');

  useEffect(() => {
    handleRenderContent('null')
  }, [])

  const handleRenderContent = (display) => {
    setSelected(display);
    console.log(display)
    switch (display) {
      case 'createMenuListTypes':
        setRenderContent(() => () => <CreateMenuListType />);
        break;
      case 'createMenuTypes':
        setRenderContent(() => () => <CreateMenuType />);
        break;
      case 'createCategory':
        setRenderContent(() => () => <CreateCategory />);
        break;
      case 'CreateItem':
        setRenderContent(() => () => <CreateItem />);
        break;
      case 'CreateCategoryMenuType':
        setRenderContent(() => () => <CreateCategoryMenuType />);
        break;
      default:
        setRenderContent(() => () => <p>Page not found</p>);
    }
  };
  return (
    <div className=''>
      <ul className="flex flex-col py-4">
        <li>
          <button onClick={() => handleRenderContent('createMenuListTypes')} className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-800">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white"><i className="bx bx-home"></i></span>
            <span className={`text-sm font-medium ${selected === 'createMenuListTypes' ? 'text-yellow-300' : ''}`}>Create Menu List Types</span>
          </button>
        </li>
        <li>
          <button onClick={() => handleRenderContent('createMenuTypes')} className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-800">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white"><i className="bx bx-home"></i></span>
            <span className={`text-sm font-medium ${selected === 'createMenuTypes' ? 'text-yellow-300' : ''}`}>Create Menu Types</span>
          </button>
        </li>
        <li>
          <button onClick={() => handleRenderContent('createCategory')} className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-800">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white"><i className="bx bx-home"></i></span>
            <span className={`text-sm font-medium ${selected === 'createCategory' ? 'text-yellow-300' : ''}`}>Create Categories</span>
          </button>
        </li>
        <li>
          <button onClick={() => handleRenderContent('CreateItem')} className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-800">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white"><i className="bx bx-home"></i></span>
            <span className={`text-sm font-medium ${selected === 'CreateItem' ? 'text-yellow-300' : ''}`}>Create Items</span>
          </button>
        </li>
        <li>
          <button onClick={() => handleRenderContent('CreateCategoryMenuType')} className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-800">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white"><i className="bx bx-home"></i></span>
            <span className={`text-sm font-medium ${selected === 'CreateCategoryMenuType' ? 'text-yellow-300' : ''}`}>Create Category Menu Type</span>
          </button>
        </li>
        {/* <li>
          <button onClick={() => handleRenderContent('ItemCategoryMenuType')} className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-800">
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white"><i className="bx bx-home"></i></span>
            <span className={`text-sm font-medium ${selected === 'ItemCategoryMenuType' ? 'text-yellow-300' : ''}`}>Create Item Category Menu Type</span>
          </button>
        </li> */}
        <li>
          <a href="#" className="text-white hover:text-gray-800">
            <span className="inline-flex items-center justify-center h-12 w-12 text-white"><i className="bx bx-log-out"></i></span>
            <span className="text-sm font-medium"><Logout /></span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default MenuManagementSAN