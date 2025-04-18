// import yippieCat from './assets/yippee-Cat.gif';
// import wereSoBack from './assets/wereBack.gif';
// import touchGrass from './assets/touch-grass.gif';
// import cppShredded from './assets/shreddedHead.jpg';
// import cppClasses from './assets/noClass.jpg';
// import n3Solutions from './assets/n3_solutions.jpg';
// import segfaults from './assets/segfault.jpg';
// import lost from './assets/lost_}.gif';
// import devExperience from './assets/devExperienceCat.png';
import './App.css';
import { useState } from 'react';
function App() {
    const [index, setIndex] = useState(0);
    const slides = [
        {
            title: 'Your VSCode wrapped of the week!!!',
            content: <img src="./assets/yippee-cat-BdHE4DUt.gif" style={{ width: '20%' }}/>,
        },
        {
            title: '🎉 You coded for 7,563 minutes this week!!!',
            content: (<>
          <img src="./assets/wereBack-DdOHWLkh.gif" style={{ width: '20%' }}/>
          <img src="./assets/touch-grass-Dd6CXdna.gif" style={{ width: '20%' }}/>
        </>),
        },
        {
            title: '🎉 You wrote 527 lines in C++!',
            content: (<>
          <img src="./assets/noClass.jpg" style={{ width: '30%' }}/>
          <img src="./assets/n3_solutions.jpg" style={{ width: '25%' }}/>
        </>),
            footer: 'Or chat did',
        },
        {
            title: '😬 4 hours spent on segfaults',
            content: <img src="./assets/segFault.jpg" style={{ width: '20%' }}/>,
        },
    ];
    const next = () => setIndex((prev) => (prev + 1) % slides.length);
    const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    return (<div className="carousel-wrapper">
      <div className="slides-container" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((slide, i) => (<div className="slide" key={i}>
            <h1>{slide.title}</h1>
            <img src={`./assets/${slide.content}`} alt={slide.title}/>
          </div>))}
      </div>
      <button className="nav-button left" onClick={prev}>←</button>
      <button className="nav-button right" onClick={next}>→</button>
    </div>);
}
export default App;
//# sourceMappingURL=App.js.map