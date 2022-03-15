import IncomeFormArea from "./IncomeFormArea";
import ExpenditureFormArea from "./ExpenditureFormArea";
import { useCallback, useState } from "react";
import moment from "moment";
import { useListener } from "./effects/use-event";
import { Events } from "./constants/Events";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { useAuthProtected } from "./effects/use-auth";

function App() {
  useAuthProtected();
  const fullDate = moment().format("YYYY-MM");
  const [monthValue, setMonthValue] = useState(fullDate);
  const [incomeToDelete, setIncomeToDelete] = useState([]);
  const [expenseToDelete, setExpenseToDelete] = useState([]);
  const handelMonthChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setMonthValue(value);
  };

  useListener(
    Events.INCOME_ID,
    useCallback((id) => {
      return setIncomeToDelete((prevArray) => [...incomeToDelete, id]);
    }),
    []
  );

  useListener(
    Events.EXPENSE_ID,
    useCallback((id) => {
      return setExpenseToDelete((prevArray) => [...expenseToDelete, id]);
    }),
    []
  );

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
