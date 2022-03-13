import IncomeFormArea from "./IncomeFormArea";
import ExpenditureFormArea from "./ExpenditureFormArea";
import { useState } from "react";
import moment from "moment";

function App() {
  const fullDate = moment().format("YYYY-MM");
  const [monthValue, setMonthValue] = useState(fullDate);
  const handelMonthChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setMonthValue(value);
  };

  const handleSumbit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="month-input-box">
        <label htmlFor="monthInput" className="monthLabel">
          Month:
        </label>
        <input
          type="month"
          name="month"
          id="monthInput"
          className="month-input"
          min={"2022-03"}
          value={monthValue}
          onChange={(e) => {
            handelMonthChange(e);
          }}
        />
      </div>
      <form action="post" onSubmit={handleSumbit}>
        <div className="grid-container">
          <IncomeFormArea monthValue={monthValue} />
          <ExpenditureFormArea monthValue={monthValue} />
        </div>
      </form>
      <div>
        <button type="submit" className="btn-submit">
          Save
        </button>
      </div>
    </>
  );
}

export default App;
