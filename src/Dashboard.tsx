import React from "react";
import { Barchart } from "./components/BarChart";
import { BubbleChart } from "./components/BubbleChart";

export interface IDashboardProps {
}

export interface IDashboardState {
    barchartData: number[];
}


export class Dashboard extends React.Component<IDashboardProps, IDashboardState> {
    constructor(props: IDashboardProps) {
        super(props);
        this.state = {
            barchartData: [5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 74, 32, 21, 45, 56]
        };
    }

    public render() {
        return <div>
            <BubbleChart name="world" />
            <Barchart data={this.state.barchartData} width={900} height={300} />
            <div>
                <button onClick={this.refreshData}>Refresh</button>
            </div>
        </div>
    }


    private readonly refreshData = (): void => {
        const data: number[] = [];
        for (let i = 0; i < 15; i++) {
            data.push(Math.round(Math.random() * 100));
        }
        this.setState({
            barchartData: data
        });
    }
}