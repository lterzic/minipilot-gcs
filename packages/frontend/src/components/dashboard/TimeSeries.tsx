import { LineChart } from "@mui/x-charts";

export interface ITimeSeriesProps {
    name: string;
    t: number[];
    data: number[][];
}

export function TimeSeries(props: ITimeSeriesProps) {
    return (
        <LineChart
            skipAnimation={true}
            xAxis={[{data: props.t}]}
            series={props.data.map((samples) => ({
                curve: "linear",
                showMark: false,
                data: samples
            }))}
            title={props.name}
        />
    );
}