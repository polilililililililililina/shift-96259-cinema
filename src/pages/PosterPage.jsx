import './PosterPage.css';
import { useEffect, useState } from 'react';
import { getFilms } from '../api/cinemaApi.js';
import FilmCard from '../components/FilmCard.jsx';

function PosterPage({ onFilmClick }) {
  const [films, setFilms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCancelled = false;

    async function loadFilms() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await getFilms();
        if (!isCancelled) {
          setFilms(response.films || []);
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

    loadFilms();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoading) {
    return <p className="status-message">Загрузка афиши...</p>;
  }

  if (errorMessage) {
    return <p className="status-message status-message--error">{errorMessage}</p>;
  }

  if (films.length === 0) {
    return <p className="status-message">Фильмов на сегодня нет</p>;
  }

  return (
    <section className="poster-page">
      <h2 className="poster-page__title">Афиша на сегодня</h2>
      <ul className="poster-page__list">
        {films.map((film) => (
          <li key={film.id}>
            <FilmCard film={film} onClick={() => onFilmClick(film.id)} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PosterPage;
