import React from "react";
import * as d3 from "d3";
import { lookupService } from "dns";
import { mean, min, range } from "lodash";
import { ChartLayout } from "./StackedBar";
import * as _ from "lodash";

export type Bollinger = {
    date: Date;
    ma: number;
    lower: number;
    upper: number;
}

export type StockDataPoint = {
    currency: string;
    dataSeries: any;
    symbol: string;
    timestamp: Date;
    type: string;
}

export type DateClose = {
    date: Date;
    close: number;
}

export interface IFinanceChartProps {
    elements: StockDataPoint[];
    labels: any;
    positions: number[];
    dates: string[];
    layout: ChartLayout;
}

export class FinanceChart extends React.Component<IFinanceChartProps> {
    public render() {
        return <div>
            <svg id="finance-chart"></svg>
        </div>;
    }


    private readonly draw = (): void => {
        let savedData: any;
        const closeData: DateClose[] = this.props.dates.map((d, i) => {
            const close: DateClose = {
                date: new Date(d),
                close: +this.props.elements[0].dataSeries.close.values[i]
            };
            return close;
        });
        savedData = closeData;
        const bollingerData = this.getBollinger(closeData, 50, 2);
        const xScale = d3.scaleLinear().range([0, this.props.layout.width]);
        const xAxis = d3.axisBottom(xScale).tickSizeInner(-this.props.layout.height).tickFormat(d3.timeFormat("%B"));
        const yScale = d3.scaleLinear().range([this.props.layout.height, 0]);
        const yAxis = d3.axisLeft(yScale).tickSizeInner(-this.props.layout.width);
        const chartLine = (field: string) => d3.line<Bollinger | DateClose>()
            .x(d => xScale(d.date))
            .y(d => yScale(d[field]));
        const bandsArea = d3.area<Bollinger>()
            .x(d => xScale(d.date))
            .y0(d => yScale(d.lower))
            .y1(d => yScale(d.upper));

        // update
        xScale.domain([closeData[0].date, closeData[closeData.length - 1].date]);
        const min2 = Math.min(+d3.min(bollingerData, d => d.lower), +d3.min(closeData, d => d.close));
        const max2 = Math.max(+d3.max(bollingerData, d => d.upper), +d3.max(closeData, d => d.close));

        d3.select(".area")
            .datum(bollingerData)
            .transition()
            .attr("d", bandsArea);
    }

    private readonly getBollinger = (data: DateClose[], n: number = 20, k: number = 2): Bollinger[] => {
        return range(0, data.length - n).map(start => {
            const end = start + n - 1;
            const period = data.slice(start, end);
            const ma = mean( period.map(d => d.close));
            const stdDev = Math.sqrt(+mean(period.map(d => (d.close - ma) ** 2)));
            const rollinger: Bollinger = {
                date: data[end].date,
                ma: ma,
                lower: ma - k * stdDev,
                upper: ma + k * stdDev
            };
            return rollinger;
        });
    }
}