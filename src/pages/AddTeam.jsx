// import { useState } from "react";
// import { databases, DATABASE_ID, COLLECTION_TEAMS } from "../lib/appwrite";
// import { ID } from "appwrite";

// export default function AddTeam() {
//     const [teamId, setTeamId] = useState("");
//     const [teamName, setTeamName] = useState("");
//     const [problemId, setProblemId] = useState("");

//     const createTeam = async () => {
//         if (!teamId || !teamName || !problemId) {
//             return alert("Fill all fields");
//         }

//         try {
//             await databases.createDocument(
//                 DATABASE_ID,
//                 COLLECTION_TEAMS,
//                 String(teamId), // 🔥 team_id becomes document ID
//                 {
//                     team_id: Number(teamId),
//                     team_name: teamName,
//                     problem_id: problemId,
//                     started: false,
//                     start_time: null,
//                     base_time_sec: 1800,
//                     extra_time_sec: 0,
//                     pause_remaining_sec: 0,
//                     submissions_allowed: 1,
//                     submissions_used: 0,
//                     solved: false,
//                     time_taken_sec: null,
//                     purchased_keywords: [],
//                     purchased_extras: [],
//                     points_total: 100,
//                     points_used: 0,
//                     points_remaining: 100
//                 }
//             );

//             alert("Team created successfully");
//             setTeamId("");
//             setTeamName("");
//             setProblemId("");
//         } catch (err) {
//             console.error(err);
//             alert("Team ID already exists!");
//         }
//     };


//     return (
//         <div style={{ padding: 20 }}>
//             <h2>Add Team</h2>
//             <input type="number" placeholder="Team ID" value={teamId} onChange={e => setTeamId(e.target.value)} /><br />
//             <input placeholder="Team Name" value={teamName} onChange={e => setTeamName(e.target.value)} /><br />
//             <input placeholder="Problem ID" value={problemId} onChange={e => setProblemId(e.target.value)} /><br />
//             <button onClick={createTeam}>Create Team</button>
//         </div>
//     );
// }


import { useState, useEffect } from "react";
import { databases, DATABASE_ID, COLLECTION_TEAMS } from "../lib/appwrite";
import { ID } from "appwrite";
import BackgroundWrapper from "../components/BackgroundWrapper";
import Particles from "../components/Particles";

const COLORS = {
    bg: "#050505",
    surface: "#0F0F12",
    border: "#1F1F23",
    accent: "#00F0FF", // Cyan for Admin actions
    text: "#F4F4F5",
    muted: "#666"
};

export default function AddTeam() {
    const [teamId, setTeamId] = useState("");
    const [teamName, setTeamName] = useState("");
    const [problemId, setProblemId] = useState("");
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = COLORS.bg;
        document.body.style.margin = "0";
    }, []);

    const createTeam = async () => {
        if (!teamId || !teamName || !problemId) {
            return alert("Fill all fields");
        }

        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_TEAMS,
                String(teamId),
                {
                    team_id: Number(teamId),
                    team_name: teamName,
                    problem_id: problemId,
                    started: false,
                    start_time: null,
                    base_time_sec: 1800,
                    extra_time_sec: 0,
                    pause_remaining_sec: 0,
                    submissions_allowed: 1,
                    submissions_used: 0,
                    solved: false,
                    time_taken_sec: null,
                    purchased_keywords: [],
                    purchased_extras: [],
                    points_total: 100,
                    points_used: 0,
                    points_remaining: 100
                }
            );

            alert("🚀 Team initialized in database");
            setTeamId("");
            setTeamName("");
            setProblemId("");
        } catch (err) {
            console.error(err);
            alert("Team ID already exists!");
        }
    };

    return (
        <BackgroundWrapper style={{ border: 'none' }}>
            <div style={{
                height: "100vh",
                width: "100vw",
                backgroundColor: COLORS.bg,
                color: COLORS.text,
                fontFamily: "'Syncopate', 'Inter', sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden"
            }}>
                {/* Background Detail */}
                <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                    <Particles 
                        particleColors={[COLORS.accent, "#111"]} 
                        speed={0.05} 
                        particleCount={100}
                    />
                </div>

                <div style={{
                    zIndex: 1,
                    width: "100%",
                    maxWidth: "500px",
                    padding: "40px",
                    backgroundColor: "rgba(15, 15, 18, 0.8)",
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "4px"
                }}>
                    {/* Admin Header */}
                    <div style={{ marginBottom: "40px" }}>
                        <div style={{ 
                            fontFamily: "monospace", 
                            color: COLORS.accent, 
                            fontSize: "11px", 
                            letterSpacing: "4px",
                            marginBottom: "10px"
                        }}>
                            ADMIN_CORE_ACCESS
                        </div>
                        <h2 style={{ 
                            fontSize: "2rem", 
                            margin: 0, 
                            fontWeight: "900", 
                            letterSpacing: "-1px" 
                        }}>
                            REGISTER_UNIT<span style={{ color: COLORS.accent }}>_</span>
                        </h2>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                        <AdminInput 
                            label="TEAM_ID" 
                            type="number" 
                            placeholder="e.g. 01" 
                            value={teamId} 
                            onChange={setTeamId} 
                        />
                        <AdminInput 
                            label="TEAM_NAME" 
                            placeholder="" 
                            value={teamName} 
                            onChange={setTeamName} 
                        />
                        <AdminInput 
                            label="PROBLEM_ID" 
                            placeholder="" 
                            value={problemId} 
                            onChange={setProblemId} 
                        />

                        <button 
                            onClick={createTeam}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            style={{
                                marginTop: "20px",
                                backgroundColor: isHovered ? COLORS.accent : "transparent",
                                color: isHovered ? COLORS.bg : COLORS.accent,
                                border: `1px solid ${COLORS.accent}`,
                                padding: "18px",
                                fontFamily: "'Syncopate', sans-serif",
                                fontWeight: "700",
                                fontSize: "11px",
                                letterSpacing: "3px",
                                cursor: "pointer",
                                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                                boxShadow: isHovered ? `0 0 30px ${COLORS.accent}33` : "none"
                            }}
                        >
                            ADD TEAM
                        </button>
                    </div>
                </div>
                
                {/* Side Label */}
                <div style={{
                    position: "absolute",
                    left: "40px",
                    bottom: "40px",
                    fontFamily: "monospace",
                    fontSize: "10px",
                    color: "#333",
                    letterSpacing: "2px"
                }}>
                    SRV_ID: {DATABASE_ID.substring(0, 8)}...
                </div>
            </div>
        </BackgroundWrapper>
    );
}

// Reusable Input Component for consistent styling
function AdminInput({ label, type = "text", placeholder, value, onChange }) {
    const [focused, setFocused] = useState(false);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ 
                fontFamily: "monospace", 
                fontSize: "10px", 
                color: focused ? COLORS.accent : COLORS.muted,
                letterSpacing: "1px",
                transition: "color 0.3s ease"
            }}>
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    backgroundColor: "#050505",
                    border: `1px solid ${focused ? COLORS.accent : COLORS.border}`,
                    color: COLORS.text,
                    fontSize: "0.9rem",
                    padding: "12px 15px",
                    outline: "none",
                    fontFamily: "monospace",
                    transition: "all 0.3s ease",
                    borderRadius: "2px"
                }}
            />
        </div>
    );
}