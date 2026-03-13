import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./theme.js";

function Root() {
    const [mode, setMode] = useState("light");

    return (
        <ThemeProvider theme={getTheme(mode)}>
            <CssBaseline />
            <App mode={mode} setMode={setMode} />
        </ThemeProvider>
    );
}

export default Root;

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);

