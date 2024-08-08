import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);


  // Sort events in ascending order by date (oldest to most recent)
  const byDateAsc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) > new Date(evtB.date) ? 1 : -1
  );
  // Function to move to the next slide
  const nextCard = () => {
    // Update index: Loop back to 0 if the end is reached
    setIndex((prevIndex) => 
      prevIndex < byDateAsc.length - 1 ? prevIndex + 1 : 0
    );
  };
  
  
  useEffect(() => {
    // Automatically move to the next slide every 5 seconds
    const timeout = setTimeout(nextCard, 5000);
    
     // Clear timeout when component unmounts or index changes
     return () => clearTimeout(timeout);
    }, [index, byDateAsc?.length]);
  


  
  return (
    <div className="SlideCardList">
      {byDateAsc?.map((event, idx) => (
        <>
          <div
            key={event.title}
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateAsc.map((_, radioIdx) => (
                <input
                  key={`${event.id}`}
                  type="radio"
                  name="radio-button"
                  checked={idx === radioIdx}
                />
              ))}
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default Slider;
