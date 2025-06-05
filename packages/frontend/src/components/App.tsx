import CopterControlPanel from "./control/CopterControlPanel";

function App() {
    return (
        <div>
            <h1>Minipilot GCS</h1>
            <CopterControlPanel
                sendCommand={(msg) => {
                    console.log("Send:" + msg);
                    return Promise.resolve(true);
                }}
                throttle={1}
            />
        </div>
    );
}

export default App;