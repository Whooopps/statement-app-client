import IncomeFormArea from "./IncomeFormArea";
import ExpenditureFormArea from "./ExpenditureFormArea";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { useListener } from "./effects/use-event";
import { Events } from "./constants/Events";
import { useAuthProtected } from "./effects/use-auth";
import { useAxios } from "./effects/use-axios";
import { useDispatch } from "./effects/use-event";
import { useAlert } from "react-alert";

function App() {
  useAuthProtected();
  const fullDate = moment().format("YYYY-MM");
  const [getTable, setGetTable] = useState(false);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [monthValue, setMonthValue] = useState(fullDate);
  const [incomeToDelete, setIncomeToDelete] = useState([]);
  const [expenseToDelete, setExpenseToDelete] = useState([]);
  const [cf, setCF] = useState(0);
  const [nxtCF, setNxtCF] = useState(0);
  const alert = useAlert();
  const axios = useAxios();
  const dispatcher = useDispatch();

  const handelMonthChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setMonthValue(value);
  };

  useEffect(() => {
    async function getTable() {
      try {
        const response = await axios.get(`/api/table/${monthValue}`);
        dispatcher(Events.API_RESPONSE, response);
      } catch (error) {
        console.log(error);
      }
    }
    getTable();
  }, [monthValue, getTable, axios, dispatcher]);

  useListener(
    Events.INCOME_ID,
    useCallback(
      (id) => {
        return setIncomeToDelete((prevArray) => [...incomeToDelete, id]);
      },
      [incomeToDelete]
    )
  );

  useListener(
    Events.EXPENSE_ID,
    useCallback(
      (id) => {
        return setExpenseToDelete((prevArray) => [...expenseToDelete, id]);
      },
      [expenseToDelete]
    )
  );

  useListener(
    Events.EXPENSE_LIST,
    useCallback((list) => {
      return setExpenseList(list);
    }, [])
  );
  useListener(
    Events.INCOME_LIST,
    useCallback((list) => {
      return setIncomeList(list);
    }, [])
  );

  useListener(
    Events.CARRY_FORWARD,
    useCallback((cf) => {
      return setCF(cf);
    }, [])
  );

  useListener(
    Events.NEXT_MONTH_CF,
    useCallback((nxtCF) => {
      return setNxtCF(nxtCF);
    }, [])
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      income: incomeList,
      expense: expenseList,
      cf: {
        cf: cf,
        nextMonthCF: nxtCF,
      },
      createdAt: monthValue,
    };

    try {
      setIncomeToDelete((prev) => []);
      await axios.post("/api/table", payload);
      await axios.delete("/api/table", {
        data: {
          income: incomeToDelete,
          expense: expenseToDelete,
        },
      });
      alert.success("Saved.");
      setGetTable(!getTable);
      setIncomeToDelete((prev) => []);
      setExpenseToDelete((prev) => []);
    } catch (error) {
      console.log(error);
    }
  }

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

      <form onSubmit={handleSubmit}>
        <div className="grid-container">
          <IncomeFormArea monthValue={monthValue} />
          <ExpenditureFormArea monthValue={monthValue} />
        </div>
        <div>
          <button type="submit" className="btn-submit">
            Save
          </button>
        </div>
      </form>
      <div className="btn-download-box">
        <a
          className="btn"
          href={`${process.env.REACT_APP_XLSX_DOWNLOAD_URL}${monthValue}`}
        >
          Download
        </a>
      </div>
    </>
  );
}

export default App;
