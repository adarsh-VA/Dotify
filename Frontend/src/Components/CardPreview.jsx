import { Link } from 'react-router-dom'
import { firebaseImgUrl } from '../constants';
import { useEffect, useState } from 'react';


export default function CardPreview({ linkName, props }) {

    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);


    useEffect(() => {
        if (linkName == 'playlists') {
            setName(props.title);
            setDescription(props.description);
        }
        else if (linkName == 'songs') {
            setName(props.name);
        }
        else if (linkName == 'artists') {
            setName(props.name);
            setDescription(props.caption);
        }
    }, [linkName])

    function truncateString(str) {

        if (str.length <= 40) {
            return str
        }

        return str.slice(0, 40) + '...'
    }

    return (
        <Link to={`/${linkName + '/' + props._id}`} className='p-4 w-44 rounded-md bg-zinc-900 group hover:bg-zinc-800 hover:cursor-pointer hover:duration-300'>
            <div className='h-36 mb-3 shadow-[0px_4px_18px_-5px_rgb(0,0,0)]'>
                {
                    props.image ?
                        <img src={firebaseImgUrl(props.image)} alt="" className='w-full h-full rounded-md object-cover' />
                        :
                        <div className='w-full h-full rounded-md bg-zinc-800 flex justify-center items-center shadow-[0px_4px_18px_-5px_rgb(0,0,0)]'>
                            <i class="fa-solid fa-music text-zinc-500 text-7xl"></i>
                        </div>
                }

            </div>
            {name && <h3 className='font-bold mb-1 text-white'>{name}</h3>}
            {description && <p className='text-sm text-zinc-400'>{truncateString(description)}</p>}
        </Link>
    )
}
