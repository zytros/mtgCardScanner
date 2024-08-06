import React from 'react';
import './TextStyles.css';

class ParagraphComponentHTML extends React.Component<{ text: string }> {
  render() {
    return (
      <div className='paragraph_html' dangerouslySetInnerHTML={{ __html: this.props.text}}></div>
    );
  }
}

export default ParagraphComponentHTML;