import { useEffect, useState } from "react";
import { get, post } from "./apis";
import "./App.css";
import ShiftCard from "./components/ShiftCard/ShiftCard";

function App() {
  const [shifts, setShifts] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [overlapInfo, setOverlapInfo] = useState();

  useEffect(() => {
    get("shifts").then((res) => {
      if (res?.shifts) {
        setShifts(res.shifts);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedShifts.length < 2) {
      setOverlapInfo();
    }
  }, [selectedShifts]);

  const compareShifts = () => {
    if (selectedShifts.length === 2) {
      const shiftA = shifts.find(
        (shift) => shift.shift_id === selectedShifts[0]
      );
      const shiftB = shifts.find(
        (shift) => shift.shift_id === selectedShifts[1]
      );
      post("shifts/overlap", {
        shiftA: {
          ...shiftA,
          shift_date: shiftA.shift_date.split("T")[0],
        },
        shiftB: {
          ...shiftB,
          shift_date: shiftB.shift_date.split("T")[0],
        },
      }).then((res) => {
        setOverlapInfo(res);
      });
    } else {
      setOverlapInfo();
    }
  };

  const handleSelect = (shiftId) => {
    if (selectedShifts.includes(shiftId)) {
      const newIds = [...selectedShifts];
      newIds.splice(newIds.indexOf(shiftId), 1);
      setSelectedShifts(newIds);
    } else if (selectedShifts.length < 2 && !selectedShifts.includes(shiftId)) {
      setSelectedShifts([...selectedShifts, shiftId]);
    }
  };

  const handleQuery = (query) => {
    get(`queries/${query}`).then((res) => {
      console.log(res);
    });
  };

  return (
    <div className="App">
      <div className="OverlapContainer">
        <div className="OverlapInfoSection">
          <span>Overlap Minutes: {overlapInfo?.overlap_minutes}</span>
          <span>Max Overlap Threshold: {overlapInfo?.maximum_overlap}</span>
          <span>
            Exceeds Overlap Threshold:{" "}
            {overlapInfo?.exceeds_overlap?.toString()}
          </span>
        </div>
        <button
          className="SubmitBtn"
          disabled={selectedShifts.length < 2}
          onClick={compareShifts}
        >
          Submit
        </button>
      </div>
      <div className="ShiftsContainer">
        {shifts.map((shift) => (
          <ShiftCard
            selected={selectedShifts.includes(shift.shift_id)}
            shift={shift}
            key={shift.shift_id}
            onClick={handleSelect}
          ></ShiftCard>
        ))}
      </div>
      <div className="QueryButtonsContainer">
        <button className="QueryBtn" onClick={() => handleQuery("q4")}>
          Execute Q4 Query
        </button>
        <button className="QueryBtn" onClick={() => handleQuery("q5")}>
          Execute Q5 Query
        </button>
        <button className="QueryBtn" onClick={() => handleQuery("q6/Anne")}>
          Execute Q6 Query
        </button>
      </div>
    </div>
  );
}

export default App;
