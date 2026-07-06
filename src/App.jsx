import { useState } from 'react';
import PosterPage from './pages/PosterPage.jsx';
import FilmModal from './components/FilmModal.jsx';

const MODAL_STEPS = {
  DETAILS: 'details',
  SCHEDULE: 'schedule',
  SEATS: 'seats',
  PAYMENT: 'payment',
};

function App() {
  const [selectedFilmId, setSelectedFilmId] = useState(null);
  const [modalStep, setModalStep] = useState(MODAL_STEPS.DETAILS);

  const [selectedSeance, setSelectedSeance] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  function resetBooking() {
    setModalStep(MODAL_STEPS.DETAILS);
    setSelectedSeance(null);
    setSelectedSeats([]);
  }

  function handleOpenFilm(filmId) {
    setSelectedFilmId(filmId);
    resetBooking();
  }

  function handleCloseModal() {
    setSelectedFilmId(null);
    resetBooking();
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Онлайн-кинотеатр</h1>
      </header>

      <main className="app__main">
        <PosterPage onFilmClick={handleOpenFilm} />
      </main>

      {selectedFilmId && (
        <FilmModal
          filmId={selectedFilmId}
          step={modalStep}
          onStepChange={setModalStep}
          selectedSeance={selectedSeance}
          onSeanceChange={setSelectedSeance}
          selectedSeats={selectedSeats}
          onSeatsChange={setSelectedSeats}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
