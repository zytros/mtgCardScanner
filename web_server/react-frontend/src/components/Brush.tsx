import React, { useRef, useEffect, useState, MouseEvent } from 'react';
import { getImage, getOcclusionPrediction } from '../router/resources/data';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';
import { TailSpin } from 'react-loader-spinner';
import './Image.css';

let precalcProbs:{ name: string; confidence: number; }[][] = [
    [{ "name": "Persian cat", "confidence": 98.7}, { "name": "Egyptian cat", "confidence": 0.3}, { "name": "lynx", "confidence": 0.3}, { "name": "Angora", "confidence": 0.2}, { "name": "tabby", "confidence": 0.1}],
    [{ "name": "Persian cat", "confidence": 99.8}, { "name": "Egyptian cat", "confidence": 0.0}, { "name": "Angora", "confidence": 0.0}, { "name": "tabby", "confidence": 0.0}, { "name": "tiger cat", "confidence": 0.0}],
    [{ "name": "Persian cat", "confidence": 99.5}, { "name": "Angora", "confidence": 0.2}, { "name": "Egyptian cat", "confidence": 0.0}, { "name": "lynx", "confidence": 0.0}, { "name": "tabby", "confidence": 0.0}],
    [{ "name": "Persian cat", "confidence": 99.6}, { "name": "Angora", "confidence": 0.0}, { "name": "Egyptian cat", "confidence": 0.0}, { "name": "tabby", "confidence": 0.0}, { "name": "face powder", "confidence": 0.0}],
    [{ "name": "Persian cat", "confidence": 95.4}, { "name": "Angora", "confidence": 0.4}, { "name": "Egyptian cat", "confidence": 0.3}, { "name": "tub", "confidence": 0.3}, { "name": "bathtub", "confidence": 0.3}],
    [{ "name": "tusker", "confidence": 56.6}, { "name": "Indian elephant", "confidence": 42.8}, { "name": "African elephant", "confidence": 0.5}, { "name": "patas", "confidence": 0.0}, { "name": "ox", "confidence": 0.0}],
    [{ "name": "Indian elephant", "confidence": 79.7}, { "name": "tusker", "confidence": 19.1}, { "name": "African elephant", "confidence": 0.9}, { "name": "oxcart", "confidence": 0.1}, { "name": "Arabian camel", "confidence": 0.0}],
    [{ "name": "Model T", "confidence": 99.8}, { "name": "car wheel", "confidence": 0.0}, { "name": "half track", "confidence": 0.0}, { "name": "tow truck", "confidence": 0.0}, { "name": "grille", "confidence": 0.0, }],    
    [{ "name": "Model T", "confidence": 99.7}, { "name": "tow truck", "confidence": 0.0}, { "name": "car wheel", "confidence": 0.0}, { "name": "half track", "confidence": 0.0}, { "name": "horse cart", "confidence": 0.0}],
    [{ "name": "goose", "confidence": 99.2}, { "name": "drake", "confidence": 0.3}, { "name": "red-breasted merganser", "confidence": 0.1}, { "name": "black swan", "confidence": 0.0}, { "name": "flamingo", "confidence": 0.0}],    
    [{ "name": "goose", "confidence": 99.0}, { "name": "drake", "confidence": 0.1}, { "name": "lakeside", "confidence": 0.0}, { "name": "black swan", "confidence": 0.0}, { "name": "black grouse", "confidence": 0.0}],
    [{ "name": "harp", "confidence": 99.9}, { "name": "cello", "confidence": 0.0}, { "name": "electric guitar", "confidence": 0.0}, { "name": "flute", "confidence": 0.0}, { "name": "violin", "confidence": 0.0}],    
    [{ "name": "harp", "confidence": 99.9}, { "name": "cello", "confidence": 0.0}, { "name": "upright", "confidence": 0.0}, { "name": "wool", "confidence": 0.0}, { "name": "park bench", "confidence": 0.0}],
    [{ "name": "Persian cat", "confidence": 92.3}, { "name": "Angora", "confidence": 1.1}, { "name": "Egyptian cat", "confidence": 0.8}, { "name": "tabby", "confidence": 0.5}, { "name": "Lhasa", "confidence": 0.4}
    ]
    
];

interface Props {
    images: string[];
}
let offsets : number[][]= [];
const xDim : number = 300;
const yDim : number = 300;
const imageGalaryTop : number = 7;
let savedMasks: Map<number, number[][]> = new Map();

