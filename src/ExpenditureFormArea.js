import { useRef, useState, useEffect, useCallback } from "react";
import autosize from "autosize";
import moment from "moment";
import { useListener, useDispatch } from "./effects/use-event";
import { Events } from "./constants/Events";

function ExpenditureFormArea({ monthValue }) {
  const monthName = moment(monthValue, "YYYY-MM").format("MMM, YYYY");

  const nextMonth = moment(monthValue, "YYYY-MM")
    .add(1, "months")
    .format("MMMM, YYYY");

  const textareaRef = useRef("");
  const reasonTextAreaRef = useRef("");
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [nextMonthCF, setNextMonthCF] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const dispatcher = useDispatch();

  const currDate = moment().format("D-M-YYYY");
  const [inputList, setInputList] = useState([
    {
      expenseName: "",
      vrNo: "",
      expenseDate: currDate,
      expenseAmount: 0,
      expenseReason: "",
      createdAt: monthValue,
      id: null,
    },
  ]);

  const handleAddClick = (e) => {
    e.preventDefault();
    setInputList([
      ...inputList,
      {
        expenseName: "",
        vrNo: "",
        expenseDate: currDate,
        expenseAmount: 0,
        expenseReason: "",
        createdAt: monthValue,
        id: null,
      },
    ]);
  };

  useEffect(() => {
    // setExpenseTotal(0);
    // inputList.map((x) => {
    //   setExpenseTotal((total) => total + parseFloat(x.expenseAmount));
    // });
    const total = inputList.reduce(
      (sum, x) => sum + (x.expenseAmount ? parseFloat(x.expenseAmount) : 0),
      0
    );
    setExpenseTotal(total);
  }, [inputList]);

  useListener(
    Events.TOTAL_UPDATED,
    useCallback((total) => {
      setIncomeTotal(0);
      setIncomeTotal((prevTotal) => {
        return prevTotal + parseFloat(total);
      });
    })
  );

  useEffect(() => {
    setNextMonthCF(0);
    setNextMonthCF(parseFloat(incomeTotal) - parseFloat(expenseTotal));
  }, [expenseTotal, incomeTotal]);

  useEffect(() => {
    // textareaRef.current.style.height = "4px";
    // const scrollHeight = textareaRef.current.scrollHeight;
    // textareaRef.current.style.height = scrollHeight + "px";
    const ta = textareaRef.current;
    const ta1 = reasonTextAreaRef.current;
    autosize(ta);
    autosize(ta1);
  }, [inputList]);

  const handleInputChange = (e, index) => {
    e.preventDefault();
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleRemoveClick = (index) => {
    const list = [...inputList];
    if (list[index].id != null) {
      dispatcher(Events.EXPENSE_ID, list[index].id);
    }
    list.splice(index, 1);
    setInputList(list);
  };

  return (
    <div className="expenditure-table">
      <h1 className="header">Expenditure - {monthName}</h1>
      <div className="btn-box">
        <button className="btn" onClick={handleAddClick}>
          Add Row
        </button>
      </div>
      <div>
        <span className="column-heading expName">Expense Name</span>
        <span className="column-heading vrNo">VR No.</span>
        <span className="column-heading expDate">Date</span>
        <span className="column-heading expAmount">Amount</span>
        <span className="column-heading expReason">Purpose</span>
      </div>
      <div>
        {inputList.map((x, i) => {
          return (
            <div key={i}>
              <textarea
                className="text-area-field exp-name"
                ref={textareaRef}
                name="expenseName"
                onChange={(e) => handleInputChange(e, i)}
                placeholder="Expense Name"
                value={x.expenseName}
              />
              <input
                type="number"
                className="text-area-field textarea-no-fields "
                name="vrNo"
                onChange={(e) => handleInputChange(e, i)}
                placeholder="VR No."
                value={x.vrNo}
              />

              <input
                type="text"
                className="text-area-field textarea-no-fields"
                name="Date"
                onChange={(e) => handleInputChange(e, i)}
                placeholder="Date"
                value={x.expenseDate}
              />

              <input
                type="text"
                className="text-area-field textarea-no-fields"
                name="expenseAmount"
                onChange={(e) => handleInputChange(e, i)}
                placeholder="Amount"
                value={x.expenseAmount}
              />
              <textarea
                ref={reasonTextAreaRef}
                className="text-area-field exp-reason"
                name="expenseReason"
                onChange={(e) => handleInputChange(e, i)}
                placeholder="Purpose"
                value={x.expenseReason}
              />

              {inputList.length !== 1 ? (
                <i
                  className="fa-solid fa-trash btn-delete"
                  onClick={() => handleRemoveClick(i)}
                ></i>
              ) : null}
            </div>
          );
        })}
        <div>
          <label
            htmlFor="expenseTotal"
            className="column-heading expense-total-label"
          >
            Total:{" "}
          </label>
          <input
            type="number"
            className="input-fields no-fields expense-total"
            name="expenseTotal"
            value={expenseTotal}
            readOnly
          />
        </div>
        <div>
          <label
            htmlFor="nextMonthCF"
            className="column-heading next-month-cf-label"
          >
            {nextMonth} C/F:{" "}
          </label>
          <input
            type="number"
            className="input-fields no-fields next-month-cf"
            name="nextMonthCF"
            value={nextMonthCF}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

export default ExpenditureFormArea;
