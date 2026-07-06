import './FilmModal.css';
import { useEffect, useState } from 'react';
import { getFilm } from '../api/cinemaApi.js';
import FilmDetails from './FilmDetails.jsx';
import SchedulePicker from './SchedulePicker.jsx';
import SeatPicker from './SeatPicker.jsx';
import PaymentForm from './PaymentForm.jsx';

function FilmModal({
  filmId,
  step,
  onStepChange,
  selectedSeance,
  onSeanceChange,
  selectedSeats,
  onSeatsChange,
  onClose,
}) {
  const [film, setFilm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCancelled = false;

    async function loadFilm() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await getFilm(filmId);
        if (!isCancelled) {
          setFilm(response.film);
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

    loadFilm();

    return () => {
      isCancelled = true;
    };
  }, [filmId]);

  function handlePaymentSuccess() {
    onClose();
    alert('Билеты успешно оплачены!');
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal__close" onClick={onClose}>
          ✕
        </button>

        {isLoading && <p className="status-message">Загрузка фильма...</p>}

        {errorMessage && (
          <p className="status-message status-message--error">{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && film && (
          <>
            {step === 'details' && (
              <FilmDetails
                film={film}
                onContinue={() => onStepChange('schedule')}
              />
            )}

            {step === 'schedule' && (
              <SchedulePicker
                filmId={filmId}
                selectedSeance={selectedSeance}
                onSeanceSelect={onSeanceChange}
                onBack={() => onStepChange('details')}
                onContinue={() => onStepChange('seats')}
              />
            )}

            {step === 'seats' && selectedSeance && (
              <SeatPicker
                hall={selectedSeance.hall}
                selectedSeats={selectedSeats}
                onSeatsChange={onSeatsChange}
                onBack={() => onStepChange('schedule')}
                onContinue={() => onStepChange('payment')}
              />
            )}

            {step === 'payment' && selectedSeance && (
              <PaymentForm
                filmId={filmId}
                filmName={film.name}
                selectedSeance={selectedSeance}
                selectedSeats={selectedSeats}
                onBack={() => onStepChange('seats')}
                onSuccess={handlePaymentSuccess}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FilmModal;
