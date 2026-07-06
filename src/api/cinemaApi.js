const BASE_URL = import.meta.env.VITE_API_URL;

export function getImageUrl(path) {
  if (!path) {
    return '';
  }
  if (path.startsWith('http')) {
    return path;
  }
  return `${BASE_URL}${path}`;
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.reason || 'Ошибка запроса');
  }

  return data;
}

export function getFilms() {
  return request('/cinema/films');
}

export function getFilm(filmId) {
  return request(`/cinema/film/${filmId}`);
}

export function getFilmSchedule(filmId) {
  return request(`/cinema/film/${filmId}/schedule`);
}

export function payForTickets(paymentData) {
  return request('/cinema/payment', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
}
