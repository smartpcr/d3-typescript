import React from "react";
import * as d3 from "d3";

export interface IBarchartProps {
    width: number;
    height: number;
    data: number[];
}

export class Barchart extends React.Component<IBarchartProps> {

    constructor(props: IBarchartProps) {
        super(props);
    }

    public componentDidMount() {
        this.drawBarchart();
    }

    public componentDidUpdate(nextProps: IBarchartProps) {
        if (nextProps.data != this.props.data) {
            this.handleUpdate();
        }
    }

    public render() {
        return <div>
            <svg id="barchart"></svg>
        </div>;
    }

    private drawBarchart = (): void => {
        const xScale = d3.scaleBand<number>()
            .domain(d3.range(this.props.data.length))
            .rangeRound([0, this.props.width])
            .paddingInner(0.05);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(this.props.data) as number])
            .range([0, this.props.height]);

        const barPadding = 1;
        const svg = d3.select("#barchart")
            .attr("width", this.props.width)
            .attr("height", this.props.height);
        svg.selectAll("*").remove();

        svg.selectAll("react")
            .data(this.props.data)
            .enter() // only used when there is no rect
            .append("rect")
            .attr("x", (d, i) => xScale(i) as number)
            .attr("y", (d) => this.props.height - yScale(d))
            .attr("width", xScale.bandwidth())
            .attr("height", d => yScale(d))
            .attr("fill", d => "rgb(0,0," + Math.round(d * 10) + ")");

        svg.selectAll("text")
            .data(this.props.data)
            .enter()
            .append("text")
            .text(d => d)
            .attr("text-ancher", "middle")
            .attr("x", (d, i) => (xScale(i) as number) + xScale.bandwidth() / 2)
            .attr("y", d => this.props.height - yScale(d) + 14)
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "white");
    }

    private handleUpdate = (): void => {
        // this.drawBarchart();
        const xScale = d3.scaleBand<number>()
            .domain(d3.range(this.props.data.length))
            .rangeRound([0, this.props.width])
            .paddingInner(0.05);
        const yScale = d3.scaleLinear<number>()
            .domain([0, d3.max(this.props.data) as number])
            .range([0, this.props.height]);

        const svg = d3.select("#barchart")
        svg.selectAll("rect")
            .data(this.props.data)
            .attr("x", (d, i) => xScale(i) as number)
            .attr("y", (d) => this.props.height - yScale(d))
            .attr("width", xScale.bandwidth())
            .attr("height", d => yScale(d))
            .attr("fill", d => "rgb(0,0," + Math.round(d * 10) + ")");
        svg.selectAll("text")
            .data(this.props.data)
            .text(d => d)
            .attr("text-ancher", "middle")
            .attr("x", (d, i) => (xScale(i) as number) + xScale.bandwidth() / 2)
            .attr("y", d => this.props.height - yScale(d) + 14)
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "white");
    }
}