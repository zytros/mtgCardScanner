import { useEffect, useState } from 'react';
import { getImage } from '../router/resources/data';
import './Image.css';


function ImageSmallComponent(img_path: string | any) {
    // TODO: fix! Whyyyy?
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
            <div className ="image_small_container">
            <img className="image_small" src={image} alt="If you can read this, hehe hi :)" />
            </div>
        );
    }

export default ImageSmallComponent;