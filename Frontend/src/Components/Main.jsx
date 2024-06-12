import { useEffect, useRef, useState } from 'react';
import CustomScrollY from '../Components/CustomScrollY';
import Player from '../Components/Player';
import { Link, NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { backendUrl, firebaseImgUrl } from '../constants';
import axios from 'axios';
import { setUser, setToken, setPlaylists } from '../store/reducers/authSlice';
import { setPlaylistId, setPlayerSongs, setIsPlaying, setSongId } from '../store/reducers/playerSlice';
import { useLocation } from 'react-router-dom';
import { setIsNotificationVisible, setNotification } from '../store/reducers/notificationSlice';
import Cookies from 'js-cookie';

export default function Main() {

    var libraryTab = useRef(null);
    var playlistTabRef = useRef(null);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const userPlaylists = useSelector((state) => state.user.playlists);
    const accessToken = useSelector((state) => state.user.token);
    const isNotificationVisible = useSelector((state) => state.notification.isNotificationVisible);
    const notification = useSelector((state) => state.notification.notification);
    const dispatch = useDispatch();
    const location = useLocation();
    const [isArtistRoute, setIsArtistRoute] = useState(false);
    const [buttonHovered, setButtonHovered] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();


    const logout = async () => {
        axios.post(
            `${backendUrl}/users/logout`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            }
        ).then(async () => {
            dispatch(setIsPlaying(false));
            dispatch(setPlayerSongs([]));
            dispatch(setPlaylistId(null));
            dispatch(setSongId(null));
            dispatch(setUser(null));
            dispatch(setToken(null));
            Cookies.remove('accessToken')
            navigate('/');
        })
    };

    const createUserPlaylist = () => {
        axios.post(
            `${backendUrl}/playlists/createUserPlaylist`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        ).then((res) => {
            axios.put(`${backendUrl}/users/addPlaylist/${user._id}`,
                {
                    playlistId: res.data._id
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                .then((res) => {
                    dispatch(setPlaylists(res.data.playlists));
                });
        });
    }


    function closeNotification() {
        dispatch(setIsNotificationVisible(false));
        dispatch(setNotification(null));
    }

    function handleSearchChange(e) {
        const value = e.target.value;
        // Check if the input is empty
        if (value.trim() === '') {
            // Create a new URLSearchParams object without the 'search' parameter
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('q'); // Remove 'search' parameter
            setSearchParams(newParams); // Update the URL
        } else {
            // Set the 'search' parameter to the value from the input field
            setSearchParams({ q: value });
        }
    }

    useEffect(() => {
        setIsArtistRoute(location.pathname.includes('artists'));
    }, [location])

    return (
        <div className="p-2 pt-0.5 bg-black h-screen flex flex-col space-y-2 relative">
            <div className={`absolute bg-slate-200 rounded-md justify-between items-center gap-4 p-2 px-3 z-50 left-1/2 top-5 transform -translate-x-1/2 ${isNotificationVisible ? 'flex' : 'hidden'}`}>
                <h1 className='font-semibold'>{notification}</h1>
                <button
                    onClick={closeNotification}
                >
                    <i class="fa-regular fa-circle-xmark"></i>
                </button>
            </div>
            <div className='flex flex-1 space-x-2 overflow-hidden'>
                <div className='w-[20%] flex flex-col'>
                    <ul className="login-search div-color text-gray-400">
                        <li>
                            <NavLink to="/">
                                <i className="fa-solid fa-house"></i>
                                <span>Home</span>
                            </NavLink></li>
                        <li>
                            <NavLink to="search">
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <span>Search</span>
                            </NavLink>
                        </li>
                    </ul>
                    <div className='div-color mt-2 flex-1 flex flex-col' id='userTab'>
                        <nav className='p-2 flex justify-between items-center'>
                            <a href="" className='hover:text-white text-lg text-gray-400'>
                                <i className="fa-solid fa-bars-staggered mr-3 p-2"></i>
                                <span >Your Library</span>
                            </a>
                            <div className="relative">
                                <span className="absolute bg-zinc-800 text-white text-sm font-semibold z-50 rounded-sm p-1 px-3 -mt-8 -ml-4 w-max opacity-0 transition-opacity duration-300" style={{ opacity: buttonHovered ? 1 : 0 }}>
                                    Create a new playlist!
                                </span>
                                <button
                                    className="hover:bg-zinc-800 p-2 rounded-full text-lg flex items-center justify-center"
                                    onMouseEnter={() => setButtonHovered(true)}
                                    onMouseLeave={() => setButtonHovered(false)}
                                    onClick={createUserPlaylist}
                                >
                                    <i className="fa-solid fa-plus text-gray-400 hover:text-white"></i>
                                </button>
                            </div>




                        </nav>
                        <div className='relative group flex-1'>
                            <div className='text-white px-2 library-tab-inner overflow-y-auto max-h-[calc(100vh-430px)] space-y-1' ref={libraryTab}>
                                {
                                    user ?
                                        <>
                                            {
                                                userPlaylists && userPlaylists.length > 0 ?
                                                    <>
                                                        {
                                                            userPlaylists.map((userPlaylist) => {
                                                                return (
                                                                    <Link to={`/playlists/${userPlaylist._id}`} className='flex space-x-2 p-2 rounded-md hover:bg-zinc-700'>
                                                                        {userPlaylist.image ?
                                                                            <img src={firebaseImgUrl(userPlaylist.image)} alt="" className='w-12 h-12 image rounded-md' />
                                                                            :
                                                                            userPlaylist.songs.length > 0 ?
                                                                                <img src={firebaseImgUrl(userPlaylist.songs[0].image)} alt="" className='w-12 h-12 image rounded-md' />
                                                                                :
                                                                                <div className='w-12 h-12 bg-zinc-800 flex justify-center rounded-md items-center'>
                                                                                    <i class="fa-solid fa-music text-zinc-500"></i>
                                                                                </div>
                                                                        }
                                                                        <div className='font-semibold'>
                                                                            <Link to={`/playlists/${userPlaylist._id}`} className='hover:underline'>{userPlaylist.title}</Link>
                                                                            <div className='flex items-center space-x-2 text-sm text-zinc-400'>
                                                                                <h1>Playlist</h1>
                                                                                <div className='w-1 h-1 bg-zinc-400 rounded-xl'></div>
                                                                                <h1>{`${userPlaylist.isUserPlaylist ? user.name : 'Dotify'}`}</h1>
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                )
                                                            })
                                                        }
                                                    </>

                                                    :
                                                    <h1 className='text-white text-md ml-4'>No Playlists!!</h1>

                                            }
                                        </>
                                        :
                                        <>
                                            <div className='bg-zinc-800 p-4 rounded-lg mb-5'>
                                                <h1 className='font-bold mb-2'>Create your first platlist</h1>
                                                <p className='text-sm'>It's easy, we'll help you</p>
                                                <button className='bg-white text-black font-semibold p-1 px-3 mt-6 rounded-full hover:scale-105'>Create playlist</button>
                                            </div>
                                            <div className='bg-zinc-800 p-4 rounded-lg mb-5'>
                                                <h1 className='font-bold mb-2'>Let's find some podcasts to follow</h1>
                                                <p className='text-sm'>We'll keep you updated on new episodes</p>
                                                <button className='bg-white text-black font-semibold p-1 px-3 mt-6 rounded-full hover:scale-105'>Browse podcasts</button>
                                            </div>
                                        </>

                                }

                            </div>
                            <CustomScrollY componentRef={libraryTab} customClasses="opacity-0 group-hover:opacity-100 group-hover:duration-300" />
                        </div>
                        <div className='px-5' id='link-tab'>
                            <div className='user-links text-zinc-400 text-xs mb-5 flex flex-wrap'>
                                <a href="">Legal</a>
                                <a href="">Privacy Center</a>
                                <a href="">Privacy policy</a>
                                <a href="">Cookies</a>
                                <a href="">About Ads</a>
                                <a href="">Accessibility</a>
                                <a href="">Cookies</a>
                            </div>
                            <div className='mb-5'>
                                <button className='text-white font-bold border border-zinc-500 rounded-full py-1 px-3 hover:border-white hover:scale-105'> <i className="fa-solid fa-globe"></i> English</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="right-panel" className="w-[80%] div-color ml-2 h-full flex flex-col relative">
                    <nav className={`main-nav flex w-full p-2 rounded-t-lg items-center justify-between ${isArtistRoute ? '' : 'bg-neutral-900 bg-opacity-80'} z-10 absolute`}>
                        <div className='flex items-center gap-4'>
                            <div className='p-2'>
                                <button className='btn-back text-zinc-400 bg-zinc-950 h-8 w-8 rounded-full mr-2 hover:text-white' onClick={() => navigate(-1)}><i className="fa-solid fa-chevron-left"></i></button>
                                <button className='btn-back text-zinc-400 bg-zinc-950 h-8 w-8 rounded-full hover:text-white' onClick={() => navigate(1)}><i className="fa-solid fa-chevron-right"></i></button>
                            </div>
                            {location.pathname.includes('search') &&

                                <div className='relative group'>
                                    <i className="fa-solid fa-magnifying-glass text-neutral-500 absolute inset-y-0 flex items-center pl-3 group-hover:text-neutral-300"></i>
                                    <input
                                        type="text"
                                        name="search"
                                        id="search"
                                        placeholder='Search here.'
                                        className='rounded-full bg-neutral-800 py-2.5 px-10 text-neutral-300'
                                        onChange={handleSearchChange}
                                        value={searchParams.get('q') || ''}
                                    />
                                </div>
                            }
                        </div>
                        <div className='font-bold'>
                            {
                                user ?
                                    <button onClick={() => logout()} className='text-black bg-white px-8 rounded-full p-3 hover:scale-105'>Log out</button>
                                    :
                                    <>
                                        <Link to={'/register'} className='text-zinc-400 hover:text-white mr-6'>Sign up</Link>
                                        <Link to={'/login'} className='text-black bg-white px-8 rounded-full p-3 hover:scale-105'>Log in</Link>
                                    </>
                            }
                        </div>
                    </nav>
                    <div className='overflow-hidden relative group/paylistTab rounded-lg'>
                        <div className='overflow-auto playlists-Tab h-full' ref={playlistTabRef}>
                            <Outlet />
                            <div className='mt-8 py-5 px-9 text-white' id='footer'>
                                <div className='flex justify-between mb-8'>
                                    <div className='flex'>
                                        <div className='mr-24'>
                                            <h1 className='font-semibold'>Company</h1>
                                            <ul className='text-zinc-400 links'>
                                                <li><a href='#'>About</a></li>
                                                <li><a href='#'>Jobs</a></li>
                                                <li><a href='#'>For the Record</a></li>
                                            </ul>
                                        </div>
                                        <div className='mr-24'>
                                            <h1 className='font-semibold'>Communities</h1>
                                            <ul className='text-zinc-400 links'>
                                                <li><a href="#">For Artists</a></li>
                                                <li><a href="#">Developers</a></li>
                                                <li><a href="#">Advertising</a></li>
                                                <li><a href="#">Investors</a></li>
                                                <li><a href="#">vendors</a></li>
                                            </ul>
                                        </div>
                                        <div className='mr-24'>
                                            <h1 className='font-semibold'>Useful Links</h1>
                                            <ul className='text-zinc-400 links'>
                                                <li><a href="#">Support</a></li>
                                                <li><a href="#">Free Mobile App</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className='flex text-xl'>
                                        <a href="https://www.instagram.com/aadi_v.a/" target='_blank' className='bg-zinc-800 h-10 w-10 rounded-full hover:bg-zinc-700 flex items-center justify-center mr-3'><i className="fa-brands fa-instagram"></i></a>
                                        <a href="https://m.facebook.com/vodnala.adarsh/" target='_blank' className='bg-zinc-800 h-10 w-10 rounded-full hover:bg-zinc-700 flex items-center justify-center mr-3'><i className="fa-brands fa-facebook"></i></a>
                                        <a href="https://www.youtube.com/@adarshvodnala4265" target='_blank' className='bg-zinc-800 h-10 w-10 rounded-full hover:bg-zinc-700 flex items-center justify-center'><i className="fa-brands fa-youtube"></i></a>
                                    </div>
                                </div>
                                <hr className="h-px border-0 bg-zinc-700"></hr>
                                <h1 className='text-zinc-400 my-10'>&copy; 2023 Dotify, Developed by <span className="bg-gradient-to-r from-[#be22ff] via-[#ff279c] to-[#ff981f] text-transparent bg-clip-text text-lg font-semibold">Adarsh Vodnala</span>.</h1>
                            </div>
                        </div>
                        <CustomScrollY componentRef={playlistTabRef} customClasses="opacity-0 group-hover/paylistTab:opacity-100 group-hover:duration-300" />
                    </div>
                </div>
            </div>
            <Player user={user} />

            <div className={`bg-gradient-to-r from-fuchsia-700 to-blue-400 mt-2 p-2 px-5 text-white flex justify-between ${user ? 'hidden' : ''}`}>
                <div>
                    <h1 className='text-sm'>PREVIEW OF DOTIFY</h1>
                    <p className='font-semibold'>Sign up to get unlimited songs and podcasts with occasional ads. No credit card needed.</p>
                </div>
                <Link to={'/register'} className='text-black font-semibold bg-white px-8 rounded-full p-3 hover:scale-105'>Sign Up free</Link>
            </div>
        </div>
    )
}
