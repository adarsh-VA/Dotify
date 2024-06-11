const backendUrl = 'https://dotifyBackend.vercel.app/api';
const backendImageUrl = 'http://localhost:8001/images';
const backendSongUrl = 'http://localhost:8001/mp3';

const firebaseImgUrl = (imgName)=>{
    return `https://firebasestorage.googleapis.com/v0/b/dotify-fb997.appspot.com/o/images%2F${imgName}?alt=media`
}

const firebaseSongUrl = (songName)=>{
    return `https://firebasestorage.googleapis.com/v0/b/dotify-fb997.appspot.com/o/songs%2F${songName}?alt=media`
}

module.exports = {
    backendUrl,
    backendImageUrl,
    backendSongUrl,
    firebaseImgUrl,
    firebaseSongUrl
}