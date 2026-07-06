import './SchedulePicker.css';
import { useEffect, useState } from 'react';
import { getFilmSchedule } from '../api/cinemaApi.js';

function SchedulePicker({
  filmId,
  selectedSeance,
  onSeanceSelect,
  onBack,
  onContinue,
}) {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCancelled = false;

    async function loadSchedule() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await getFilmSchedule(filmId);

        if (!isCancelled) {
          setSchedules(response.schedules);
          setSelectedSchedule(response.schedules[0]);
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error.message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSchedule();

    return () => {
      isCancelled = true;
    };
  }, [filmId]);

  function handleSeanceClick(seance) {
    onSeanceSelect({
      date: selectedSchedule.date,
      time: seance.time,
      hall: seance.hall,
    });
  }

  function isSeanceSelected(seance) {
    return (
      selectedSeance?.time === seance.time &&
      selectedSeance?.hall?.name === seance.hall.name
    );
  }

  if (isLoading) {
    return <p className="status-message">Загрузка расписания...</p>;
  }

  if (errorMessage) {
    return <p className="status-message status-message--error">{errorMessage}</p>;
  }

  if (!selectedSchedule?.seances?.length) {
    return <p className="status-message">Сеансов нет</p>;
  }

  return (
      <div className="schedule-picker">
        <h2 className="schedule-picker__title">Расписание</h2>

        <div className="schedule-picker__dates">
          {schedules.map((schedule) => (
              <button
                  key={schedule.date}
                  type="button"
                  className={
                    selectedSchedule?.date === schedule.date
                        ? 'schedule-picker__date-button schedule-picker__date-button--active'
                        : 'schedule-picker__date-button'
                  }
                  onClick={() => {
                    setSelectedSchedule(schedule);
                    onSeanceSelect(null);
                  }}
              >
                {schedule.date}
              </button>
          ))}
        </div>

        <p className="schedule-picker__date">
          Дата: {selectedSchedule.date}
        </p>

      <ul className="schedule-picker__list">
        {selectedSchedule.seances.map((seance) => (
          <li key={`${seance.time}-${seance.hall.name}`}>
            <button
              type="button"
              className={`schedule-picker__item ${isSeanceSelected(seance) ? 'schedule-picker__item--selected' : ''}`}
              onClick={() => handleSeanceClick(seance)}
            >
              <span>{seance.time}</span>
              <span>Зал: {seance.hall.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="step-actions">
        <button type="button" className="button" onClick={onBack}>
          Назад
        </button>
        <button
          type="button"
          className="button button--primary"
          onClick={onContinue}
          disabled={!selectedSeance}
        >
          Выбрать места
        </button>
      </div>
    </div>
  );
}


export default SchedulePicker;