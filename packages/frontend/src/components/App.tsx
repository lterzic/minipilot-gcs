import { throttle } from "./control/ControlPanel";
import CopterControlPanel from "./control/CopterControlPanel";

function App() {
    return (
        <div>
            <h1>Minipilot GCS</h1>
            <CopterControlPanel
                sendCommand={throttle(1, (msg) => {
                    console.log("Send:" + msg);
                    return Promise.resolve();
                })}
            />
        </div>
    );
}

export default App;