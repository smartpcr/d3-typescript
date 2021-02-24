import React from "react";
import * as d3 from "d3";
import { ChartLayout, SeriesData } from "./StackedBar";
import * as _ from "lodash";
import { Series } from "d3";

export type TimeSeriesData = {
    time: string;
    seriesData: SeriesData;
}

export interface IStackedAreaProps {
    data: TimeSeriesData[];
    layout: ChartLayout;
}

export class StackedArea extends React.Component<IStackedAreaProps> {
    public render() {
        return <div>
            <svg id="stacked-area"></svg>
        </div>;
    }

    public componentDidMount() {
        this.draw();
    }

    public componentDidUpdate(nextProps: IStackedAreaProps) {
        if (nextProps.data !== this.props.data) {
            this.handleUpdate();
        }
    }

    private draw = (): void => {
        const parseTime = d3.timeParse("%Y-%m");
        const formatTime = d3.timeFormat("%b %Y");
        const stack = d3.stack<TimeSeriesData>()
            .order(d3.stackOrderDescending)
            .keys(this.getSeriesNames());
        const series = stack(this.props.data);
        const xScale = d3.scaleTime()
            .domain(this.getTimeRange())
            .range([this.props.layout.padding, this.props.layout.width - this.props.layout.padding * 2]);
        const xAxis = d3.axisBottom(xScale).ticks(5);
        const yScale = d3.scaleLinear()
            .domain([0, this.getStackSumMax()])
            .range([this.props.layout.height - 2 * this.props.layout.padding, this.props.layout.padding])
            .nice();
        const yAxis = d3.axisRight(yScale).ticks(5);

        const area = d3.area<TimeSeriesData>()
            .x(d => xScale(parseTime(d.time) ?? new Date("1970/1/")))
            .y0(d => yScale(d.seriesData[0]))
            .y1(d => yScale(d.seriesData[1]));
        const svg = d3.select("stacked-area")
            .attr("width", this.props.layout.width)
            .attr("height", this.props.layout.height);

        svg.selectAll("path")
            .data(series)
            .enter()
            .append("path")
            .attr("class", "area");
    }

    private handleUpdate = (): void => {

    }

    private readonly getSeriesNames = (): string[] => {
        const allKeys = _.flatMap(_.flatMap(this.props.data, d => d.seriesData), s => Object.keys(s));
        return _.uniq(allKeys);
    }

    private readonly getTimeRange = (): [Date, Date] => {
        const parseTime = d3.timeParse("%Y-%m");
        const allDates = _.flatMap(this.props.data, d => parseTime(d.time));
        return [_.min(allDates) ?? new Date("1970/1/1"), _.max(allDates) ?? new Date()];
    }

    private getStackSumMax = (): number => {
        const keys = this.getSeriesNames();
        let max = 0;
        let keyWithMax = "";
        for (const key of keys) {
            let sum = 0;
            for (const series of this.props.data) {
                if (series.seriesData[key]) {
                    sum += series.seriesData[key];
                }
            }

            if (sum > max) {
                max = sum;
                keyWithMax = key;
            }
        }

        return max;
    }
}