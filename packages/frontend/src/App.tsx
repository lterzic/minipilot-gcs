import { AppBar, Box, Chip, createTheme, CssBaseline, Grid, Tab, Tabs, ThemeProvider, Typography } from "@mui/material";
import { useState } from "react";

export default function App() {
    const theme = createTheme({
        palette: { mode: "dark" },
        typography: { fontFamily: "system-ui" }
    });
    const [tab, setTab] = useState(0);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
            <Box sx={{ flexGrow: 1, height: "100vh", display: "flex", flexDirection: "column" }}>
                {/* Top bar */}
                <AppBar position="static">
                    <Typography>Minipilot GCS</Typography>
                    {/* Set label and color based on link connection, and on click open dialog to connect */}
                    <Chip label={"Not connected"} color={"error"} onClick={(ev) => {}}/>
                    {/* Set if quadcopter, plane, etc... */}
                    <Chip label={"Vehicle type"}></Chip>
                </AppBar>

                {/* Main grid */}
                <Box sx={{ p: 1.5, flex: 1, overflow: "hidden" }}>
                <Grid container spacing={1}>
                    <Grid size={8}>
                        <Tabs value={tab} onChange={(ev, idx) => setTab(idx)}>
                            <Tab label="Sensors" />
                            <Tab label="Actuators" />
                            <Tab label="State" />
                            <Tab label="System" />
                            <Tab label="Navigation" />
                        </Tabs>
                    </Grid>
                    <Grid size={4}>
                        <Grid size={12}>
                            {/* HUD & Video feed */}
                        </Grid>
                        <Grid size={12}>
                            {/* Controls */}
                        </Grid>
                    </Grid>
                </Grid>
                </Box>
            </Box>
            </CssBaseline>
        </ThemeProvider>
    );
}