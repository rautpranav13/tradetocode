import { useState } from "react";
import {
    databases,
    DATABASE_ID,
    COLLECTION_TEAMS,
    COLLECTION_PROBLEMS,
} from "../lib/appwrite";
import { useNavigate } from "react-router-dom";
import BackgroundWrapper from "../components/BackgroundWrapper";

const COLORS = {
    surface: "#0F0F12",
    border: "#1F1F23",
    accent: "#FD366E",
    text: "#F4F4F5",
    muted: "#666",
};

export default function ParticipantLogin() {
    const [teamId, setTeamId] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!teamId) return alert("Enter Team ID");

        try {
            const team = await databases.getDocument(
                DATABASE_ID,
                COLLECTION_TEAMS,
                String(teamId)
            );

            // 🔥 START CONTEST IF NOT STARTED
            if (!team.started) {
                const now = Math.floor(Date.now() / 1000);

                const updatedTeam = await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTION_TEAMS,
                    String(teamId),
                    {
                        started: true,
                        start_time: now,
                        base_time_sec: team.base_time_sec || 1800,
                        extra_time_sec: team.extra_time_sec || 0,
                        submissions_allowed: team.submissions_allowed || 1,
                        points_used: 0,
                        points_remaining: team.points_total
                    }
                );

                localStorage.setItem("teamData", JSON.stringify(updatedTeam));
            } else {
                localStorage.setItem("teamData", JSON.stringify(team));
            }

            const problem = await databases.getDocument(
                DATABASE_ID,
                COLLECTION_PROBLEMS,
                team.problem_id
            );

            localStorage.setItem("problemData", JSON.stringify(problem));

            navigate("/participant/dashboard");

        } catch (err) {
            console.error(err);
            alert("Invalid Team ID");
        }
    };


    return (
        <BackgroundWrapper>
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    color: COLORS.text,
                    fontFamily: "'Syncopate', 'Inter', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "400px",
                        padding: "40px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "30px",
                        background: "rgba(15,15,18,0.6)",
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${COLORS.border}`,
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontFamily: "monospace",
                                color: COLORS.accent,
                                fontSize: "12px",
                                letterSpacing: "3px",
                                marginBottom: "8px",
                            }}
                        >
                            AUTHENTICATION_REQUIRED
                        </div>
                        <h2
                            style={{
                                fontSize: "2.5rem",
                                margin: 0,
                                fontWeight: "900",
                                letterSpacing: "-2px",
                            }}
                        >
                            LOGIN<span style={{ color: COLORS.accent }}>.</span>
                        </h2>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <label
                            style={{
                                fontFamily: "monospace",
                                fontSize: "10px",
                                color: COLORS.muted,
                                letterSpacing: "1px",
                            }}
                        >
                            ENTER_TEAM_IDENTIFIER
                        </label>
                        <input
                            type="number"
                            placeholder="0000"
                            value={teamId}
                            onChange={(e) => setTeamId(e.target.value)}
                            style={{
                                backgroundColor: "transparent",
                                border: "none",
                                borderBottom: `2px solid ${COLORS.border}`,
                                color: COLORS.text,
                                fontSize: "1.5rem",
                                padding: "10px 0",
                                outline: "none",
                                fontFamily: "monospace",
                            }}
                            onFocus={(e) =>
                                (e.target.style.borderBottomColor = COLORS.accent)
                            }
                            onBlur={(e) =>
                                (e.target.style.borderBottomColor = COLORS.border)
                            }
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{
                            backgroundColor: isHovered ? COLORS.accent : "transparent",
                            color: isHovered ? "#050505" : COLORS.text,
                            border: `1px solid ${COLORS.accent}`,
                            padding: "16px",
                            fontFamily: "'Syncopate', sans-serif",
                            fontWeight: "700",
                            fontSize: "12px",
                            letterSpacing: "2px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: isHovered ? `0 0 20px ${COLORS.accent}44` : "none",
                        }}
                    >
                        INITIALIZE_CONTEST
                    </button>

                    <div
                        style={{
                            fontFamily: "monospace",
                            fontSize: "9px",
                            color: COLORS.muted,
                            textAlign: "center",
                            marginTop: "10px",
                            letterSpacing: "1px",
                        }}
                    >
                        SECURE_ENCRYPTED_CHANNEL // V1.0
                    </div>
                </div>
            </div>
        </BackgroundWrapper>
    );
}
