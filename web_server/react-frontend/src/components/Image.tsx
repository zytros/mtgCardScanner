import { useEffect, useState } from 'react';
import { getImage } from '../router/resources/data';
import './Image.css';


function ImageComponent(img_path: string | any) {
    const [image, setImage] = useState<string | undefined>();
    const path = img_path.img_path;
    useEffect(() => {
        getImage(path).then((imageData) => {
            setImage(imageData);
        }).catch(console.error);
    }, []);
    
    if(!image){
        return <div>loading...</div>
    };
    return (
        <img className="image" src={image} alt="If you can read this, hehe hi :)" />
    );
    }

export default ImageComponent;