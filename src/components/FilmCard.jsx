import './FilmCard.css';
import { getImageUrl } from '../api/cinemaApi.js';

function FilmCard({ film, onClick }) {
  return (
    <button type="button" className="film-card" onClick={onClick}>
      <img className="film-card__image" src={getImageUrl(film.img)} alt={film.name} />
      <div className="film-card__info">
        <h3 className="film-card__title">{film.name}</h3>
        <p className="film-card__meta">
          {film.genres?.join(', ')} · {film.runtime} мин · {film.ageRating}
        </p>
      </div>
    </button>
  );
}

export default FilmCard;
