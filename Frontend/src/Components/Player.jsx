import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setIsPlaying, setSongId } from '../store/reducers/playerSlice';
import { firebaseImgUrl, firebaseSongUrl } from '../constants';
import { Link } from 'react-router-dom';

export default function Player({ user }) {
    const dispatch = useDispatch();
    const playerDetails = useSelector((state) => state.player.playerDetails);
    var myPlayer = useRef();
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentVolume, setCurrentVolume] = useState(1);
    const [songs, setSongs] = useState(null);
    var [song, setSong] = useState(null);
    const [audioReady, setAudioReady] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentTime == duration) {
            dispatch(setIsPlaying(false));
            setCurrentTime(0);
        }
    }, [currentTime, duration])

    useEffect(() => {
        if (playerDetails.isPlaying == false && playerDetails.playlistId == null && playerDetails.currentSongId == null && playerDetails.songs.length == 0 && playerDetails.artistId == null) {
            setSongs(null);
            setSong(null);
            setDuration(0);
            setCurrentTime(0);
            setCurrentIndex(0);
        }
    }, [playerDetails])

    useEffect(() => {
        if (playerDetails.songs.length != 0) {
            var idx = playerDetails.songs.findIndex(obj => obj._id == playerDetails.currentSongId);
            setCurrentIndex(idx);
            setSongs(playerDetails.songs);
            resetPlayer(idx);
        }
    }, [playerDetails.songs])

    useEffect(() => {
        if (playerDetails.songs.length != 0) {
            var idx = playerDetails.songs.findIndex(obj => obj._id == playerDetails.currentSongId);
            setCurrentIndex(idx);
            resetPlayer(idx);
        }
    }, [playerDetails.currentSongId])

    useEffect(() => {
        playerDetails.isPlaying ? myPlayer.current.play() : myPlayer.current.pause();
    }, [playerDetails.isPlaying])

    async function resetSong() {
        await dispatch(setIsPlaying(false));
        myPlayer.current.removeEventListener('timeupdate', () => {
            setCurrentTime(myPlayer.current.currentTime);
        });
        myPlayer.current.removeEventListener('loadedmetadata', () => {
            setDuration(myPlayer.current.duration);
        });

        myPlayer.current.currentTime = 0;
        setSong(null);
        setCurrentTime(0);
        setDuration(0);
    }

    async function resetPlayer(index) {
        await resetSong();
        await setSong(prevSong => prevSong = playerDetails.songs[index]);
        //await dispatch(setSongId(playerDetails.songs[index]._id));
        await dispatch(setIsPlaying(true));
        myPlayer.current.addEventListener('timeupdate', () => {
            setCurrentTime(myPlayer.current.currentTime);
        });
        myPlayer.current.addEventListener('loadedmetadata', () => {
            setDuration(myPlayer.current.duration);
            setAudioReady(true);
        });
    }

    function playAudio() {
        dispatch(setIsPlaying(true));
    }
    function pauseAudio() {
        dispatch(setIsPlaying(false));
    }
    function changeRange(e) {
        const newTime = parseFloat(e.target.value);
        myPlayer.current.currentTime = newTime;
        setCurrentTime(newTime);
    }
    function changeVolume(e) {
        const newVolume = parseFloat(e.target.value);
        myPlayer.current.volume = newVolume;
        setCurrentVolume(newVolume);
    }

    async function nextSong() {
        setCurrentIndex(prev => prev + 1);
        // await resetPlayer(currentIndex + 1);
        await dispatch(setSongId(playerDetails.songs[currentIndex + 1]._id));
    }

    async function prevSong() {
        setCurrentIndex(prev => prev - 1);
        //await resetPlayer(currentIndex - 1);
        await dispatch(setSongId(playerDetails.songs[currentIndex - 1]._id));
    }

    return (
        <div className={`bg-black mt-2 p-2 px-3 text-white flex justify-between items-center ${user ? '' : 'hidden'}`}>
            <div className='flex items-center w-[30%]'>
                {
                    song &&
                    <>
                        <img src={firebaseImgUrl(song.image)} alt="" className='w-14 h-14 rounded-md' />
                        <div className='flex flex-col ml-2'>
                            <a href="#">{song.name}</a>
                            <div>
                                {
                                    song.artists.slice(0, 2).map((artist, idx) => (
                                        <span key={idx}>
                                            <Link to={`/artists/${artist._id}`} className='text-xs text-zinc-400 hover:underline hover:text-white'>{artist.name}</Link>
                                            {idx !== song.artists.length - 1 && ', '}
                                        </span>
                                    ))
                                }
                            </div>
                        </div>
                        <i className="fa-regular fa-heart ml-5 text-zinc-400 hover:text-white"></i>
                    </>
                }
            </div>
            <div className='h-full flex flex-col justify-between align-middle w-[40%]'>
                <div className='flex items-center justify-center gap-6'>
                    <button disabled={playerDetails.songs == null || currentIndex <= 0} onClick={prevSong}><i className={`fa-solid fa-backward-step text-white text-xl ${playerDetails.songs == null || currentIndex <= 0 ? "text-zinc-400" : "cursor-pointer"} `}></i></button>
                    {
                        playerDetails.isPlaying ? <i className="fa-solid fa-circle-pause text-3xl" onClick={pauseAudio}></i> : <button disabled={!song}><i className="fa-solid fa-circle-play text-3xl" onClick={playAudio}></i></button>
                    }

                    <button disabled={playerDetails.songs == null || currentIndex >= playerDetails.songs.length - 1} onClick={nextSong}><i className={`fa-solid fa-forward-step text-white text-xl ${playerDetails.songs == null || currentIndex >= playerDetails.songs.length - 1 ? "text-zinc-400" : "cursor-pointer"}`}></i></button>
                </div>
                <div className='flex items-center'>
                    <p className='text-xs text-zinc-400'>{parseFloat(currentTime / 60).toFixed(2)}</p>
                    <input type="range" name="" id="songSlider" value={currentTime} step="0.1" onChange={changeRange} onTimeUpdate={changeRange} max={duration} className='h-[3px] w-full rounded-md bg-zinc-600 mx-2' />
                    <p className='text-xs text-zinc-400'>{parseFloat(duration / 60).toFixed(2)}</p>
                </div>
            </div>
            <div className='w-[30%]'>
                <div className='float-right flex items-center gap-2'>
                    <i className="fa-solid fa-volume-high text-zinc-400"></i>
                    <input type="range" name="" id="songSlider" min="0" max="1" step="0.1" value={currentVolume} onChange={changeVolume} className='h-[3px] w-full rounded-md bg-zinc-600 mx-2' />
                </div>
            </div>
            <audio key={song ? song._id : '1'} className='hidden' ref={myPlayer} >
                {
                    song &&
                    <source src={firebaseSongUrl(song.file)} type="audio/mpeg" />
                }
            </audio>
        </div>
    )
}
