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

        if (!state || state.team_id !== team.team_id) {
            state = {
                team_id: team.team_id,
                startTime: Date.now(),
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
    }, [team.team_id, team.base_time_sec]);

    const extendTime = () => {
        const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!s) return;

        if (s.usedExtra >= team.extra_time_sec) return;

        s.usedExtra += 300;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    };

    const applySpeedBoost = () => {
        const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!s) return;

        if (s.speedUsed >= team.speed_boost_count) return;

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
