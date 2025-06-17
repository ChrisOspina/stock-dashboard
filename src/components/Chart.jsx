import React, { useState, useContext, useEffect } from 'react'
import { convertUnixTimestampToDate, convertDateToUnixTimestamp,CreateDate } from '../helpers/data.helper';
import Card from './Card';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartFilter from './ChartFilter';
import { chartConfig } from '../constants/config';
import ThemeContext from '../context/ThemeContext'
import {fetchHistoricalData} from '../api/stock-api';
import StockContext from '../context/stockContext';


const Chart = () => {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState("1W");
    const { darkMode } = useContext(ThemeContext);
    const {stockSymbol} = useContext(StockContext);

    useEffect(()=>{
        const getDateRange= async() => {
            const {days, weeks, months, years} = chartConfig[filter];
            
            const endDate = new Date();
            const startDate = CreateDate(endDate, -days, -weeks, -months, -years);

            const startTimestampUnix = convertDateToUnixTimestamp(startDate);
            const endTimestampUnix = convertDateToUnixTimestamp(endDate);

            return {startTimestampUnix , endTimestampUnix};
        };

        const updateChartData= async() =>{
            try{
                const {startTimestampUnix,endTimestampUnix} = getDateRange();
                const resolution = chartConfig[filter].resolution;
                const result = await fetchHistoricalData(stockSymbol, resolution, startTimestampUnix, endTimestampUnix);

                setData(formatData(result));
            }
            catch(error){
                setData([]);
                console.log(error);
            }
        };
        updateChartData();
    }, [stockSymbol, filter]);

    const formatData = (data) => {
        return data.c.map((item, index) => {
            return {
                value: item.toFixed(2),
                date: convertUnixTimestampToDate(data.t[index]),
            };
        })
    }
    return (
        <Card>
            <ul className='flex absolute top-2 right-2 z-40'>
                {Object.keys(chartConfig).map((item) => (
                    <li key={item}>
                        <ChartFilter
                            text={item}
                            active={filter === item}
                            onClick={() => {
                                setFilter(item);
                            }}
                        />
                    </li>
                ))}
            </ul>
            <ResponsiveContainer>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={darkMode ? "#312e81" : "rgb(199 210 254)"} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={darkMode ? "#312e81" : "rgb(199 210 254)"} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#312e81"
                        fillOpacity={1}
                        strokeWidth={0.5}
                        fill="url(#chartColor)"
                    />
                    <Tooltip
                        contentStyle={darkMode ? { backgroundColor: "#111827" } : null}
                        itemStyle={darkMode ? { color: "#818cf8" } : null}
                    />
                    <XAxis dataKey={"date"} />
                    <YAxis domain={["dataMin", "dataMax"]} />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default Chart
