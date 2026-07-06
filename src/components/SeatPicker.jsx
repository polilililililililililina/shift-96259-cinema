import './SeatPicker.css';
function SeatPicker({ hall, selectedSeats, onSeatsChange, onBack, onContinue }) {
  function isSeatSelected(rowIndex, columnIndex) {
    return selectedSeats.some(
      (seat) => seat.row === rowIndex && seat.column === columnIndex,
    );
  }

  function handleSeatClick(rowIndex, columnIndex, place) {
    if (!place) {
      return;
    }

    const selectedSeat = { row: rowIndex, column: columnIndex };

    if (isSeatSelected(rowIndex, columnIndex)) {
      onSeatsChange(
        selectedSeats.filter(
          (seat) => !(seat.row === rowIndex && seat.column === columnIndex),
        ),
      );
      return;
    }

    onSeatsChange([...selectedSeats, selectedSeat]);
  }

  const totalPrice = selectedSeats.reduce((sum, seat) => {
    const place = hall.places[seat.row]?.[seat.column];
    return sum + (place?.price || 0);
  }, 0);

  return (
    <div className="seat-picker">
      <h2 className="seat-picker__title">Выбор мест</h2>
      <p className="seat-picker__hall">Зал: {hall.name}</p>
      <p className="seat-picker__screen">ЭКРАН</p>

      <div className="seat-picker__grid">
        {hall.places.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-picker__row">
            <span className="seat-picker__row-label">{rowIndex + 1}</span>
            {row.map((place, columnIndex) => {
              if (!place) {
                return (
                  <span
                    key={columnIndex}
                    className="seat-picker__empty"
                  />
                );
              }

              const isSelected = isSeatSelected(rowIndex, columnIndex);

              return (
                <button
                  key={columnIndex}
                  type="button"
                  className={`seat-picker__seat seat-picker__seat--${place.type} ${isSelected ? 'seat-picker__seat--selected' : ''}`}
                  onClick={() => handleSeatClick(rowIndex, columnIndex, place)}
                  title={`${place.type}, ${place.price} ₽`}
                >
                  {columnIndex + 1}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <p className="seat-picker__summary">
        Выбрано мест: {selectedSeats.length}
        {selectedSeats.length > 0 && ` · Итого: ${totalPrice} ₽`}
      </p>

      <div className="step-actions">
        <button type="button" className="button" onClick={onBack}>
          Назад
        </button>
        <button
          type="button"
          className="button button--primary"
          onClick={onContinue}
          disabled={selectedSeats.length === 0}
        >
          Перейти к оплате
        </button>
      </div>
    </div>
  );
}

export default SeatPicker;
