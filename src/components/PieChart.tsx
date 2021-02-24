import React from "react";
import * as d3 from "d3";
import { PieArcDatum } from "d3";

export type PieDataPoint = { name: string; value: number; };

export interface IPieChartProps {
    data: PieDataPoint[];
    width: number;
    height: number;
    padding: number;
}

export class PieChart extends React.Component<IPieChartProps> {
    public render() {
        return <div>
            <svg id="pie-chart"></svg>
        </div>;
    }

    public componentDidMount() {
        this.draw();
    }

    public componentDidUpdate(nextProps: IPieChartProps) {
        if (nextProps.data !== this.props.data) {
            this.handleUpdate();
        }
    }

    private readonly draw = (): void => {
        const outerRadius = this.props.width / 2 - this.props.padding;
        const innerRadius = 0;
        const colors = d3.scaleOrdinal<number, string>(d3.schemeCategory10);

        const pie = d3.pie<PieDataPoint>().value(d => d.value);
        const arc = d3.arc<PieArcDatum<PieDataPoint>>()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const svg = d3.select("#pie-chart")
            .attr("width", this.props.width)
            .attr("height", this.props.height);

        const arcs = svg.selectAll("g.arc")
            .data(pie(this.props.data))
            .enter()
            .append("g")
            .attr("class", "arc")
            .attr("transform", `translate(${this.props.width / 2}, ${this.props.height / 2})`);

        // draw arc paths
        arcs.append("path")
            .attr("fill", (d, i) => colors(i))
            .attr("d", d => arc(d));

        // labels
        arcs.append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .text(d => d.data.name);
    }

    private readonly handleUpdate = (): void => {

    }
}