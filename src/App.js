import {BrowserRouter, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";

function App() {
    return (
        <>
            <BrowserRouter>
                <h1>nSeed</h1>
                {/* layout and stuff here */}
                <Routes>
                    {/* routes here */}
                </Routes>
            </BrowserRouter>
            <ToastContainer
                position="bottom-center"
                hideProgressBar={true}
                autoClose={2000}
                theme={"dark"}
                delay={0}
                closeOnClick={true}
                draggable={false}
                closeButton={false}
                style={{textAlign: "center"}}
            />
        </>
    );
}

export default App;
