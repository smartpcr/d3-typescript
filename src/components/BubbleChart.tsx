import React from "react";

export interface IBubbleChartProps {
    name: string;
}

export class BubbleChart extends React.Component<IBubbleChartProps> {
    public render() {
        return <div>Hello {this.props.name}</div>;
    }
}

