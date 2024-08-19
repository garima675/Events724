import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";
import "./style.scss";

const Slider = () => {
  // Retrieve data from context
  const { data } = useData();
  // Initialize state to keep track of the current slide index
  const [index, setIndex] = useState(0);

  // Safely sort events in ascending order by date (oldest to most recent)
  const byDateAsc = [...(data?.focus || [])].sort((evtA, evtB) =>
    new Date(evtA.date) > new Date(evtB.date) ? 1 : -1
  );

  const dataLength = byDateAsc.length;
 // Function to move to the next slide
  const nextCard = () => {
    // Update the index to the next slide or loop back to the start if at the end
    setIndex((prevIndex) => (prevIndex < dataLength - 1 ? prevIndex + 1 : 0));
  };

  useEffect(() => {
    // Automatically move to the next slide every 5 seconds
    const timeout = setTimeout(nextCard, 5000);
    // Clear timeout when component unmounts or index changes
    return () => clearTimeout(timeout);
  }, [index, dataLength]);

  return (
    <div className="SlideCardList">
      {/* Mapping through the sorted events to create individual slide cards */}
      {byDateAsc.map((event, idx) => (
        <div key={`${event.title}-${idx}`} className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}>
          <img src={event.cover} alt={event.title} />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
           {/* Mapping through the sorted events to create radio buttons for pagination */}
          {byDateAsc.map((event, radioIdx) => (
            <input
              key={`${event.title}-${radioIdx}`} // Unique key for each radio button
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              readOnly // Radio buttons are for display purposes only; no user interaction
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
