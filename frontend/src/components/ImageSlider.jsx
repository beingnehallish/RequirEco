import React, { useEffect, useRef } from 'react';
import '../styles/SliderStyle.css';
import P1 from '../assets/home/P1.png';
import P2 from '../assets/home/P2.png';
import P3 from '../assets/home/P3.png';
import P4 from '../assets/home/P4.png';

function ImageSlider() {
  const images = [P1, P2, P3, P4];
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const nextBtn = document.getElementById('next_btn');
    const prevBtn = document.getElementById('prev_btn');

    const nextSlide = () => {
      if (slider && slider.firstElementChild) {
        slider.appendChild(slider.firstElementChild);
      }
    };

    const prevSlide = () => {
      if (slider && slider.lastElementChild) {
        slider.prepend(slider.lastElementChild);
      }
    };

    const startAutoSlide = () => {
      intervalRef.current = setInterval(nextSlide, 3000);
    };

    const stopAutoSlide = () => {
      clearInterval(intervalRef.current);
    };

    nextBtn?.addEventListener('click', nextSlide);
    prevBtn?.addEventListener('click', prevSlide);
    slider?.addEventListener('mouseenter', stopAutoSlide);
    slider?.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();

    return () => {
      stopAutoSlide();
      nextBtn?.removeEventListener('click', nextSlide);
      prevBtn?.removeEventListener('click', prevSlide);
      slider?.removeEventListener('mouseenter', stopAutoSlide);
      slider?.removeEventListener('mouseleave', startAutoSlide);
    };
  }, []);

  return (
    <div className="container">
      <header className="section-header">
        <div className="header-text">
          <h3>Explore Eco Themes</h3>
          <h1>Top Sustainable Picks</h1>
          <h1>トップサステナブル製品</h1>
        </div>
        <div className="navigation-btns">
          <i className="fas fa-arrow-left" id="prev_btn"></i>
          <i className="fas fa-arrow-right" id="next_btn"></i>
        </div>
      </header>

      <div className="slider" ref={sliderRef}>
        {images.map((imgSrc, index) => (
          <div className="slider-item" key={index}>
            <img src={imgSrc} alt={`eco product ${index + 1}`} />
            <div className="overlay">
              <button className="btn explore-now-btn">Explore Now</button>
              <div className="destination-desc">
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;
