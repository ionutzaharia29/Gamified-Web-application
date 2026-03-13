import { IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function DarkModeToggle({ mode, setMode }) {
    return (
        <IconButton
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            color="inherit"
        >
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
    );
}