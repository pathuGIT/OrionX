import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { updateUserPassword } from '../services/AuthService';

const UpdatePassword = () => {
    const [user, setUser] = useState({ password: ''});
    const [confirmPswd, setConfirmPswd] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { email, sourceTable } = location.state || {};

    const handleConfirmChange = (e) => {
        setConfirmPswd(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.password !== confirmPswd) {
            alert('Passwords do not match');
            return;
        }
        try {
            const { message } = await updateUserPassword({password:user.password, email:email, table:sourceTable});
            console.log(message);
            navigate('/forgot-password/success');
        } catch (error) {
            console.error('Login error:', error); // Log the error
            const errorMessage = 'customer registration failed';
            alert(errorMessage);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    return (
        // <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 ">
        //     <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        //         {/* <img class="mx-auto h-10 w-auto" src="15.svg" alt="Your Company" /> */}
        //             <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Update Password</h2>
        //     </div>

        //     <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        //         <form class="space-y-6" action="#" method="POST" onSubmit={handleSubmit} >

        //             <div>
        //                 <div class="flex items-center justify-between">
        //                     <label for="password" class="block text-sm/6 font-medium text-white">Password</label>
        //                 </div>
        //                 <div class="mt-2">
        //                     <input type="password" name="password" id="password" placeholder="Password" value={user.password} onChange={handleChange} required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        //                 </div>
        //             </div>

        //             <div>
        //                 <div class="flex items-center justify-between">
        //                     <label for="confirm-password" class="block text-sm/6 font-medium text-white">Confirm Password</label>
        //                 </div>
        //                 <div class="mt-2">
        //                     <input type="password" name="confirmPswd" id="confirm-password" placeholder="Confirm Password" value={confirmPswd} onChange={handleConfirmChange} required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        //                 </div>
        //             </div>

        //             <div>
        //                 <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create New Password</button>
        //             </div>
        //         </form>
        //     </div>
        // </div>
        <div  className=" my-20">

        {/* <section class="bg-gray-50 dark:bg-gray-900"> */}
          <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0">
            
            <div class="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
              <h2 class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Change Password
              </h2>
              <form class="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#" method="POST" onSubmit={handleSubmit} >
                <div className=" mb-5"> </div>
                <div>
                  <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                  <input type="confirm-password"  placeholder="••••••••" name="password" id="password" value={user.password} onChange={handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                </div>
                
                <div>
                  <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                  <input type="confirm-password"  placeholder="••••••••" name="confirmPswd" id="confirm-password" value={confirmPswd} onChange={handleConfirmChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                </div>

                <button type="submit" class="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Update password</button>
              </form>
            </div>
          </div>
        {/* </section> */}
      </div>
    )
}

export default UpdatePassword