import React, { useState, useEffect } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import axios from "axios";
import { isSameDay } from 'date-fns';

const CalenderRange = () => {
    const [products, setProducts] = useState([]);
    const [allProductData, setAllProductData] = useState([]);
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'today' // Default key to 'today'
        }
    ]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get("https://6631e05ac51e14d69562a9ac.mockapi.io/products")
            .then((res) => {
                setProducts(res.data);
                setAllProductData(res.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    };

    const handleSelect = (ranges) => {
        const selectedRange = ranges[date[0].key]; 
        setDate([selectedRange]); 
        filterProducts(selectedRange.startDate, selectedRange.endDate);
    };
    

    const filterProducts = (startDate, endDate) => {
        const filteredProducts = allProductData.filter(product => {
            const createdAt = new Date(product.createdAt);
            return createdAt >= startDate && createdAt <= endDate;
        });
        setProducts(filteredProducts);
    };

    const staticRanges = [
        {
            label: 'Today',
            range: () => {
                const startDate = new Date();
                const endDate = new Date();
                return { startDate, endDate, key: 'today' };
            },
            isSelected: (range) => isSameDay(range.startDate, new Date()) && isSameDay(range.endDate, new Date())
            
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
                return isSameDay(range.startDate, yesterday) && isSameDay(range.endDate, yesterday);
            }
        },
        {
            label: 'Last 7 Days',
            range: () => {
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(endDate.getDate() - 6); // Subtract 6 days from endDate
                return { startDate, endDate, key: 'last7Days' };
            },
            isSelected: (range) => {
                const today = new Date();
                const last7Days = new Date(today.setDate(today.getDate() - 6));
                return isSameDay(range.startDate, last7Days) && isSameDay(range.endDate, new Date());
            }
        },
        {
            label: 'Last 30 Days',
            range: () => {
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(endDate.getDate() - 29); // Subtract 29 days from endDate
                return { startDate, endDate, key: 'last30Days' };
            },
            isSelected: (range) => {
                const today = new Date();
                const last30Days = new Date(today.setDate(today.getDate() - 29));
                return isSameDay(range.startDate, last30Days) && isSameDay(range.endDate, new Date());
            }
        },
        {
            label: 'Last 12 Months',
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
                return isSameDay(range.startDate, last12Months) && isSameDay(range.endDate, new Date());
            }
        },
        {
            label: 'All Time',
            range: () => {
                const startDate = new Date(0); // Epoch time
                const endDate = new Date();
                return { startDate, endDate, key: 'allTime' };
            },
            isSelected: (range) => isSameDay(range.startDate, new Date(0)) && isSameDay(range.endDate, new Date())
        },
        // Add your custom range option here if needed
        {
            label: 'Custom Range',
            range: () => ({ startDate: null, endDate: null, key: 'custom' }),
            isSelected: (range) => range.startDate === null && range.endDate === null
        },
    ];
    
    
    return (
        <div className='container'>
            <DateRangePicker
            className="hide-input-range"
                ranges={date}
                onChange={handleSelect}
                minDate={new Date()}
                staticRanges={staticRanges}
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