const Brush: React.FC<Props> = ({ images }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<number>(0);
    const [chartData, setChartData] = useState<{ name: string; confidence: number; }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const brush_size = 20;

    const handleImageClick = (image: number) => {
        saveMask();
        offsets = [];
        setSelectedImage(image);
    };

    const onSubmit = async (mask: number[][]): Promise<void> => {
        setLoading(true);
        let predictions: { name: string; confidence: number; }[] = [];
        if(checkAllOnes(mask)){            
            predictions = precalcProbs[selectedImage];
        }else{
            predictions = await getOcclusionPrediction(images[selectedImage] + '.png', mask);
        }
        setChartData(predictions);
        setLoading(false);
    };

    useEffect(() => {
        const promises = images.map(image => getImage(image));
        Promise.all(promises)
            .then((results) => {
                const filteredResults = results.filter((result): result is string => result !== undefined);
                setBackgroundImages(filteredResults);
            })
            .catch(console.error);
    }, [images]);
    
    const drawImageOnCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas && backgroundImages.length > 0) {
            const context = canvas.getContext('2d');
            if (context) {
                canvas.width = xDim;
                canvas.height = yDim;
    
                const backgroundImage = new Image();
                backgroundImage.src = backgroundImages[selectedImage];
                
                backgroundImage.onload = () => {
                    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
                    context.strokeStyle = 'black';
                    context.lineWidth = 2;
                    context.lineCap = 'round';
                }
                
                backgroundImage.onerror = (error) => {
                    console.error("Failed to load image:", error);
                }
                //onSubmit([[1,1],[1,1]]);
            }
        }
    }

    useEffect(() => {
        drawImageOnCanvas();
        setTimeout(() => {
            loadMask();
        }, 10);
    }, [backgroundImages, selectedImage]);

    const startDrawing = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
        const { offsetX, offsetY } = nativeEvent;
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                context.beginPath();
                context.moveTo(offsetX, offsetY);
            }
        }
        setIsDrawing(true);
        offsets.push([-2,-2])
    };

    const draw = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                context.lineTo(offsetX, offsetY);
                context.lineWidth = brush_size;
                context.stroke();
                offsets.push([offsetX, offsetY]);
            }
        }
    };

    const stopDrawing = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                context.closePath();
            }
        }
        setIsDrawing(false);
        offsets.push([-1,-1]);
    };

    const submitDrawing = () => {
        const arr = Array(xDim/brush_size).fill(null).map(() => Array(yDim/brush_size).fill(1));
        for (var offEL of offsets){
            let x = offEL[0];
            let y = offEL[1];
            if(x === -1 || y === -1) continue;
            x = Math.max(Math.min(x, xDim-1), 0);
            y = Math.max(Math.min(y, yDim-1), 0);
            arr[Math.floor(x/brush_size)][Math.floor(y/brush_size)] = 0;
        }
        onSubmit(arr);
    }

    const clearMask = () => {
        offsets = [];
        drawImageOnCanvas();
    }

    const saveMask = () => {
        savedMasks.set(selectedImage, offsets);

    }

    const loadMask = () => {
        let savedOffsets = savedMasks.get(selectedImage);
        if (savedOffsets) {
            const canvas = canvasRef.current;
            if (canvas) {
                const context = canvas.getContext('2d');
                if (context) {
                    for (var offEL of savedOffsets){
                        let offsetX = offEL[0];
                        let offsetY = offEL[1];
                        if(offsetX === -1 || offsetY === -1) {
                            context.closePath();
                            continue;
                        }
                        if(offsetX === -2 || offsetY === -2) {
                            context.beginPath();
                            continue;
                        }
                        context.lineTo(offsetX, offsetY);
                        context.lineWidth = brush_size;
                        context.stroke();
                    }                
                }
            }
            offsets = savedOffsets;            
        }
        submitDrawing();
    }

    const formatYAxis = (tickItem: number) => {
        return `${tickItem}%`;
    };

    function checkAllOnes(matrix: number[][]): boolean {
        for (let row of matrix) {
            for (let value of row) {
                if (value !== 1) {
                    return false;
                }
            }
        }
        return true;
    }

    return (
        <div style={{ width: 'fit-content', margin: 'auto' }} >
            <div className="image-gallery-no-padding" style={{padding: "10px 0px 5px 0px"}}>
                {backgroundImages.slice(0,imageGalaryTop).map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Thumbnail ${index}`}
                        onClick={() => handleImageClick(index)}
                        style={{
                            width: '75px', 
                            height:'75px', 
                            border: selectedImage === index ? '2px solid #3a0b97' : 'none',
                            boxShadow: selectedImage === index ? '0 0 8px #3a0b97' : 'none'
                        }}
                    />
                ))}
            </div>
            <div className="image-gallery-no-padding" style={{padding: "0px 0px 20px 0px"}}>
                {backgroundImages.slice(imageGalaryTop,backgroundImages.length).map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Thumbnail ${index}`}
                        onClick={() => handleImageClick(index+7)}
                        style={{
                            width: '75px', 
                            height:'75px', 
                            border: selectedImage === index+7 ? '2px solid #3a0b97' : 'none',
                            boxShadow: selectedImage === index+7 ? '0 0 8px #3a0b97' : 'none'
                        }}
                    />
                ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom:10}}>
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    onMouseOut={stopDrawing}
                    className='canvasBrush'
                />
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <button className='button-9' style={{margin: '2px'}} onClick={submitDrawing}>Submit for Prediction</button>
                    <button className='button-9' style={{margin: '2px'}} onClick={clearMask}>Clear Mask</button>
                </div>
                    {loading ? (
                        <div style={{width: 500, height: 300, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                        <TailSpin
                            height="80"
                            width="80"
                            color="#3a0b97"
                            ariaLabel="loading"
                        />
                        <p style={{color:"#3a0b97" }}>    Predicting Class Logits</p>
                        </div>
                    ) : (
                        <BarChart width={500} height={300} data={chartData} margin={{ bottom: 45 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" interval={0} textAnchor="end" tick={{ fontSize: 12 }} angle={-25} />
                            <YAxis domain={[0, 100]} tickFormatter={formatYAxis} />
                            <Legend verticalAlign="top" align="center" height={35}/>
                            <Bar 
                                dataKey="confidence" 
                                name="class probability" 
                                fill="#3a0b97" />
                        </BarChart>
                    )}
            </div>
        </div>
    );
};

export default Brush;
