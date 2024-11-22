import './DateNavigator.css';
import React from 'react';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { sk } from 'date-fns/locale';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const DateNavigator = ({ selectedDate, onDateChange }) => {
  const handlePreviousDay = () => {
    const currentDate = parseISO(selectedDate);
    const newDate = format(subDays(currentDate, 1), 'yyyy-MM-dd');
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const currentDate = parseISO(selectedDate);
    const newDate = format(addDays(currentDate, 1), 'yyyy-MM-dd');
    onDateChange(newDate);
  };

  const getFormattedDateParts = () => {
    const date = parseISO(selectedDate);
    const weekday = format(date, 'EEEEEE', { locale: sk });
    
    return {
      day: format(date, 'd'),
      monthYear: format(date, 'MMMM yyyy', { locale: sk }),
      weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1).toLowerCase()
    };
  };

  const isToday = (date) => {
    const today = new Date();
    return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  };

  const dateParts = getFormattedDateParts();

  return (
    <div className="date-navigator">
      <button 
        className="date-nav-button"
        onClick={handlePreviousDay}
        aria-label="Predchádzajúci deň"
      >
        <FaChevronLeft size={24} />
      </button>
      
      <div className="current-date">
        {isToday(parseISO(selectedDate)) ? (
          <>
            <div className="date-main">
              <span className="today-text">Dnes</span>
            </div>
            <div className="date-month-year">{dateParts.monthYear}</div>
          </>
        ) : (
          <>
            <div className="date-main">
              <span className="date-weekday">{dateParts.weekday} </span>
              <span className="date-number">{dateParts.day}.</span>
            </div>
            <div className="date-month-year">{dateParts.monthYear}</div>
          </>
        )}
      </div>

      <button 
        className="date-nav-button"
        onClick={handleNextDay}
        aria-label="Nasledujúci deň"
      >
        <FaChevronRight size={24} />
      </button>
    </div>
  );
};

export default DateNavigator;