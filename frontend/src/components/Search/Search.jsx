import React, { useState } from 'react'
import './Search.css'
import {
    faCalendarDays,
    faPerson,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { DateRange } from "react-date-range";
  import "react-date-range/dist/styles.css";
  import "react-date-range/dist/theme/default.css";
  import { format } from "date-fns";

const Search = () => {
    const [destination, setDestination] = useState("");
    const [openDate, setOpenDate] = useState(false);
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [openOptions, setOpenOptions] = useState(false);
    const [options, setOptions] = useState({
        adult: 1,
        children: 0,
        room: 1,
    });
    const handleOption = (name, operation) => {
        setOptions((prev) => {
          return {
            ...prev,
            [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
          };
        });
      };

    return (
        <div className="search">
            
            <div className="searchItem">
                <FontAwesomeIcon icon={faCalendarDays} className="searchIcon" />
                <span
                    onClick={() => setOpenDate(!openDate)}
                    className="searchText"
                >{`${format(date[0].startDate, "dd/MM/yyyy")} đến ${format(
                    date[0].endDate,
                    "dd/MM/yyyy"
                )}`}</span>
                {openDate && (
                    <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDate([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={date}
                        className="date"
                        minDate={new Date()}
                    />
                )}
            </div>
            <div className="searchItem">
                <FontAwesomeIcon icon={faPerson} className="searchIcon" />
                <span
                    onClick={() => setOpenOptions(!openOptions)}
                    className="searchText"
                >{`${options.room} phòng`}</span>
                {openOptions && (
                    <div className="options">
                        <div className="optionItem">
                            <span className="optionText">Phòng</span>
                            <div className="optionCounter">
                                <button
                                    disabled={options.room <= 1}
                                    className="optionCounterButton"
                                    onClick={() => handleOption("room", "d")}
                                >
                                    -
                                </button>
                                <span className="optionCounterNumber">
                                    {options.room}
                                </span>
                                <button
                                    className="optionCounterButton"
                                    onClick={() => handleOption("room", "i")}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="searchItem">
                <button className="searchBtn" >
                    Thay đổi tìm kiếm
                </button>
            </div>
        </div>
    )
}

export default Search