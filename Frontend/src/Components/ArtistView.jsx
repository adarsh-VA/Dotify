import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setArtistId, setPlayerSongs, setIsPlaying, setSongId, setPlaylistId } from '../store/reducers/playerSlice';
import axios from 'axios';
import { backendImageUrl, backendUrl, firebaseImgUrl } from '../constants';

export default function ArtistView() {

    const { artistId } = useParams();
    const [artist, setArtist] = useState(null);
    const playerDetails = useSelector((state) => state.player.playerDetails);
    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state.user.token);
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const imageRef = useRef();
    const [rgb, setRgb] = useState(null);
    const [rgba, setRgba] = useState(null);

    function getAverageRGB(img) {
        var blockSize = 100,
            defaultRGB = { r: 0, g: 0, b: 0 },
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

        height = canvas.height = img.height;
        width = canvas.width = img.width;

        context.drawImage(img, 0, 0);

        try {
            data = context.getImageData(0, 0, width, height);
        } catch (e) {
            console.log('error ', e);
            return defaultRGB;
        }

        length = data.data.length;
        while ((i += blockSize * 4) < length) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
        }

        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);

        setRgb('rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
        setRgba('rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + '0.3' + ')');
    }

    useEffect(() => {
        if (user) {
            axios.get(`${backendUrl}/artists/${artistId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
                .then((res) => {
                    setArtist(res.data);
                })
        }
        else {
            navigate('/login');
        }
    }, []);

    useEffect(() => {
        if (artist) {
            const img = new Image();
            img.src = imageRef.current.style.backgroundImage.slice(5, -2); // Extract the image URL from the style
            img.crossOrigin = "Anonymous";

            const handleImageLoad = () => {
                getAverageRGB(img);
            };

            img.addEventListener('load', handleImageLoad);

            // Clean up the event listener
            return () => {
                img.removeEventListener('load', handleImageLoad);
            };
        }
    }, [artist]);

    async function Play(songId = null) {
        if (user) {

            if (playerDetails.artistId == null && songId != null) {
                dispatch(setPlayerSongs(artist.songs));
                dispatch(setPlaylistId(null));
                dispatch(setArtistId(artistId));
                dispatch(setSongId(songId));
            }
            else if (playerDetails.artistId == artistId && songId != null && songId != playerDetails.currentSongId) {
                dispatch(setSongId(songId));
            }
            else if (playerDetails.artistId == artistId && playerDetails.isPlaying == false) {
                dispatch(setIsPlaying(true));
            }
            else {
                songId = artist.songs[0]._id
                dispatch(setPlayerSongs(artist.songs));
                dispatch(setArtistId(artistId));
                dispatch(setPlaylistId(null));
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

    const gradientStyle = {
        backgroundImage: `linear-gradient(to bottom, ${rgb}, 200px, transparent 550px)`,
    };

    const bgColorStyle = {
        backgroundColor: `${rgba}`,
    };

    return (
        <>
            {
                artist &&

                <div style={gradientStyle}>
                    <div className='px-7 pt-44 pb-4 bg-cover bg-center' style={{ backgroundImage: `url(${backendImageUrl}/${artist.image})` }} ref={imageRef} crossOrigin='Anonymous'>
                        <h1 className='text-white text-xl font-semibold pl-2'>Artist</h1>
                        <h1 className='text-white text-8xl font-semibold pb-2'>{artist.name}</h1>
                    </div>
                    <div className='px-7 p-4'>
                        <div className='flex items-center gap-5'>
                            {playerDetails.isPlaying && playerDetails.artistId == artistId ? <button className=' text-black bg-green-500 h-14 w-14 rounded-full hover:scale-105' onClick={Pause}><i className="fa-solid fa-pause text-xl"></i></button> : <button className=' text-black bg-green-500 h-14 w-14 rounded-full hover:scale-105' onClick={() => Play()}><i className="fa-solid fa-play text-xl"></i></button>}
                            <button className='text-white text-sm font-semibold py-1 px-3 ring-1 ring-zinc-500 rounded-3xl hover:ring-white hover:scale-105'>Follow</button>
                            <i className="fa-solid fa-ellipsis text-zinc-500 text-3xl hover:text-white cursor-pointer"></i>
                        </div>
                    </div>
                    <div className='mt-3 px-7 pb-3'>
                        <h1 className='text-white text-2xl font-semibold'>Songs</h1>
                        <div className='mt-4 px-5'>
                            {
                                artist.songs.map((song, idx) => {
                                    return (
                                        <div className={`px-4 py-2 group/playlistView flex w-[75%] text-white items-center align-middle ${playerDetails.isPlaying && playerDetails.currentSongId == song._id && playerDetails.artistId == artistId ? 'bg-zinc-700 bg-opacity-50 rounded-md' : 'hover:bg-zinc-700 hover:bg-opacity-50 rounded-md'}`} key={idx}>
                                            <h1 className={`w-[3%] ${playerDetails.isPlaying && playerDetails.currentSongId == song._id && playerDetails.artistId == artistId ? 'hidden' : 'group-hover/playlistView:hidden'} `}>{idx + 1}</h1>
                                            {playerDetails.isPlaying && playerDetails.currentSongId == song._id && playerDetails.artistId == artistId ? <a href="#" className='w-[3%]' onClick={Pause}><i className="fa-solid fa-pause"></i></a> : <a href="#" className='w-[3%] hidden group-hover/playlistView:block' onClick={() => Play(song._id)}><i className="fa-solid fa-play"></i></a>}
                                            <div className='w-[40%] flex items-center'>
                                                <img src={firebaseImgUrl(song.image)} alt="" className='h-10 w-10' />
                                                <div className='ml-2 flex flex-col'>
                                                    <Link to={`/songs/${song._id}`} className='hover:underline'>{song.name}</Link>
                                                </div>
                                            </div>
                                            <div className='w-[26%]'>
                                                <a href='#' className={`hover:underline ${playerDetails.isPlaying && playerDetails.currentSongId == song.id ? 'text-white' : 'text-zinc-400 group-hover/playlistView:text-white'}`}>{song.album}</a>
                                            </div>
                                            <h1 className='w-[22%] text-zinc-400 cursor-default'>{new Date(song.dateAdded).toISOString().split('T')[0]}</h1>
                                            <h1 className='w-[10%] text-zinc-400 text-center'>{parseFloat(song.duration / 60).toFixed(2)}</h1>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='mt-7'>
                            <h1 className='text-white text-2xl font-semibold'>About</h1>
                            {
                                rgb &&

                                <div className='bg-opacity-30 w-[50%] p-10 mt-3 rounded-lg hover:scale-[1.02] transition' style={bgColorStyle}>
                                    <img src={firebaseImgUrl(artist.image)} alt="" className='w-44 h-44 object-cover rounded-full' />
                                    <div className='text-white text-md mt-4 space-y-1'>
                                        <h1 className='font-semibold'>{artist.caption}</h1>
                                        <h1>{artist.about}</h1>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
