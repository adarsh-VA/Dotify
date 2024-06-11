import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { backendUrl } from '../constants';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../store/reducers/authSlice';

export default function Login() {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState(null);


    const login = async (e) =>{
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/users/login`, { email, password }, { withCredentials: true });
            const data = response.data;
            dispatch(setUser(data.currentUser));
            dispatch(setToken(data.token));
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Wrong email or password. Please try again.');
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className='flex flex-col h-screen'>
            <div className='bg-neutral-950 py-7' id='navbar'>
                <Link to={'/'} className='text-3xl ml-20 font-semibold text-white'>Dotify</Link>
            </div>
            <div className='flex-1 flex justify-center items-center py-5 bg-gradient-to-b from-neutral-800 from-0% bg-black' id='mid-div'>
                <div className='w-[700px] p-16 bg-gradient-to-t from-neutral-900 from-0% bg-neutral-950 rounded-md'>
                    <h1 className='text-white text-5xl font-semibold text-center mb-6'>Log in to Dotify</h1>
                    <div className='bg-neutral-700 h-[1px]'></div>
                    <form action="">
                        <div className='px-32 mt-6 text-white '>
                            <div className='space-y-4'>
                                <div className='flex flex-col space-y-1'>
                                    <label htmlFor="email">Email</label>
                                    <input type="text" onChange={(e)=>setEmail(e.target.value)} placeholder='Email' id="email" name='email'  className='bg-transparent text-white ring-1 ring-neutral-500 rounded-sm p-2 hover:ring-white transition' />
                                </div>
                                <div className='flex flex-col space-y-1'>
                                    <label htmlFor="password" >Password</label>
                                    <input type="password" onChange={(e)=>setPassword(e.target.value)} id="password" placeholder='Password' name='password' className='bg-transparent text-white ring-1 ring-neutral-500 rounded-sm p-2 hover:ring-white transition' />
                                </div>
                                {error &&
                                    <div className="bg-red-100 border border-red-400 flex text-red-700 px-4 py-2 items-center rounded" role="alert">
                                        <strong className="font-bold">Error: </strong>
                                        <span className="block sm:inline"> {error}</span>
                                        <span className="mt-1">
                                            <svg className="fill-current h-6 w-6 text-red-500" onClick={() => setError(null)} role="button" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                                        </span>
                                    </div>
                                }
                            </div>
                            <button type='submit' onClick={(e)=>login(e)} className='bg-green-500 py-3 px-10 w-full mt-10 text-black font-semibold rounded-3xl hover:scale-110 hover:font-bold'>Log In</button>
                        </div>
                    </form>

                    <div className='bg-neutral-700 h-[1px] my-6'></div>

                    <div className='px-32'>
                        <h1 className='text-neutral-400'>Don't have an account? <Link to={'/register'} className='text-white underline cursor-pointer hover:text-green-500'>Sign up for Dotify</Link></h1>
                    </div>
                </div>
            </div>
            <footer className='py-6 text-center bg-neutral-900' id='footer'>
            <h1 className='text-zinc-400'>Developed by <span className="bg-gradient-to-r from-[#be22ff] via-[#ff279c] to-[#ff981f] text-transparent bg-clip-text text-lg font-semibold">Adarsh Vodnala</span>.</h1>
            </footer>
        </div>
    )
}
