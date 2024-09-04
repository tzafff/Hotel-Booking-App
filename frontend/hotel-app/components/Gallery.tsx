"use client"
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import '../styles/gallery-styles.css';
import LightGallery from 'lightgallery/react';


const Gallery = ({imgURL} : {imgURL: any}) => {

    const containerRef = useRef(null);
    const [galleryContainer, setGalleryContainer] = useState(null);

    const onInit = useCallback((detail) => {
        if (detail) {
            // lightGalleryRef.current = detail.instance;
            detail.instance.openGallery();
        }
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            setGalleryContainer('aaa');
        }
    }, []);
    console.log(containerRef.current);
    return (
        <div className="App">
            <div
                style={{
                    height: '430px',
                }}
                ref={containerRef}
            ></div>
            <div>
                <LightGallery
                    container={containerRef.current}
                    onInit={onInit}
                    closable={false}
                    showMaximizeIcon={false}
                    slideDelay={400}
                    thumbWidth={130}
                    thumbHeight={'100px'}
                    thumbMargin={6}
                    appendSubHtmlTo={'.lg-item'}
                    dynamic={true}
                    dynamicEl={[
                        {
                            src: imgURL,
                        },
                        {
                            src: imgURL,
                        },
                        {
                            src: imgURL,
                        },
                        {
                            src: imgURL,
                        },

                    ]}
                    hash={false}
                    elementClassNames={'inline-gallery-container'}
                ></LightGallery>
            </div>
        </div>
    );
};
export default Gallery
