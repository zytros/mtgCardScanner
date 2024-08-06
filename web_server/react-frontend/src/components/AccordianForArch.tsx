import React, { useState} from 'react';
import './Accordian.css';

interface Props {
    title: string,
    src: string
  }
const AccordianForArch : React.FC<Props> = (props) => {
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
                aria-labelledby="headingOne"
                
              >
                  <div dangerouslySetInnerHTML={{ __html: props.src}}></div>
              </div> 
        </div>
      </div>
    );
}
  
  
  export default AccordianForArch;