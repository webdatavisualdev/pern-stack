import style from "./style.module.css";

const ShiftCard = ({
  shift: { facility_name, shift_date, start_time, end_time, shift_id },
  onClick,
  selected,
}) => (
  <div
    className={`${style.ShiftCardContainer} ${selected ? style.selected : ""}`}
    onClick={() => onClick(shift_id)}
  >
    <span>{facility_name}</span>
    <span>{shift_date.split("T")[0]}</span>
    <span>
      {new Date(`0000-01-01T${start_time}`).toLocaleTimeString()} -{" "}
      {new Date(`0000-01-01T${end_time}`).toLocaleTimeString()}
    </span>
  </div>
);

export default ShiftCard;
