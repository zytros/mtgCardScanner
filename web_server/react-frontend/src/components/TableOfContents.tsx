import React, { useEffect, useState } from 'react';
import { Dictionary } from '../types/content';
import { getGIF, getImage } from '../router/resources/data';
import './TableOfContents.css';

interface Chapter {
  chapter_title: string;
  section: string;
}

interface Section {
  section_title: string;
  chapter_titles: string[];
}

interface TableOfContentsProps {
  chapters: Array<Dictionary>;
}


const TableOfContents: React.FC<TableOfContentsProps> = ({ chapters }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [gifs, setGifs] = useState<{ [key: string]: string }>({});
  const [visible, setVisible] = useState(false);
  const [img_default, setImg_default] = useState<string>("");


  useEffect(() => {
    const sectionsMap: { [key: string]: string[] } = {};

    chapters.forEach(chapter => {
      if (chapter.section) {
        if (!sectionsMap[chapter.section]) {
          sectionsMap[chapter.section] = [];
        }
        sectionsMap[chapter.section].push(chapter.chapter_title);
      }
    });

    const sections: Section[] = Object.keys(sectionsMap).map(section_title => ({
      section_title,
      chapter_titles: sectionsMap[section_title],
    }));

    setSections(sections);

    const excludedTitles = ["Conclusion", "References", "What this blog post is about"];

    const gifPromises = sections.flatMap((section) =>
      section.chapter_titles
        .filter(title => !excludedTitles.includes(title))
        .map(title => {
        const sanitizedTitle = title.replace(/[^\w]/g, '');
        // console.log("Loading GIF for title:", sanitizedTitle);  // Log the title before calling getImage
        return getGIF(sanitizedTitle).then(result => {
          // console.log("Result for title:", sanitizedTitle, result);  // Log the result
          return { title: title, result };
        }).catch((error) => {
          // console.error("Error for title:", sanitizedTitle, error);  // Log any errors
          return { title: sanitizedTitle, result: undefined };
        });
      })
    );

    Promise.all(gifPromises)
      .then((results) => {
        const gifMap: { [key: string]: string } = {};
        results.forEach(({ title, result }) => {
          if (result) {
            gifMap[title] = result;
          }
        });
        setGifs(gifMap);
        // console.log("GIFs loaded:", gifMap);
      })
      .catch((error) => {
        console.error("Error loading GIFs:", error);
      });

    getImage("Logo").then(result => {
      if (typeof result === "string") {
        setImg_default(result);
      } else {
        console.error("Error: getImage did not return a string");
      }
    }).catch((error) => {
      console.error("Error loading default image:", error);
    });

  }, [chapters]);

  useEffect(() => {
    if (hoveredElement && gifs[hoveredElement]) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [hoveredElement]);

  return (
    <div className="border">
      <div className="chapter">
        <h1>Table Of Contents</h1>
        <div className="table-of-contents">
          <div className='text-column'>
            {sections.map((section) => (
              <div className='section' key={section.section_title}>
                <a 
                  href={`#${section.section_title == "Introduction" ? "What this blog post is about" : section.section_title}`} 
                  style={{ textDecoration: 'none', color: 'black' }}>
                  <h4>{section.section_title}</h4>
                </a>
                <ul>

                  {section.chapter_titles.map((chapter_title: string) => (
                    <li 
                      key={chapter_title}
                      onMouseEnter={() => {
                        // console.log(chapter_title);
                        setHoveredElement(chapter_title);
                      }}
                      onMouseLeave={() => {
                        setHoveredElement(null);
                      }}
                    >
                      <a href={`#${chapter_title}`} style={{ textDecoration: 'none', color: '#3a0b97', fontSize: "0.8em"}}>
                        {chapter_title}
                      </a>
                    </li>
                  ))}

                </ul>
              </div>
            ))}
          </div>
            <div className="gif-container">
              {hoveredElement && gifs[hoveredElement] && (
                <>
                  {/* {console.log("Loading GIF for:", hoveredElement, "Path:", gifs[hoveredElement])} */}
                  <img 
                    src={gifs[hoveredElement]}
                    alt={hoveredElement ? `GIF for ${hoveredElement}` : "Loading GIF"} 
                    className={`gif ${visible ? 'fade-in' : 'fade-out'}`}
                  />
                </>
              )}
              { (!hoveredElement || !gifs[hoveredElement]) && (
                <img
                  src={img_default}
                  className={`default-image ${!visible ? 'fade-in' : 'fade-out'}`} /* Added default-image class */
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;