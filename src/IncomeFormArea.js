import { useState, useEffect } from "react";
import moment from "moment";
import { useDispatch } from "./effects/use-event";
import { Events } from "./constants/Events";
import { flatNo } from "./autocomplete-values/flatNumbers";
import { NAMES } from "./autocomplete-values/names";

function IncomeFormArea({ monthValue }) {
  const monthName = moment(monthValue, "YYYY-MM").format("MMM, YYYY");
  const currDate = moment().format("D-M-YYYY");
  const [total, setTotal] = useState(0);
  const [carryForward, setCarryForward] = useState(0);
  const [columnData, setColumnData] = useState([
    {
      name: "",
      flat: "",
      amount: 0,
      date: currDate,
      createdAt: monthValue,
      id: null,
    },
  ]);

  const dispatcher = useDispatch();

  useEffect(() => {
    const total = columnData.reduce(
      (sum, x) => sum + (x.amount ? parseFloat(x.amount) : 0),
      carryForward ? parseFloat(carryForward) : 0
    );
    setTotal(total);
  }, [columnData, carryForward]);

  dispatcher(Events.TOTAL_UPDATED, total);

  const handleFocus = (e, index) => {
    const { name } = e.target;
    const list = [...columnData];
    list[index][name] = "";
    setColumnData(list);
  };

  const handleInputChange = (e, index) => {
    e.preventDefault();
    const { name, value } = e.target;
    const list = [...columnData];
    list[index][name] = value;
    setColumnData(list);
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    setColumnData([
      ...columnData,
      {
        name: "",
        flat: "",
        amount: 0,
        date: currDate,
        createdAt: monthValue,
        id: null,
      },
    ]);
  };

  const handleRemoveClick = (index) => {
    const list = [...columnData];
    list.splice(index, 1);
    setColumnData(list);
  };

  return (
    <>
      <div className="income-table">
        <h1 className="header">Income - {monthName}</h1>
        <div className="btn-box">
          <button className="btn" onClick={handleAddClick}>
            Add Row
          </button>
        </div>
        <div>
          <label htmlFor="CF" className="column-heading income-total-label">
            C/F:{" "}
          </label>
          <input
            type="number"
            name="CF"
            id="CF"
            className="input-fields no-fields CF"
            value={carryForward}
            onChange={(e) => setCarryForward(e.target.value)}
          />
        </div>
        <div className="header-container">
          {/* <span className="column-heading number">Number</span> */}
          <span className="column-heading name">Name</span>
          <span className="column-heading flat">Flat</span>
          <span className="column-heading amount">Amount</span>
          <span className="column-heading date">Date</span>
        </div>

        {columnData.map((x, i) => {
          return (
            <div key={i}>
              <input
                className="input-fields"
                type="text"
                name="name"
                id="name"
                list="ownerName"
                placeholder="Name"
                value={x.name}
                onChange={(e) => handleInputChange(e, i)}
                onFocus={(e) => handleFocus(e, i)}
              />

              <input
                className="input-fields no-fields"
                type="number"
                name="flat"
                placeholder="Flat"
                value={x.flat}
                list="flatNo"
                onChange={(e) => handleInputChange(e, i)}
                onFocus={(e) => handleFocus(e, i)}
                required
              />

              <input
                className="input-fields no-fields"
                type="number"
                name="amount"
                placeholder="Amount"
                value={x.amount}
                onChange={(e) => handleInputChange(e, i)}
              />
              <input
                className="input-fields no-fields"
                type="text"
                name="date"
                placeholder="Date"
                value={x.date}
                onChange={(e) => handleInputChange(e, i)}
              />
              {columnData.length !== 1 ? (
                <i
                  className="fa-solid fa-trash btn-delete"
                  onClick={() => handleRemoveClick(i)}
                ></i>
              ) : null}
            </div>
          );
        })}
        <div>
          <label htmlFor="total" className="column-heading income-total-label">
            Total:
          </label>
          <input
            type="number"
            name="total"
            className="input-fields no-fields income-total"
            value={total}
            readOnly
          />
        </div>
        <datalist id="flatNo">
          {flatNo.map((flatNum, i) => {
            return <option value={flatNum} key={i}></option>;
          })}
        </datalist>
        <datalist id="ownerName">
          {NAMES.map((names, i) => {
            return <option value={names} key={i}></option>;
          })}
        </datalist>
      </div>
    </>
  );
}

export default IncomeFormArea;
