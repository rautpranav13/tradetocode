import { useEffect, useState } from "react";
import { databases, DATABASE_ID, COLLECTION_LEADERBOARD } from "../lib/appwrite";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { Query } from "appwrite";

const COLORS = {
    bg: "#0B0C0E",
    surface: "#161618",
    border: "#2C2C2E",
    primary: "#FD366E",
    textMain: "#E4E4E7",
    textMuted: "#A1A1AA",
    gold: "#FFD700",
    silver: "#C0C0C0",
    bronze: "#CD7F32"
};

export default function Leaderboard() {
    const [teams, setTeams] = useState([]);

    const fetchLeaderboard = async () => {
        const res = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_LEADERBOARD,
            [Query.limit(100)]
        );

        // SORTING LOGIC
        const sorted = res.documents.sort((a, b) => {
            if (a.solved !== b.solved) return b.solved - a.solved;
            if (a.time_taken_sec !== b.time_taken_sec)
                return a.time_taken_sec - b.time_taken_sec;
            return a.submitted_at - b.submitted_at;
        });

        setTeams(sorted);
    };

    useEffect(() => {
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 3000); // 🔴 LIVE REFRESH
        return () => clearInterval(interval);
    }, []);

    const formatTime = (sec) => {
        if (!sec && sec !== 0) return "--";
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}m ${s}s`;
    };

    const rankColor = (rank) => {
        if (rank === 1) return COLORS.gold;
        if (rank === 2) return COLORS.silver;
        if (rank === 3) return COLORS.bronze;
        return COLORS.textMuted;
    };

    return (
        <BackgroundWrapper>
            <div style={{
                minHeight: "100vh",
                padding: "40px",
                color: COLORS.textMain,
                fontFamily: "'Inter', sans-serif"
            }}>
                <h1 style={{
                    textAlign: "center",
                    fontSize: "2.5rem",
                    marginBottom: "30px",
                    color: COLORS.primary
                }}>
                    🏆 LIVE LEADERBOARD
                </h1>

                <div style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "12px",
                    overflow: "hidden"
                }}>
                    {teams.map((team, index) => (
                        <div
                            key={team.$id}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "80px 1fr 120px 120px",
                                padding: "18px",
                                borderBottom: `1px solid ${COLORS.border}`,
                                alignItems: "center",
                                fontSize: "14px"
                            }}
                        >
                            <span style={{
                                fontWeight: "bold",
                                color: rankColor(index + 1),
                                fontSize: "18px"
                            }}>
                                #{index + 1}
                            </span>

                            <span style={{ fontWeight: "600" }}>
                                {team.team_name}
                            </span>

                            <span style={{ color: team.solved ? "#00FF9C" : COLORS.textMuted }}>
                                {team.solved ? "Solved" : "—"}
                            </span>

                            <span style={{ textAlign: "right" }}>
                                {team.solved ? formatTime(team.time_taken_sec) : "--"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </BackgroundWrapper>
    );
}
