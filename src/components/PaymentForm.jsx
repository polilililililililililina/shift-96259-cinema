import './PaymentForm.css';
import { useState } from 'react';
import { payForTickets } from '../api/cinemaApi.js';

const emptyPerson = {
  firstname: '',
  lastname: '',
  middlename: '',
  phone: '',
};

const emptyCard = {
  pan: '',
  expireDate: '',
  cvv: '',
};

function PaymentForm({
  filmId,
  filmName,
  selectedSeance,
  selectedSeats,
  onBack,
  onSuccess,
}) {
  const [person, setPerson] = useState(emptyPerson);
  const [debitCard, setDebitCard] = useState(emptyCard);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handlePersonChange(event) {
    const { name, value } = event.target;
    setPerson((prev) => ({ ...prev, [name]: value }));
  }

  function handleCardChange(event) {
    const { name, value } = event.target;
    setDebitCard((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await payForTickets({
        filmId,
        person,
        debitCard,
        seance: {
          date: selectedSeance.date,
          time: selectedSeance.time,
        },
        tickets: selectedSeats,
      });
      onSuccess();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="payment-form">
      <h2 className="payment-form__title">Оплата</h2>
      <p className="payment-form__film">{filmName}</p>
      <p className="payment-form__seance">
        {selectedSeance.date}, {selectedSeance.time} · Зал {selectedSeance.hall.name}
      </p>
      <p className="payment-form__seats">
        Места:{' '}
        {selectedSeats
          .map((seat) => `ряд ${seat.row + 1}, место ${seat.column + 1}`)
          .join('; ')}
      </p>

      <form onSubmit={handleSubmit}>
        <fieldset className="payment-form__fieldset">
          <legend>Данные покупателя</legend>

          <label className="payment-form__label">
            Имя
            <input
              name="firstname"
              value={person.firstname}
              onChange={handlePersonChange}
              required
            />
          </label>

          <label className="payment-form__label">
            Фамилия
            <input
              name="lastname"
              value={person.lastname}
              onChange={handlePersonChange}
              required
            />
          </label>

          <label className="payment-form__label">
            Отчество
            <input
              name="middlename"
              value={person.middlename}
              onChange={handlePersonChange}
              required
            />
          </label>

          <label className="payment-form__label">
            Телефон
            <input
              name="phone"
              value={person.phone}
              onChange={handlePersonChange}
              placeholder="89990009999"
              required
            />
          </label>
        </fieldset>

        <fieldset className="payment-form__fieldset">
          <legend>Банковская карта</legend>

          <label className="payment-form__label">
            Номер карты
            <input
              name="pan"
              value={debitCard.pan}
              onChange={handleCardChange}
              placeholder="1111 1111"
              required
            />
          </label>

          <label className="payment-form__label">
            Срок действия
            <input
              name="expireDate"
              value={debitCard.expireDate}
              onChange={handleCardChange}
              placeholder="11/11"
              required
            />
          </label>

          <label className="payment-form__label">
            CVV
            <input
              name="cvv"
              value={debitCard.cvv}
              onChange={handleCardChange}
              placeholder="111"
              required
            />
          </label>
        </fieldset>

        {errorMessage && (
          <p className="status-message status-message--error">{errorMessage}</p>
        )}

        <div className="step-actions">
          <button type="button" className="button" onClick={onBack}>
            Назад
          </button>
          <button
            type="submit"
            className="button button--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Оплата...' : 'Оплатить'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PaymentForm;
