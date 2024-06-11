import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setPlaylistId, setArtistId, setPlayerSongs, setIsPlaying, setSongId, resetPlayer, removeSongFromPlayerPlaylist } from '../store/reducers/playerSlice';
import axios from 'axios';
import { backendUrl, firebaseImgUrl } from '../constants';
import { removeUserPlaylist, setPlaylists } from '../store/reducers/authSlice';

export default function PlaylistView() {

    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [addPlaylist, setAddPlaylist] = useState(false);
    const playerDetails = useSelector((state) => state.player.playerDetails);
    const dispatch = useDispatch();
    const imageRef = useRef();
    const [rgb, setRgb] = useState('');
    const accessToken = useSelector((state) => state.user.token);
    const user = useSelector((state) => state.user.user);
    const userPlaylists = useSelector((state) => state.user.playlists);
    const [buttonHovered, setButtonHovered] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [playlistName, setPlaylistName] = useState(null);
    const [playlistDescription, setPlaylistDescription] = useState(null);
    const [playlistImage, setPlaylistImage] = useState(null);
    const [isUploadPreview, setIsUploadPreview] = useState(false);
    const navigate = useNavigate();

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
        axios.get(`${backendUrl}/playlists/${playlistId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((res) => {
                setPlaylist(res.data);
            })
    }, [playlistId]);

    useEffect(() => {
        if (playlist && (playlist.image || playlist.songs.length > 0)) {
            const handleImageLoad = () => {
                getAverageRGB(imageRef.current);
            };

            // Add event listener to the image
            imageRef.current.addEventListener('load', handleImageLoad);
        }
        if (playlist) {
            setPlaylistName(playlist.title);
            setPlaylistDescription(playlist.description);
            setPlaylistImage(playlist.image);
        }
    }, [playlist])

    function songsDuration() {
        return parseInt((playlist.songs.reduce((total, song) => total + song.duration, 0) / 60)).toPrecision(3);
    }

    const addPlaylistToUser = () => {
        if (user) {
            axios.put(`${backendUrl}/users/addPlaylist/${user._id}`,
                {
                    playlistId
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                .then((res) => {
                    dispatch(setPlaylists(res.data.playlists));
                });
        }
        else {
            navigate('/login');
        }
    }

    const removePlaylistFromUser = () => {
        axios.put(`${backendUrl}/users/removePlaylist/${user._id}`,
            {
                playlistId
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(() => {
                dispatch(removeUserPlaylist(playlistId));
            });
    }


    async function Play(songId = null, isMainPlaybutton = false) {
        if (user) {

            if (playerDetails.playlistId == null && songId != null) {
                dispatch(setPlayerSongs(playlist.songs));
                dispatch(setPlaylistId(playlistId));
                dispatch(setArtistId(null));
                dispatch(setSongId(songId));
            }
            else if (playerDetails.playlistId == playlistId && songId != null && songId != playerDetails.currentSongId) {
                dispatch(setSongId(songId));
            }
            else if (playerDetails.playlistId == playlistId && playerDetails.isPlaying == false) {
                dispatch(setIsPlaying(true));
            }
            else {
                if (isMainPlaybutton) {
                    songId = playlist.songs[0]._id
                }
                dispatch(setPlayerSongs(playlist.songs));
                dispatch(setPlaylistId(playlistId));
                dispatch(setArtistId(null));
                dispatch(setSongId(songId));
            }
        }
        else {
            navigate('/login');
        }
    }

    function Pause() {
        dispatch(setIsPlaying(false));
    }

    const deleteUserPlaylist = () => {
        axios.delete(`${backendUrl}/users/${user._id}/deleteUserPlaylist/${playlistId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(() => {
                dispatch(removeUserPlaylist(playlistId));
                navigate('/');
            });
    }

    function removeSongFromPlaylist(removalSongId) {
        if (playerDetails.playlistId == playlistId && playerDetails.currentSongId == removalSongId) {
            dispatch(resetPlayer());
        } else if (playerDetails.playlistId == playlistId) {
            dispatch(removeSongFromPlayerPlaylist(removalSongId));
        }
        axios.put(`${backendUrl}/playlists/${playlistId}/removeSongFromPlaylist/${removalSongId}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then((res) => {
                setPlaylist(res.data);
                axios.get(`${backendUrl}/users/getUserPlaylists`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                    .then((res) => {
                        dispatch(setPlaylists(res.data.playlists.playlists));
                    })
            });
    }

    function showEditModal() {
        setIsEditModalOpen(true);
        setPlaylistName(playlist.title);
        setPlaylistDescription(playlist.description);
        setPlaylistImage(playlist.image);
        setIsUploadPreview(false);
    }

    function closeEditModal() {
        setIsEditModalOpen(false);
        if (isUploadPreview) {
            axios.delete(`${backendUrl}/playlists/deleteTempImage/${playlistImage}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                .then((res) => {
                });
        }
    }


    const handleImageUpload = (imageFile) => {
        if (imageFile) {
            axios.post(`${backendUrl}/playlists/uploadTempImage`,
                {
                    image: imageFile
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                .then((res) => {
                    setIsUploadPreview(true);
                    setPlaylistImage(res.data);
                })
        }
    };

    function editPlaylist() {
        if (playlistImage != playlist.image || playlistName != playlist.title || playlistDescription != playlist.description) {
            axios.put(`${backendUrl}/playlists/editPlaylist/${playlistId}`,
                {
                    image: playlistImage,
                    title: playlistName,
                    description: playlistDescription
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                .then((res) => {
                    setPlaylist(res.data);
                    axios.get(`${backendUrl}/users/getUserPlaylists`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    })
                        .then((res) => {
                            dispatch(setPlaylists(res.data.playlists.playlists));
                        })
                })
        }
        setIsUploadPreview(false);
        setIsEditModalOpen(false);
    }

    const gradientStyle = {
        backgroundImage: `linear-gradient(to bottom, ${rgb}, 225px, transparent 550px)`,
    };

    return (
        <div className='relative' style={playlist?.image || playlist?.songs?.length > 0 ? gradientStyle : { background: 'linear-gradient(to bottom, rgb(71,71,71) 225px, transparent 550px)' }}>
            {
                playlist &&
                <>

                    <div className='px-7 pt-20 p-4'>
                        <div className='flex '>
                            <div className='relative group'>
                                {playlist.isUserPlaylist &&

                                    <button className='w-60 h-60 absolute justify-center cursor-pointer items-center bg-zinc-900 bg-opacity-60 hidden group-hover:flex'
                                        onClick={showEditModal}
                                    >
                                        <div className='text-center space-y-2 text-white'>
                                            <i className='fa-solid fa-pencil text-6xl'></i>
                                            <h1>Choose photo</h1>
                                        </div>
                                    </button>
                                }
                                {playlist.image ?

                                    <img src={firebaseImgUrl(playlist.image)} alt="" className='w-60 h-60 image shadow-[0px_4px_18px_-5px_rgb(0,0,0)]' ref={imageRef} crossOrigin='Anonymous' />
                                    :
                                    playlist.songs.length > 0 ?
                                        <img src={firebaseImgUrl(playlist.songs[0].image)} alt="" className='w-60 h-60 image shadow-[0px_4px_18px_-5px_rgb(0,0,0)]' ref={imageRef} crossOrigin='Anonymous' />
                                        :
                                        <div className='w-60 h-60 bg-zinc-800 flex justify-center items-center shadow-[0px_4px_18px_-5px_rgb(0,0,0)]'>
                                            <i class="fa-solid fa-music text-zinc-500 text-7xl"></i>
                                        </div>
                                }
                            </div>
                            <div className='ml-5 flex flex-col justify-between'>
                                <div className='mt-4'>
                                    <h1 className='text-white'>Playlist</h1>
                                    {playlist.isUserPlaylist ?

                                        <h1 onClick={showEditModal} className='text-8xl text-white font-bold cursor-pointer'>{playlist.title}</h1>
                                        :
                                        <h1 className='text-8xl text-white font-bold'>{playlist.title}</h1>

                                    }
                                </div>
                                <div>
                                    {playlist.isUserPlaylist ?
                                        <h1 onClick={showEditModal} className='text-zinc-400 font-semibold mb-2 cursor-pointer'>{playlist.description}</h1>
                                        :
                                        <h1 className='text-zinc-400 font-semibold mb-2'>{playlist.description}</h1>
                                    }
                                    <h1 className='font-semibold'><span className='text-white'>Dotify {playlist.songs.length} songs </span><span className='text-zinc-400'>about {songsDuration()} mins</span></h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='px-7 p-4 bg-[#121212] bg-opacity-30'>
                        <div className='flex items-center gap-5'>
                            {playlist.songs.length > 0 && (playerDetails.isPlaying && playerDetails.playlistId == playlistId ? <button className=' text-black bg-green-500 h-14 w-14 rounded-full hover:scale-105' onClick={Pause}><i className="fa-solid fa-pause text-xl"></i></button> : <button className=' text-black bg-green-500 h-14 w-14 rounded-full hover:scale-105' onClick={() => Play(null, true)}><i className="fa-solid fa-play text-xl"></i></button>)}

                            <div className='ml-5'>
                                {
                                    userPlaylists && userPlaylists.some(playlist => playlist._id === playlistId) ?
                                        playlist.isUserPlaylist ?
                                            <div className="relative">
                                                <span className="absolute bg-zinc-800 text-white text-sm font-semibold z-50 rounded-sm p-1 px-3 -mt-8 -ml-4 w-max opacity-0 transition-opacity duration-300" style={{ opacity: buttonHovered ? 1 : 0 }}>
                                                    Delete your playlist!
                                                </span>
                                                <button
                                                    className="hover:bg-zinc-800 p-2 rounded-full text-lg flex items-center justify-center"
                                                    onMouseEnter={() => setButtonHovered(true)}
                                                    onMouseLeave={() => setButtonHovered(false)}
                                                    onClick={() => deleteUserPlaylist()}
                                                >
                                                    <i className="fa-solid fa-trash text-zinc-400 hover:text-white"></i>
                                                </button>
                                            </div>
                                            :
                                            <div className="group relative">
                                                <span className="absolute bg-gray-800 text-white text-xs rounded-md p-1 -mt-8 -ml-4 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    Remove from your library!
                                                </span>
                                                <button
                                                    className="group-hover:opacity-100 transition-opacity duration-300 bg-green-500 p-1.5 rounded-full flex items-center justify-center hover:scale-[1.05]"
                                                    onClick={() => removePlaylistFromUser()}
                                                >
                                                    <i className="fa-solid fa-check"></i>
                                                </button>
                                            </div>
                                        :
                                        <div className="group relative">
                                            <span className="absolute bg-gray-800 text-white text-xs rounded-md p-1 -mt-8 -ml-4 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                Add to your library!
                                            </span>
                                            <button className="group-hover:opacity-100 transition-opacity duration-300" >
                                                <i className="fa-regular fa-plus text-zinc-500 text-2xl hover:text-white cursor-pointer" onClick={() => addPlaylistToUser()}></i>
                                            </button>
                                        </div>
                                }
                            </div>

                            <i className="fa-solid fa-ellipsis text-zinc-500 text-2xl hover:text-white cursor-pointer"></i>
                        </div>
                        <div className=' mt-4'>
                            {playlist.songs && playlist.songs.length > 0 ?
                                <>
                                    <div className='flex px-4 text-zinc-300 items-center'>
                                        <h1 className='w-[2%]'>#</h1>
                                        <h1 className='w-[40%]'>Title</h1>
                                        <h1 className='w-[26%]'>Album</h1>
                                        <h1 className='w-[22%]'>Date Added</h1>
                                        <i className="fa-regular fa-clock w-[10%] text-center"></i>
                                    </div>
                                    <hr className="h-px border-0 bg-zinc-400 mt-2"></hr>
                                    <div className='mt-4'>
                                        {
                                            playlist.songs.map((song, idx) => {
                                                return (
                                                    <div className={`px-4 py-2 group/playlistView flex text-white items-center align-middle ${playerDetails.isPlaying && playerDetails.currentSongId == song._id && playerDetails.playlistId == playlistId ? 'bg-zinc-700 bg-opacity-50 rounded-md' : 'hover:bg-zinc-700 hover:bg-opacity-50 rounded-md'}`} key={idx}>
                                                        <h1 className={`w-[2%] ${playerDetails.isPlaying && playerDetails.currentSongId == song._id && playerDetails.playlistId == playlistId ? 'hidden' : 'group-hover/playlistView:hidden'} `}>{idx + 1}</h1>
                                                        {playerDetails.isPlaying && playerDetails.currentSongId == song._id && playerDetails.playlistId == playlistId ? <a href="#" className='w-[2%]' onClick={Pause}><i className="fa-solid fa-pause"></i></a> : <a href="#" className='w-[2%] hidden group-hover/playlistView:block' onClick={() => Play(song._id)}><i className="fa-solid fa-play"></i></a>}
                                                        <div className='w-[40%] flex items-center'>
                                                            <img src={firebaseImgUrl(song.image)} alt="" className='h-10 w-10' />
                                                            <div className='ml-2 flex flex-col'>
                                                                <Link to={`/songs/${song._id}`} className='hover:underline'>{song.name}</Link>
                                                                <div>
                                                                    {
                                                                        song.artists.slice(0, 2).map((artist, idx) => (
                                                                            <span key={idx}>
                                                                                <Link to={`/artists/${artist._id}`} className='text-sm text-zinc-400 hover:underline hover:text-white'>{artist.name}</Link>
                                                                                {idx !== song.artists.length - 1 && ', '}
                                                                            </span>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='w-[26%]'>
                                                            <a href='#' className={`hover:underline ${playerDetails.isPlaying && playerDetails.currentSongId == song.id ? 'text-white' : 'text-zinc-400 group-hover/playlistView:text-white'}`}>{song.album}</a>
                                                        </div>
                                                        <h1 className='w-[22%] text-zinc-400 cursor-default'>{new Date(song.dateAdded).toISOString().split('T')[0]}</h1>
                                                        {playlist.isUserPlaylist ?
                                                            <div className='w-[10%] text-zinc-400 flex items-center justify-evenly'>
                                                                <h1 className=' text-center'>{parseFloat(song.duration / 60).toFixed(2)}</h1>
                                                                <button
                                                                    onClick={() => removeSongFromPlaylist(song._id)}
                                                                >
                                                                    <i className="fa-regular fa-circle-xmark hover:text-white"></i>
                                                                </button>
                                                            </div>
                                                            :
                                                            <h1 className='w-[10%] text-zinc-400 text-center'>{parseFloat(song.duration / 60).toFixed(2)}</h1>
                                                        }

                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </>
                                :
                                <h1 className='text-center text-zinc-400 text-2xl font-semibold'>Please add any songs to your playlist!</h1>
                            }

                        </div>
                    </div>
                </>
            }

            {isEditModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                    <div className='w-[35%] rounded-lg p-5 bg-neutral-800 flex flex-col'>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-xl text-white font-semibold'>Edit Details</h1>
                            <button
                                onClick={closeEditModal}
                            >
                                <i className="fa-solid fa-xmark text-zinc-300 text-2xl"></i>
                            </button>
                        </div>
                        <div className='flex mt-4 gap-3'>
                            <div className='relative group'>
                                <label htmlFor="uploadPhoto" className="w-40 h-40 absolute justify-center cursor-pointer items-center bg-zinc-900 bg-opacity-60 hidden group-hover:flex">
                                    <input
                                        type="file"
                                        id="uploadPhoto"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e.target.files[0])}
                                        className="hidden"
                                    />
                                    <div className='text-center space-y-2 text-white'>
                                        <i className='fa-solid fa-pencil text-4xl'></i>
                                        <h1>Choose photo</h1>
                                    </div>
                                </label>
                                {playlistImage ?

                                    <img src={firebaseImgUrl(playlistImage)} alt="" className='w-40 h-40 image shadow-[0px_4px_18px_-5px_rgb(0,0,0)]' />
                                    :
                                    playlist.songs.length > 0 ?
                                        <img src={firebaseImgUrl(playlist.songs[0].image)} alt="" className='w-40 h-40 image shadow-[0px_4px_18px_-5px_rgb(0,0,0)]' />
                                        :
                                        <div className='w-40 h-40 bg-zinc-800 flex justify-center items-center shadow-[0px_4px_18px_-5px_rgb(0,0,0)]'>
                                            <i class="fa-solid fa-music text-zinc-500 text-7xl"></i>
                                        </div>
                                }
                            </div>
                            <div className='flex-1 -mt-2'>
                                <div>
                                    <label htmlFor="stallType" className="text-sm float-start font-medium leading-6 text-white">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id='name'
                                        value={playlistName}
                                        onChange={(e) => setPlaylistName(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 px-2 text-zinc-200 shadow-sm bg-neutral-600"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="stallType" className="text-sm float-start font-medium leading-6 text-white">
                                        Description
                                    </label>
                                    <textarea
                                        type="text"
                                        name="description"
                                        id='description'
                                        value={playlistDescription}
                                        onChange={(e) => setPlaylistDescription(e.target.value)}
                                        rows={'3'}
                                        className="block w-full rounded-md border-0 py-1.5 px-2 text-zinc-200 shadow-sm bg-neutral-600 resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>

                            <button
                                className='text-black float-right mt-3 font-bold bg-white px-6 rounded-full p-2 hover:scale-105'
                                onClick={editPlaylist}
                            >
                                Save
                            </button>
                        </div>
                        <h1 className='text-white text-xs mt-2 font-semibold'>By proceeding, you agree to give Spotify access to the image you choose to upload. Please make sure you have the right to upload the image.</h1>
                    </div>
                </div>
            )}
        </div>
    )
}
