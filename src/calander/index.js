import React, { useState, useEffect } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import axios from "axios";
import { isSameDay, locale, format } from 'date-fns';


const CalenderRange = () => {
    const [products, setProducts] = useState([]);
    const [allProductData, setAllProductData] = useState([]);
    const [customRangeActive, setCustomRangeActive] = useState(false);
    const [disabledDate,setDisabedDate]=useState(false)
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'today' // Default key to 'today'
        }
    ]);
    const [dateMinMax, setDateMinMax] = useState({
        lowestDate: null,
        greatestDate: null,
    })
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get("https://6631e05ac51e14d69562a9ac.mockapi.io/products")
            .then((res) => {
                setProducts(res.data);
                setAllProductData(res.data);
                const timestamps = res.data.map(product => new Date(product.createdAt).getTime());
                const lowestDate = new Date(Math.min(...timestamps));
                const greatestDate = new Date(Math.max(...timestamps));
                setDateMinMax({ lowestDate, greatestDate });
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    };

    const handleDateRangeChange = (ranges) => {
        const selectedRange = ranges[date[0].key];
        setDate([selectedRange]);

        if (selectedRange.key === 'custom') {
            const { startDate, endDate } = selectedRange;
            if (startDate == null && endDate == null) {
                setCustomRangeActive(true);
            }
            else {
                setCustomRangeActive(false);
            }
            if (startDate && endDate) {
                filterProducts(startDate, endDate);
            }
        } else {
            setCustomRangeActive(false);
            filterProducts(selectedRange.startDate, selectedRange.endDate);

        }
    };

// filter Data 
    const filterProducts = (startDate, endDate) => {
        const filteredProducts = allProductData.filter(product => {
            const createdAt = new Date(product.createdAt);
            return createdAt >= startDate && createdAt <= endDate;
        });
        setProducts(filteredProducts);
    };

    const staticRanges = [{
        label: 'Today',
        range: () => {
            const startDate = new Date();
            const endDate = new Date();
            return { startDate, endDate, key: 'today' };
        },
        isSelected: (range) => isSameDay(range.startDate, new Date()) && isSameDay(range.endDate, new Date()) && range.key == "today"
    },
    {
        label: 'Yesterday',
        range: () => {
            const endDate = new Date();
            endDate.setDate(endDate.getDate() - 1);
            const startDate = new Date(endDate);
            return { startDate, endDate, key: 'yesterday' };
        },
        isSelected: (range) => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return isSameDay(range.startDate, yesterday) && isSameDay(range.endDate, yesterday) && range.key == "yesterday";
        }
    },
    {
        label: 'Last 7 days',
        range: () => {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 6); // Subtract 6 days from endDate
            return { startDate, endDate, key: 'last7Days' };
        },
        isSelected: (range) => {
            const today = new Date();
            const last7Days = new Date(today.setDate(today.getDate() - 6));
            return isSameDay(range.startDate, last7Days) && isSameDay(range.endDate, new Date()) && range.key == "last7Days";
        }
    },
    {
        label: 'Last 30 days',
        range: () => {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 29); // Subtract 29 days from endDate
            return { startDate, endDate, key: 'last30Days' };
        },
        isSelected: (range) => {
            const today = new Date();
            const last30Days = new Date(today.setDate(today.getDate() - 29));
            return isSameDay(range.startDate, last30Days) && isSameDay(range.endDate, new Date()) && range.key == "last30Days";
        }
    },
    {
        label: 'Last 12 months',
        range: () => {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setFullYear(startDate.getFullYear() - 1); // Subtract 1 year from endDate
            return { startDate, endDate, key: 'last12Months' };
        },
        isSelected: (range) => {
            const today = new Date();
            const last12Months = new Date();
            last12Months.setFullYear(last12Months.getFullYear() - 1);
            return isSameDay(range.startDate, last12Months) && isSameDay(range.endDate, new Date()) && range.key == "last12Months";
        }
    },
    {
        label: 'All time',
        range: () => {
            const startDate = dateMinMax.lowestDate;
            const endDate = new Date();
            return { startDate, endDate, key: 'allTime' };
        },
        isSelected: (range) => isSameDay(range.startDate, dateMinMax.lowestDate) && isSameDay(range.endDate, new Date()) && range.key === "allTime"
    },

    // Custom Range
    {
        label: 'Custom range',
        range: () => ({ startDate: null, endDate: null, key: 'custom' }),
        isSelected: (range) => {
            return range.key === "custom" && (range.startDate !== null || range.endDate !== null);
        },
        className: customRangeActive && (date[0].startDate !== null || date[0].endDate !== null) ? 'isActiveDate' : ''
    }];



    // Define the isDayDisabled function
    function isDayDisabled(day) {
        if(date[0].key!=="custom"){
            setDisabedDate(true)
            return day.getDay() !== 0 && day.getDay() !== 6;
        }
        else{
            setDisabedDate(false)
            return day.getDay() === 0 || day.getDay() === 6;
        }
    }

    return (
        <div className='container'>
            <DateRangePicker
                className="hide-input-range calander_wrapper"
                ranges={date}
                onChange={handleDateRangeChange}
                staticRanges={staticRanges}
                moveRangeOnFirstSelection={true}
                retainEndDateOnFirstSelection={false}
                startDatePlaceholder={"Start date"}
                showMonthAndYearPickers={false}
                rangeColors={["#D0D5DD"]}
                endDatePlaceholder={"End date"}
                showSelectionPreview={true}
                weekStartsOn={1}
                weekdayDisplayFormat="EEEEEE"
                disabled={true}
                
                disabledDay={isDayDisabled}
            />


            <div>
                <table border={1}>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((ele) => {
                                let date = new Date(ele["createdAt"]);
                                return (
                                    <tr key={ele["id"]}>
                                        <td>{ele["id"]}</td>
                                        <td>{ele["name"]}</td>
                                        <td>{date.toLocaleDateString()}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CalenderRange;
