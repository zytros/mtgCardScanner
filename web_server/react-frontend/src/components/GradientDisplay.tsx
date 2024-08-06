import React, { useEffect, useState } from 'react';
import { getImage } from '../router/resources/data';
import './GridContainer.css'

// const ImageSrcs = [
//     "persiancat1",
//     "persiancat2",
//     "persiancat3",
//     "persiancat4",
//     "persiancat5"
// ]

interface GradientDisplayProps {
    texthtml: string;
    images: string[];
    gt_dir_path: string;
    grad_dir_path: string;
    pred_classes: string[] | undefined;
}

const GradientDisplay: React.FC<GradientDisplayProps> = ({texthtml, images, gt_dir_path, grad_dir_path, pred_classes}) => {
    
    const [ImagesGt, setImagesGt] = useState<string[]>([]);
    const [ImagesGradients, setImagesGradients] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<number | undefined>(0);


    const handleImageClick = (image: number) => {
        setSelectedImage(image);
    };

    useEffect(() => {
        const image_gt_promises = images.map(image => getImage(gt_dir_path+image));
        Promise.all(image_gt_promises)
            .then((results) => {
                const filteredResults = results.filter((result): result is string => result !== undefined);
                setImagesGt(filteredResults);
            })
            .catch(console.error);
        
        const image_gradients_promises = images.map(image => getImage(grad_dir_path+image+"_gradients"));
        Promise.all(image_gradients_promises)
            .then((results) => {
                const filteredResults = results.filter((result): result is string => result !== undefined);
                setImagesGradients(filteredResults);
            })
            .catch(console.error);

    }, []);


    
    return (
        <div className="two-containers">
            <div className="text-container-left">
                <div dangerouslySetInnerHTML={{__html: texthtml}}></div>
            </div>
            <div className="content-container-right">
                <div className='gradient-display'>
                    <div className="image-gallery3" style ={{margin:"15px"}}>
                        {ImagesGt.map((img, index) => (
                            <img
                                width={75}
                                height={75}
                                key={index}
                                src={img}
                                alt={`Thumbnail ${index}`}
                                onClick={() => handleImageClick(index)}
                                className={selectedImage === index ? 'selected-image-highlight' : ''}
                            />
                        ))}
                    </div>
                    <div>
                        <div className="image-selection">
                            {selectedImage !== undefined && (
                                <div>
                                    <img src={ImagesGt[selectedImage]} alt="Selected" style={{ width: '150px', height: 'auto' }} />
                                </div>
                            )}
                            {selectedImage !== undefined && (
                                <div>
                                    <img src={ImagesGradients[selectedImage]} alt="Selected" style={{ width: '150px', height: 'auto' }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'center', paddingBottom: '10px'}}>
                    {selectedImage !== undefined && pred_classes !== undefined && (
                        <p>{"Predicted Class: "+pred_classes[selectedImage]}</p>
                    )}                
                </div>
            </div>
        </div>
    );
}

export default GradientDisplay;



