

import { Button, Container, FormControlLabel, Grid, Paper, Slider, Stack, Switch, Typography } from "@mui/material";
import React, { useEffect } from "react";



function Aufgabe() {
    const [dauer, setDauer] = React.useState<number>(30);
    const [geschwindechkeit, setgeschwindechkeit] = React.useState<number>(900);
    const [parallelMaulwuerf, setParallelMaulwuerf] = React.useState<number>(1);
    const [ton, setTon] = React.useState<boolean>(false);
    const [score, setScore] = React.useState<number>(0);
    const [hitRate, sethitRate] = React.useState<number>(0);
    const [trifft, setTrifft] = React.useState<number>(0);
    const [shot, setShot] = React.useState<number>(0);
    const [time, setTime] = React.useState<number>(30);
    const [running, setRunning] = React.useState<boolean>(false);
    //var accuracy = shot?Math.round(hitRate / shot) * 100:0;
    const [setUp, setsetUp] = React.useState<boolean[]>(Array(12).fill(false));

    let audioCtx: AudioContext | null = null;

    function ensureAudio() {
        if (!audioCtx) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            audioCtx = new Ctx();
        }
    }
    function beep(freq = 600, dur = 0.08) {
        if (!ton) return;
        ensureAudio();
        const t = audioCtx!.currentTime;
        const o = audioCtx!.createOscillator();
        const g = audioCtx!.createGain();
        o.type = 'square';
        o.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.15, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(audioCtx!.destination);
        o.start(t);
        o.stop(t + dur + 0.02);
    }
    const onclickStart = () => {
        setTime(dauer);
        setScore(0);
        setShot(0);
        sethitRate(0);
        setTrifft(0);
        setRunning(true);
    }
    const checkMaulwurf = (index: number) => {
        setShot(i => i + 1);
        if (setUp[index]) {
            beep(760, 0.06);
            setTrifft(y => y + 1);
            setScore(y => y + 10);
            setsetUp(prev => prev.map((v, idx) => (idx === index ? !v : v)));
        }
        sethitRate(shot !== 0 ? Math.round(trifft / shot) * 100 : 0);
    }
    const onclickStop = () => {
        setRunning(false);
        setsetUp(Array(setUp.length).fill(false));
    }
    const parallelMaulwuerfeSetzen = (num: number) => {
        setsetUp(Array(12).fill(false));
        const indeciesToChange: number[] = [];
        for (let i = 1; i <= num; i++) {
            let randomIndex = Math.floor(Math.random() * 12);
            while (indeciesToChange.indexOf(randomIndex) !== -1) {
                randomIndex = Math.floor(Math.random() * 12)
            }
            indeciesToChange.push(randomIndex);
        }
        for (const index of indeciesToChange) {
            setsetUp(prev => prev.map((v, idx) => (idx === index ? !v : v)));
        }
        beep(420, 0.05);
    }
    useEffect(() => {
        const interval = setInterval(() => {
            if (!running) return;
            setTime(time => {
                if (time === 1) {
                    //debugger
                    setRunning(false);
                    setsetUp(Array(12).fill(false));
                    return 0;
                }
                return --time;
            });

        }, 1000);
        return () => clearInterval(interval);
    }, [running]);


    useEffect(() => {
        const interval = setInterval(() => {
            if (!running) return;
            parallelMaulwuerfeSetzen(parallelMaulwuerf);
        }, geschwindechkeit);
        return () => clearInterval(interval);
    }, [running, parallelMaulwuerf, geschwindechkeit]);


    const handleDauerSliderChange = (event: Event, newValue: number) => {
        setDauer(newValue);
        setTime(newValue);
    }

    const handleSpeedSliderChange = (event: Event, newValue: number) => {
        setgeschwindechkeit(newValue)
    }
    const handleParallelSliderChange = (event: Event, newValue: number) => {
        parallelMaulwuerfeSetzen(newValue);
        setParallelMaulwuerf(newValue);
    }
    const handleTonSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTon(event.target.checked);
    }

    return (
        <>
            <Container>
                <Grid container spacing={2}>

                    <Grid size={{ xs: 12, md: 8 }}>

                        <Typography id="input-slider" gutterBottom>
                            Whack-a-Mole (UI-Skeleton)
                        </Typography>
                        <Grid container spacing={2}>
                            {Array.from(Array(12)).map((_, index) => (
                                <Grid key={index} size={{ xs: 2, sm: 3, md: 3 }}>
                                    <Paper key={index}>
                                        <Button
                                            fullWidth
                                            sx={{ aspectRatio: "1 / 1", fontSize: 34 }}
                                            onClick={() => checkMaulwurf(index)}
                                        >
                                            {setUp[index] && "🐭"}
                                        </Button>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                    </Grid>

                    <Grid size={4}>
                        <Paper sx={{ p: 3, mt: 4 }}>
                            <Stack spacing={2} direction="row">
                                <Button variant="contained" onClick={onclickStart}>Start</Button>
                                <Button variant="outlined" onClick={onclickStop}>Stop</Button>
                            </Stack>

                            <Typography id="input-slider" gutterBottom>
                                Dauer: {dauer}s
                            </Typography>


                            <Grid size="grow">
                                <Slider defaultValue={dauer}
                                    value={dauer}
                                    step={5}
                                    marks
                                    min={10}
                                    max={90}
                                    aria-labelledby="input-slider"
                                    onChange={handleDauerSliderChange}
                                    valueLabelDisplay="auto"
                                />

                            </Grid>
                            <Typography id="input-slider" gutterBottom>
                                Geschwindechkeit: {geschwindechkeit}ms
                            </Typography>


                            <Grid size="grow">
                                <Slider
                                    //getAriaValueText={value}
                                    value={geschwindechkeit}
                                    defaultValue={geschwindechkeit}
                                    step={50}
                                    marks
                                    min={300}
                                    max={1500}
                                    aria-labelledby="input-slider"
                                    onChange={handleSpeedSliderChange}
                                    valueLabelDisplay="auto"
                                />

                            </Grid>
                            <Typography id="input-slider" gutterBottom>
                                Parallel-Maulwürfe: {parallelMaulwuerf}
                            </Typography>


                            <Grid size="grow">
                                <Slider
                                    value={parallelMaulwuerf}
                                    defaultValue={parallelMaulwuerf}
                                    step={1}
                                    marks
                                    min={1}
                                    max={3}
                                    aria-labelledby="input-slider"
                                    onChange={handleParallelSliderChange}
                                    valueLabelDisplay="auto"
                                />

                            </Grid>

                            <FormControlLabel control={<Switch
                                checked={ton}
                                onChange={handleTonSwitch}
                                slotProps={{ input: { 'aria-label': 'controlled' } }}
                            />} label="Ton" />

                            <Typography id="input-slider" gutterBottom>
                                Score: {score}
                            </Typography>

                            <Typography id="input-slider" gutterBottom>
                                Treffquote: {hitRate}%
                            </Typography>

                            <Typography id="input-slider" gutterBottom>
                                Zeit: {time}s
                            </Typography>
                        </Paper>
                    </Grid>

                </Grid>

            </Container>
        </>
    )
}

export default Aufgabe;
