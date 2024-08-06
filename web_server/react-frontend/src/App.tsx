import { useEffect, useState } from 'react';
import './App.css';
import { getContent,} from './router/resources/data';
import TitleComponent from './components/Title';
import ChapterComponent from './components/Chapter';
import { Dictionary } from './types/content';
import TableOfContents from './components/TableOfContents';

function App() {

  const [title, setTitle] = useState<string>();
  const [chapters, setChapters] = useState<Array<Dictionary>>();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    getContent().then(text_data => {
      setTitle(text_data.title);
      setChapters(text_data.chapters);
    }
  );
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Check the initial screen size
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isMobile){ 
    return(
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Mobile Version Not Available</h1>
      <p>Please visit this website on a desktop device.</p>
    </div>
    )
  }
  return (
    <div className="App">
      <TitleComponent title={title!}> </TitleComponent>
      <div className='blog-body'>
      {chapters && chapters.map((chapter) => {
            if (chapter.chapter_title === 'Table of Contents') {
              return <TableOfContents chapters={chapters}></TableOfContents>
            }
            else if (!chapter.paragraphs) {
              return <h2 className="section-titles" id={chapter.chapter_title}>{chapter.chapter_title}</h2>
            }
            return <div id={chapter.chapter_title}>
              <ChapterComponent key={chapter.chapter_title} subtitle={chapter.chapter_title} paragraphs={chapter.paragraphs}></ChapterComponent>
              </div>
          })}
        </div>
    </div>
  )
}

export default App;
