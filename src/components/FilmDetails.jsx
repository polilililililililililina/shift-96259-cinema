import './FilmDetails.css';
import { getImageUrl } from '../api/cinemaApi.js';

function FilmDetails({ film, onContinue }) {
  return (
    <div className="film-details">
      <img className="film-details__image" src={getImageUrl(film.img)} alt={film.name} />

      <h2 className="film-details__title">{film.name}</h2>
      <p className="film-details__original">{film.originalName}</p>

      <p className="film-details__meta">
        {film.genres?.join(', ')} · {film.runtime} мин · {film.ageRating}
      </p>

      <p className="film-details__ratings">
        Кинопоиск: {film.userRatings?.kinopoisk} · IMDb: {film.userRatings?.imdb}
      </p>

      <p className="film-details__description">{film.description}</p>

      <div className="film-details__staff">
        <p>
          <strong>Режиссёры:</strong>{' '}
          {film.directors?.map((person) => person.fullName).join(', ')}
        </p>
        <p>
          <strong>Актёры:</strong>{' '}
          {film.actors?.map((person) => person.fullName).join(', ')}
        </p>
      </div>

      <button type="button" className="button button--primary" onClick={onContinue}>
        Выбрать сеанс
      </button>
    </div>
  );
}

export default FilmDetails;
