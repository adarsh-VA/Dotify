import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setPlaylistId, setArtistId, setPlayerSongs, setIsPlaying, setSongId } from '../store/reducers/playerSlice';
import axios from 'axios';
import { backendUrl, firebaseImgUrl } from '../constants';
import { setIsNotificationVisible, setLoading, setNotification } from '../store/reducers/notificationSlice';
import { setPlaylists } from '../store/reducers/authSlice';
import Loading from './Loading';

export default function SongView() {

    const { songId } = useParams();
    const [song, setSong] = useState(null);
    const playerDetails = useSelector((state) => state.player.playerDetails);
    const dispatch = useDispatch();
    const imageRef = useRef();
    const [rgb, setRgb] = useState('');
    const accessToken = useSelector((state) => state.user.token);
    const user = useSelector((state) => state.user.user);
    const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
    const addPlaylistRef = useRef(null);
    const userPlaylists = useSelector((state) => state.user.playlists);
    const navigate = useNavigate();
    const isLoading = useSelector((state) => state.notification.loading);

    function getAverageRGB(imgEl) {
        var blockSize = 100, // only visit every 5 pixels
            defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = { r: 0, g: 0, b: 0 },
            count = 0;

        if (!context) {
            return defaultRGB;
        }

        height = canvas.height = imgEl.height;
        width = canvas.width = imgEl.width;

        context.drawImage(imgEl, 0, 0);

        try {
            data = context.getImageData(0, 0, width, height);
        } catch (e) {
            console.log('error ', e);
            /* security error, img on diff domain */
            return defaultRGB;
        }

        length = data.data.length;
        while ((i += blockSize * 4) < length) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
        }

        // ~~ used to floor values
        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);
        setRgb('rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');

    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (addPlaylistRef.current && !addPlaylistRef.current.contains(event.target)) {
                setIsAddPlaylistOpen(false);
            }
        }

        document.addEventListener('click', handleClickOutside);

        if (user) {
            dispatch(setLoading(true));
            axios.get(`${backendUrl}/songs/${songId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
                .then((res) => {
                    setSong(res.data);
                    dispatch(setLoading(false));
                })
        }
        else {
            navigate('/login');
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (song) {
            const handleImageLoad = () => {
                getAverageRGB(imageRef.current);
            };

            // Add event listener to the image
            imageRef.current.addEventListener('load', handleImageLoad);
        }
    }, [song]);

    async function Play() {
        if (user && song) {
            if (playerDetails.currentSongId != song._id) {
                dispatch(setPlayerSongs([song]));
                dispatch(setPlaylistId(null));
                dispatch(setArtistId(null));
                dispatch(setSongId(song._id));
            }
            else if (playerDetails.currentSongId == song._id && playerDetails.playlistId == null && playerDetails.artistId == null) {
                dispatch(setIsPlaying(true));
            }
        }
        else {
            navigate('/login');
        }
    }

    function Pause() {
        dispatch(setIsPlaying(false));
    }

    function handlePlusButtonClick(event) {
        event.stopPropagation();
        setIsAddPlaylistOpen(!isAddPlaylistOpen);
    }

    function addSongToPlaylist(userPlaylistId) {

        if (userPlaylists.filter(playlist => playlist._id == userPlaylistId)[0].songs.find(item => item._id == songId)) {
            dispatch(setNotification('Song already added!'));
            dispatch(setIsNotificationVisible(true));
        } else {

            axios.put(`${backendUrl}/playlists/${userPlaylistId}/addSongToPlaylist/${songId}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                .then(() => {
                    axios.get(`${backendUrl}/users/getUserPlaylists`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    })
                        .then((res) => {
                            dispatch(setPlaylists(res.data.playlists.playlists));
                        })

                    dispatch(setNotification('Song Added to your Library'));
                    dispatch(setIsNotificationVisible(true));
                });
        }

    }

    const gradientStyle = {
        backgroundImage: `linear-gradient(to bottom, ${rgb}, 225px, transparent 550px)`,
    };

    if (isLoading) {
        return (<Loading />);
    }

    return (
        <div className='relative' style={gradientStyle}>
            {
                song &&
                <>

                    <div className='px-7 pt-20 p-4'>
                        <div className='flex '>
                            <img src={firebaseImgUrl(song.image)} alt="" className='w-60 h-60 image shadow-[0px_4px_18px_-5px_rgb(0,0,0)]' ref={imageRef} crossOrigin='Anonymous' />
                            <div className='ml-5 flex flex-col justify-end'>
                                <div className='mt-4'>
                                    <h1 className='text-white'>Song</h1>
                                    <h1 className='text-8xl text-white font-bold'>{song.name}</h1>
                                </div>
                                <div className='flex items-center text-white space-x-2 mt-4 text-xs font-semibold'>
                                    <h1 className=''>{new Date(song.dateAdded).toISOString().split('T')[0]}</h1> <div className='w-1 h-1 bg-white rounded-xl'></div> <h1>{parseFloat(song.duration / 60).toFixed(2)}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='px-7 p-4 bg-[#121212] bg-opacity-30'>
                        <div className='flex items-center gap-5'>
                            {playerDetails.isPlaying && playerDetails.currentSongId == songId && playerDetails.playlistId == null && playerDetails.artistId == null ? <button className=' text-black bg-green-500 h-14 w-14 rounded-full hover:scale-105' onClick={Pause}><i className="fa-solid fa-pause text-xl"></i></button> : <button className=' text-black bg-green-500 h-14 w-14 rounded-full hover:scale-105' onClick={() => Play()}><i className="fa-solid fa-play text-xl"></i></button>}

                            <div className='relative group'>
                                <button onClick={handlePlusButtonClick}>
                                    <i className="fa-regular fa-plus text-zinc-500 text-2xl hover:text-white cursor-pointer"></i>
                                </button>
                                <div ref={addPlaylistRef} className={`absolute w-max bg-zinc-600 p-1 rounded-sm ml-4 -mt-2 ${isAddPlaylistOpen ? 'block' : 'hidden'}`}>
                                    {
                                        userPlaylists && userPlaylists.filter(item => item.isUserPlaylist == true).length > 0 ?
                                            <ul className='text-white'>
                                                {userPlaylists.filter(item => item.isUserPlaylist == true).map(item => {
                                                    return (<li className='hover:bg-zinc-700 px-2 py-1 cursor-pointer' key={item._id} onClick={() => addSongToPlaylist(item._id)}><h1>{item.title}</h1></li>)
                                                })}
                                            </ul>

                                            :
                                            <h1 className='text-white px-2'>No playlists to add!</h1>

                                    }
                                </div>
                            </div>

                            <i className="fa-solid fa-ellipsis text-zinc-500 text-2xl hover:text-white cursor-pointer"></i>
                        </div>
                        <h1 className='text-white text-xl font-semibold mt-5'>Artists</h1>
                        <div className='flex mt-4 space-x-7'>
                            {
                                song.artists.map((artist, idx) => (
                                    <Link to={`/artists/${artist._id}`} className='flex items-center space-x-3 p-3 pr-5 bg-zinc-600 bg-opacity-30 rounded-full hover:bg-opacity-50 hover:cursor-pointer hover:scale-[1.02] transition'>
                                        <img className='w-16 h-16 object-cover rounded-full' src={firebaseImgUrl(artist.image)} alt="" />
                                        <div className='text-white'>
                                            <p className='text-sm'>Artist</p>
                                            <Link to={`/artists/${artist._id}`} className='font-semibold hover:underline'>{artist.name}</Link>
                                        </div>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    )
}
