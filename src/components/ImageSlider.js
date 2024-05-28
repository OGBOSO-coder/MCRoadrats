import React, { useState, useEffect } from 'react';
import "./History.css"
import { ArrowBigLeft, ArrowBigRight } from "lucide-react"


const ImageSlider = ({ imageUrls }) => {
    const [imageIndex, setImageIndex] = useState(0)

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <img src={imageUrls[imageIndex]} className="history-img-slider-img" />
            <button className="history-img-slider-button" onClick={() => {
                setImageIndex(index => {
                    if (index === 0) {
                        return imageUrls.length - 1
                    } else {
                        return index - 1
                    }
                })
            }}>
                <ArrowBigLeft />
            </button>
            <button className="history-img-slider-button" onClick={() => {
                setImageIndex(index => {
                    if (index === imageUrls.length - 1) {
                        return 0
                    } else {
                        return index + 1
                    }
                })
            }}>
                <ArrowBigRight />
            </button>
        </div>
    )
}

export default ImageSlider