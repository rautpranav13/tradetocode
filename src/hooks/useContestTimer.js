import { useEffect, useState } from "react";

const STORAGE_KEY = "contest_timer_state";

export default function useContestTimer(team) {
    const [view, setView] = useState({
        remaining: 0,
        usedExtra: 0,
        speedUsed: 0
    });

    useEffect(() => {
        if (!team.team_id) return;

        let state = JSON.parse(localStorage.getItem(STORAGE_KEY));

        // 🧠 Convert DB start_time safely
        const dbStart = team.start_time
            ? (team.start_time < 1e12
                ? team.start_time * 1000   // seconds → ms
                : team.start_time)         // already ms
            : null;

        // 🔁 INIT OR RESYNC
        if (
            !state ||
            state.team_id !== team.team_id ||
            (dbStart && Math.abs(state.startTime - dbStart) > 5000)
        ) {
            state = {
                team_id: team.team_id,
                startTime: dbStart || Date.now(),
                usedExtra: 0,
                speedUsed: 0
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }

        const tick = () => {
            const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (!s) return;

            const base = team.base_time_sec || 0;
            const elapsed = Math.floor((Date.now() - s.startTime) / 1000);
            const remaining = Math.max(base - elapsed + s.usedExtra, 0);

            setView({
                remaining,
                usedExtra: s.usedExtra,
                speedUsed: s.speedUsed
            });
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);

    }, [team.team_id, team.base_time_sec, team.start_time]);

    const extendTime = () => {
        const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!s || s.usedExtra >= team.extra_time_sec) return;
        s.usedExtra += 300;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    };

    const applySpeedBoost = () => {
        const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!s || s.speedUsed >= team.speed_boost_count) return;
        s.speedUsed += 1;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    return { ...view, extendTime, applySpeedBoost, formatTime };
}
