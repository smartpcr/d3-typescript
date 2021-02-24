import React from "react";
import { Barchart } from "./components/BarChart";
import { BubbleChart } from "./components/BubbleChart";
import { PieChart } from "./components/PieChart";
import { ScatterPlot } from "./components/ScatterPlot";

export interface IDashboardProps {
}

export interface IDashboardState {
    barchartData: number[];
    scatterPlotData: { x: number, y: number }[];
    pieChartData: { name: string; value: number }[];
}


export class Dashboard extends React.Component<IDashboardProps, IDashboardState> {
    constructor(props: IDashboardProps) {
        super(props);
        this.state = {
            barchartData: [5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 74, 32, 21, 45, 56],
            scatterPlotData: [
                { x: 1, y: 5 },
                { x: 2, y: 4 },
                { x: 3, y: 3 },
                { x: 4, y: 2 },
                { x: 5, y: 1 },
            ],
            pieChartData: [
                { name: "one", value: 10 },
                { name: "two", value: 20 },
                { name: "three", value: 30 },
                { name: "four", value: 40 },
                { name: "file", value: 50 },
            ]
        };
    }

    public render() {
        return <div>
            <BubbleChart name="world" />
            <Barchart data={this.state.barchartData} width={900} height={300} paddingBottom={20} paddingLeft={20} />
            <ScatterPlot data={this.state.scatterPlotData} width={900} height={300} padding={30} />
            <PieChart data={this.state.pieChartData} width={400} height={400} padding={10}/>
            <div>
                <button onClick={this.refreshData}>Refresh</button>
            </div>
        </div>
    }


    private readonly refreshData = (): void => {
        const data: number[] = [];
        const total = 5 + Math.round(Math.random() * 10);
        const dataPairs: { x: number, y: number }[] = [];
        for (let i = 0; i < total; i++) {
            data.push(Math.round(Math.random() * 100));
            dataPairs.push({
                x: Math.round(Math.random() * 100),
                y: Math.round(Math.random() * 100)
            });
        }


        this.setState({
            barchartData: data,
            scatterPlotData: dataPairs
        });
    }
}