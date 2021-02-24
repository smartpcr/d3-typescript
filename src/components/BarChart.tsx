import "./BarChart.scss";
import React from "react";
import * as d3 from "d3";

export interface IBarchartProps {
    width: number;
    height: number;
    data: number[];
    paddingLeft: number;
    paddingBottom: number;
}

export class Barchart extends React.Component<IBarchartProps> {

    public componentDidMount() {
        this.drawBarchart();
    }

    public componentDidUpdate(nextProps: IBarchartProps) {
        if (nextProps.data !== this.props.data) {
            this.handleUpdate();
        }
    }

    public render() {
        return (
            <div>
                <div id="tooltip" className="hidden">
                    <p>
                        <strong>Important Label Heading</strong>
                    </p>
                    <p>
                        <span id="value">100</span>%
                    </p>
                </div>
                <svg id="barchart"></svg>
            </div>
        );
    }

    private drawBarchart = (): void => {
        const xScale = d3
            .scaleBand<number>()
            .domain(d3.range(this.props.data.length))
            .rangeRound([this.props.paddingLeft, this.props.width])
            .paddingInner(0.05);
        const xAxis = d3.axisBottom(xScale).ticks(5);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max<number>(this.props.data) ?? 100])
            .range([this.props.height - this.props.paddingBottom, 0]);
        const yAxis = d3.axisLeft(yScale).ticks(5);

        const svg = d3
            .select("#barchart")
            .attr("width", this.props.width)
            .attr("height", this.props.height);
        svg.selectAll("*").remove();

        //Define sort order flag
			var sortOrder = false;

			//Define sort function
        var sortBars = function () {
            sortOrder = !sortOrder;

            svg.selectAll<SVGRectElement, number>("rect")
                .sort(function (a, b) {
                    if (sortOrder) {
                        return d3.ascending(a, b);
                    } else {
                        return d3.descending(a, b);
                    }
                })
                .transition()
                .delay(function (d, i) {
                    return i * 50;
                })
                .duration(1000)
                .attr("x", (d, i) => xScale(i) ?? 0);
        };

        svg.selectAll("react")
            .data(this.props.data)
            .enter() // used when there is no mapped rect
            .append("rect")
            .attr("x", (d, i) => xScale(i) as number)
            .attr("y", (d) => yScale(d))
            .attr("width", xScale.bandwidth())
            .attr(
                "height",
                (d) => this.props.height - yScale(d) - this.props.paddingBottom
            )
            .attr("fill", (d) => "rgb(0,0," + Math.round(d * 2.55) + ")")
            .attr("class", "bar")
            .on("mouseover", function (d) {
                const xPos =
                    parseFloat(d3.select(this).attr("x")) +
                    xScale.bandwidth() / 2;
                const yPos = parseFloat(d3.select(this).attr("y")) + 14;
                d3.select("#tooltip")
                    .style("left", xPos + "px")
                    .style("top", yPos + "px")
                    .select("#value")
                    .text(d);
                d3.select("#tooltip").classed("hidden", false);
            })
            .on("mouseout", function (d) {
                d3.select("#tooltip").classed("hidden", true);
            })
            .on("click", () => sortBars);

        svg.selectAll("text")
            .data(this.props.data)
            .enter()
            .append("text")
            .text((d) => d)
            .attr("text-ancher", "middle")
            .attr("x", (d, i) => (xScale(i) as number) + xScale.bandwidth() / 2)
            .attr("y", (d) => yScale(d) + 14)
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "white")
            .attr("class", "label");

        svg.append("g")
            .attr("class", "x axis")
            .attr(
                "transform",
                `translate(0, ${this.props.height - this.props.paddingBottom})`
            )
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", `translate(${this.props.paddingLeft}, 0)`)
            .call(yAxis);
    };

    private handleUpdate = (): void => {
        const xScale = d3
            .scaleBand<number>()
            .domain(d3.range(this.props.data.length))
            .rangeRound([this.props.paddingLeft, this.props.width])
            .paddingInner(0.05);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max<number>(this.props.data) ?? 100])
            .range([this.props.height - this.props.paddingBottom, 0]);
        const yAxis = d3.axisLeft<number>(yScale).ticks(5);

        // no enter, assuming number of data is the same for each update
        const svg = d3.select<SVGElement, any>("#barchart");
        const bars = svg
            .selectAll<SVGRectElement, number>("rect")
            .data(this.props.data);
        const labels = svg
            .selectAll<SVGTextElement, number>("text")
            .data(this.props.data);

        bars.exit().transition().duration(500).remove();
        labels.exit().transition().duration(500).remove();

        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(2000)
            .ease(d3.easeElasticOut)
            .attr("x", (d, i) => xScale(i) as number)
            .attr("y", (d) => yScale(d))
            .attr("width", xScale.bandwidth())
            .attr(
                "height",
                (d) => this.props.height - yScale(d) - this.props.paddingBottom
            )
            .attr("fill", (d) => "rgb(0,0," + Math.round(d * 2.55) + ")")
            .attr("class", "bar");
        labels
            .enter()
            .append("text")
            .merge(labels)
            .transition()
            .duration(2000)
            .ease(d3.easeElasticOut)
            .text((d) => d)
            .attr("text-ancher", "middle")
            .attr("x", (d, i) => (xScale(i) as number) + xScale.bandwidth() / 2)
            .attr("y", (d) => yScale(d) + 14)
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "white")
            .attr("class", "label");

        const yAxisSelection = svg.select(".y.axis") as any;
        yAxisSelection.call(yAxis);
    };
}
