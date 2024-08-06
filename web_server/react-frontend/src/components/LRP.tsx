import React, { useEffect, useState } from 'react';
import { getImage } from '../router/resources/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Rectangle} from 'recharts';
import ParagraphComponentHTML from './html_paragraph';
import './Image.css';
import './TextStyles.css'
import './GridContainer.css'

interface DataItem {
    name: string;
    confidence: number;
    index: number;
}

interface LRPProps {
    texthtml: string;
    gt_image_dir_path: string;
    lrp_image_dir_path: string;
    input_data: DataItem[][];
    input_images: string[];
}
      
const LRP: React.FC<LRPProps> = ({ texthtml, gt_image_dir_path, lrp_image_dir_path, input_data, input_images }) => {

    const data = input_data;
    const images = input_images;
    
    const [gtImages, setGtImages] = useState<string[]>([]);
    const [rlpImages, setRlpImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<number | undefined>(0);
    const [selectedBaseImage, setSelectedBaseImage] = useState<number>(0);
    const [chartData, setChartData] = useState<any[]>(data[0]);


    const handleImageClick = (image: number) => {
        setSelectedImage(image * 5);
        setSelectedBaseImage(image);
        setChartData(data[image]);
    };

    const handleBarHover = (index: number = 0) => {
        setSelectedImage(5 * selectedBaseImage + index);
    };

    const formatYAxis = (tickItem: number) => {
        return `${tickItem}%`;
    };


    const CustomTick = (props: any) => {
        const { x, y, payload, index } = props;
        const isSelected = selectedImage === index+5*selectedBaseImage;
        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="end"
                    fill={isSelected ? "#3a0b97": "#000"}
                    fontWeight={isSelected ? "bold" : "normal"}
                    transform="rotate(-20)"
                    style={{ fontSize: '12px' }}
                    onMouseOver={() => handleBarHover(index)}
                    onMouseOut={() => handleBarHover()}
                >
                    {payload.value}
                </text>
            </g>
        );
    };

    const CustomBar = (props: any) => {
        const { fill, x, y, width, height, onMouseOver, onMouseOut, index } = props;
    
        return (
            <g>
                <Rectangle
                    x={x}
                    y={0} // Start from the top of the chart
                    width={width}
                    height={y + height} // Full height from top to the bottom of the bar
                    fill="transparent"
                    onMouseOver={() => handleBarHover(index)}
                    onMouseOut={() => handleBarHover()}
                />
                <Rectangle
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={fill}
                    onMouseOver={() => onMouseOver(index)}
                    onMouseOut={() => onMouseOut()}
                />
            </g>
        );
    };

    useEffect(() => {
        const gt_promises = images.slice(0, 5).map(image => getImage(gt_image_dir_path+"..."+image));
        Promise.all(gt_promises)
            .then((results) => {
                const filteredResults = results.filter((result): result is string => result !== undefined);
                setGtImages(filteredResults);
            })
            .catch(console.error);
        
        const lrp_promises = images.slice(5,30).map(image => getImage(lrp_image_dir_path+"..."+image));        Promise.all(lrp_promises)
            .then((results) => {
                const filteredResults = results.filter((result): result is string => result !== undefined);
                setRlpImages(filteredResults);
            })
            .catch(console.error);
    }, []);
/*
<BarChart width={360} height={200} data={chartData} margin={{ bottom: 45 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis
        dataKey="name"
        interval={0}
        tick={<CustomTick />}
    />
    <YAxis domain={[0, 100]} tickFormatter={formatYAxis} />
    <Legend verticalAlign="top" align="center" height={35}/>
    <Bar 
        dataKey="confidence"
        name="class probability"
        fill="#3a0b97"
        onMouseOver={(data) => handleBarHover(data.index)}
        onMouseOut={() => handleBarHover()}
    />
</BarChart>*/
    
    return (
        <div className="two-containers">
            <div className="text-container-left">
                <div dangerouslySetInnerHTML={{__html: texthtml}}></div>
            </div>
            <div className="content-container-right">
                <div className="image-selection">
                    <div className="image-gallery2">
                        {gtImages.map((img, index) => (
                            <img
                                width={75}
                                height={75}
                                key={index}
                                src={img}
                                alt={`Thumbnail ${index}`}
                                onClick={() => handleImageClick(index)}
                                className={selectedBaseImage === index ? 'selected-image-highlight' : ''}
                            />
                        ))}
                    </div>
                    {selectedBaseImage !== undefined && selectedImage !== undefined &&(
                            <div className="vertical-container">
                                <div style={{marginLeft: "40px", marginBottom: "20px"}}>
                                    <img src={gtImages[selectedBaseImage]} alt="Selected" className="image-margin1" />
                                    <img src={rlpImages[selectedImage]} alt="Selected" className="image-margin2" />
                                </div>
                                
                                <BarChart width={360} height={200} data={chartData} margin={{ bottom: 45 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        interval={0}
                                        tick={<CustomTick />}
                                    />
                                    <YAxis domain={[0, 100]} tickFormatter={formatYAxis} />
                                    <Legend verticalAlign="top" align="center" height={35}/>
                                    <Bar 
                                        dataKey="confidence"
                                        name="class probability"
                                        fill="#3a0b97"
                                        shape={<CustomBar onMouseOver={(data:any) => handleBarHover(data.index)} onMouseOut={() => handleBarHover()} />}
                                    />
                                </BarChart>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default LRP;
