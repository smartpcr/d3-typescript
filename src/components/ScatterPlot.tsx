import "./ScatterPlot.scss";
import React from "react";
import * as d3 from "d3";

export interface IScatterPlotProps {
    data: { x: number, y: number }[];
    width: number;
    height: number;
    padding: number;
}

export class ScatterPlot extends React.Component<IScatterPlotProps> {
    constructor(props: IScatterPlotProps) {
        super(props);
    }

    public componentDidMount() {
        this.draw();
    }

    public componentDidUpdate(nextProps: IScatterPlotProps) {
        if (nextProps.data !== this.props.data) {
            this.handleUpdate();
        }
    }

    public render() {
        return <div>
            <svg id="scatter-plot"></svg>
        </div>;
    }

    private draw = (): void => {
        const xScale = d3.scaleLinear<number>()
            .domain([0, d3.max(this.props.data, d => d.x) ?? 100])
            .range([this.props.padding, this.props.width - 2 * this.props.padding]);
        const xAxis = d3.axisBottom(xScale).ticks(5);
        const yScale = d3.scaleLinear<number>()
            .domain([0, d3.max(this.props.data, d => d.y) ?? 100])
            .range([this.props.height - this.props.padding, this.props.padding]);
        const yAxis = d3.axisLeft(yScale).ticks(5);

        const svg = d3.select("#scatter-plot").attr("width", this.props.width).attr("height", this.props.height);

        //Define clipping path
		svg.append("clipPath")
            .attr("id", "chart-area")
            .append("rect")
            .attr("x", this.props.padding)
            .attr("y", this.props.padding)
            .attr("width", this.props.width - this.props.padding * 3)
            .attr("height", this.props.height - this.props.padding * 2);

        //Create circles
        svg.append("g")
            .attr("id", "circles")
            .attr("clip-path", "url(#chart-area)")
            .selectAll("circle")
            .data(this.props.data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return xScale(d.x);
            })
            .attr("cy", function (d) {
                return yScale(d.y);
            })
            .attr("r", 20)
            .attr("fill", d => `rgb(0, ${Math.round(d.x * 50)}, ${Math.round(d.y * 50)})`);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${this.props.height - this.props.padding})`)
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", `translate(${this.props.padding}, 0)`)
            .call(yAxis);

    }

    private handleUpdate = (): void => {
        const xScale = d3.scaleLinear<number>()
            .domain([0, d3.max(this.props.data, d => d.x) ?? 100])
            .range([this.props.padding, this.props.width - 2 * this.props.padding]);
        const xAxis = d3.axisBottom(xScale).ticks(5);
        const yScale = d3.scaleLinear<number>()
            .domain([0, d3.max(this.props.data, d => d.y) ?? 100])
            .range([this.props.height - this.props.padding, this.props.padding]);
        const yAxis = d3.axisLeft(yScale).ticks(5);

        //Update all circles
        const svg = d3.select("#scatter-plot")
        const circles = svg.selectAll<SVGCircleElement, { x: number, y: number }>("circle").data(this.props.data);
        circles.exit()
            .transition()
            .duration(500)
            .remove();
        circles
            .enter()
            .append("circle")
            .merge(circles)
            .transition()
            .duration(1000)
            .on("start", function () {
                d3.select(this)
                    .attr("fill", (d: any) => `rgb(${Math.round(d.x * 50)}, ${Math.round(d.y * 50)}, 0)`)
                    .attr("r", 7);
            })
            .attr("cx", function (d) {
                return xScale(d.x);
            })
            .attr("cy", function (d) {
                return yScale(d.y);
            })
            .on("end", function () {
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("fill", (d: any) => `rgb(0, ${Math.round(d.x * 50)}, ${Math.round(d.y * 50)})`)
                    .attr("r", 12);
            });

        //Update X axis
        const selectionX = svg.select(".x.axis") as any;
        selectionX
            .transition()
            .duration(1000)
            .call(xAxis);

                //Update Y axis
        const selectionY = svg.select(".y.axis") as any;
        selectionY.transition()
            .duration(1000)
            .call(yAxis);
    }
}