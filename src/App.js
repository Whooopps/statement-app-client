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
import { useLocation, useNavigate } from "react-router-dom";
import useQueryParams from "./effects/use-query-params";

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
  const navigate = useNavigate();
  const axios = useAxios();
  const dispatcher = useDispatch();
  const query = useQueryParams();
  const location = useLocation();

  const handelMonthChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setMonthValue(value);
  };

  useEffect(() => {
    async function getTable() {
      try {
        const response = await axios.get(`/table/${monthValue}`);
        dispatcher(Events.API_RESPONSE, response);
      } catch (error) {
        console.log(error);
      }
    }
    getTable();
  }, [monthValue, getTable]);

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

  useListener(
    Events.EXPENSE_LIST,
    useCallback((list) => {
      return setExpenseList(list);
    })
  );
  useListener(
    Events.INCOME_LIST,
    useCallback((list) => {
      return setIncomeList(list);
    })
  );

  useListener(
    Events.CARRY_FORWARD,
    useCallback((cf) => {
      return setCF(cf);
    })
  );

  useListener(
    Events.NEXT_MONTH_CF,
    useCallback((nxtCF) => {
      return setNxtCF(nxtCF);
    })
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
      const response = await axios.post("/table", payload);
      const res = await axios.delete("/table", {
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

  async function handleDownload(e) {
    e.preventDefault();
    const res = await axios.get("/table/xlsx/");
    console.log(res);
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
      <div>
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
