import './App.css';
import { useState } from 'react';


function App() {
  const [index, setIndex] = useState(0);
  const slides = [
    {
      title: 'Your VSCode wrapped of the week!!!',
      content: <img src="./assets/yippee-cat-BdHE4DUt.gif" style={{ width: '20%' }} />,
    },
    {
      title: '🎉 You coded for 7,563 minutes this week!!!',
      content: (
        <>
          <img src="./assets/wereBack-DdOHWLkh.gif" style={{ width: '20%' }} />
          <img src="./assets/touch-grass-Dd6CXdna.gif" style={{ width: '20%' }} />
        </>
      ),
    },
    {
      title: '🎉 You wrote 527 lines in C++!',
      content: (
        <>
          <img src="./assets/noClass.jpg" style={{ width: '30%' }} />
          <img src="./assets/n3_solutions.jpg" style={{ width: '25%' }} />
        </>
      ),
      footer: 'Or chat did',
    },
    {
      title: '😬 4 hours spent on segfaults',
      content: <img src="./assets/segFault.jpg" style={{ width: '20%' }} />,
    },
  ];

  const next = () => setIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="carousel-wrapper">
      <div
        className="slides-container"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div className="slide" key={i}>
            <h1>{slide.title}</h1>
            <img src={`./assets/${slide.content}`} alt={slide.title} />
          </div>
        ))}
      </div>
      <button className="nav-button left" onClick={prev}>←</button>
      <button className="nav-button right" onClick={next}>→</button>
    </div>
  );
}

export default App;
