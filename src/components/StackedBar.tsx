import React from "react";
import * as d3 from "d3";

export type ChartLayout = { width: number; height: number; padding: number };

export type SeriesData = { [key: string]: number };

export interface IStackedBarProps {
    data: SeriesData[];
    layout: ChartLayout;
}

export class StackedBar extends React.Component<IStackedBarProps> {
    public render() {
        return <div>
            <svg id="stacked-bar"></svg>
        </div>;
    }

    public componentDidMount() {
        this.draw();
    }

    public componentDidUpdate(nextProps: IStackedBarProps) {
        if (nextProps.data !== this.props.data) {
            this.handleUpdate();
        }
    }

    private draw = (): void => {
        const stack = d3.stack<SeriesData, string>()
            .keys(Object.keys(this.props.data[0]))
            .order(d3.stackOrderDescending);

        const series = stack(this.props.data);
        const xScale = d3.scaleBand<number>()
            .domain(d3.range(this.props.data.length))
            .range([this.props.layout.padding, this.props.layout.width - this.props.layout.padding])
            .paddingInner(0.05);
        const yScale = d3.scaleLinear<number>()
            .domain([0, this.getStackSumMax()])
            .range([this.props.layout.height - this.props.layout.padding * 2, this.props.layout.padding]);
        const colors = d3.scaleOrdinal<number, string>(d3.schemeCategory10);

        const svg = d3.select("#stacked-bar")
            .attr("width", this.props.layout.width)
            .attr("height", this.props.layout.height);
        const groups = svg.selectAll("g")
            .data(series)
            .enter()
            .append("g")
            .style("fill", (d, i) => colors(i));

        const bars = groups.selectAll("rect")
            .data(d => d)
            .enter()
            .append("rect")
            .attr("x", (d, i) => xScale(i) ?? 0)
            .attr("y", d => d && d.data ? yScale(d[1]) : 0)
            .attr("height", d => d && d.data ? yScale(d[0]) - yScale(d[1]) : 0)
            .attr("width", xScale.bandwidth);
    }

    private handleUpdate = (): void => {

    }

    private getStackSumMax = (): number => {
        const keys = Object.keys(this.props.data[0]);
        let max = 0;
        let keyWithMax = "";
        for (const key of keys) {
            let sum = 0;
            for (const series of this.props.data) {
                sum += series[key];
            }

            if (sum > max) {
                max = sum;
                keyWithMax = key;
            }
        }

        return max;
    }
}