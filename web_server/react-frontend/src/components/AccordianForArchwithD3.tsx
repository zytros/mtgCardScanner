import React, { useState} from 'react';
import './Accordian.css';
import VisionTransformer from './VisionTransformer';
interface Props {
    title: string,
    text: string,
    folder_path: string;
    images: string[];

  }
const AccordianForArchWithD3 : React.FC<Props> = (props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };
    return (
      <div className = "accordianWrapper">
        <div className="accordion" id="accordionExample">
            <h2 className="accordion-header" id="headingOne">
              <button
                className={`accordion-button ${isOpen ? 'active' : ''}`}
                type="button"
                onClick={toggleAccordion}
                aria-expanded={isOpen}
                aria-controls="collapseOne"
              >
                  {props.title}
              </button>
            </h2>
            <div
              id="collapseOne"
              className={`accordion-body ${isOpen ? 'show' : 'hide'}`}
              aria-labelledby="headingOne">
                <div dangerouslySetInnerHTML={{ __html: props.text}}></div>
                <VisionTransformer folder_path={props.folder_path} images={props.images}></VisionTransformer>
            </div> 
        </div>
      </div>
    );
}
  
  
  export default AccordianForArchWithD3;