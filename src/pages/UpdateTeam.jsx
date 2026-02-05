// import { useState } from "react";
// import { databases, DATABASE_ID, COLLECTION_TEAMS } from "../lib/appwrite";
// import { KEYWORDS, EXTRAS, PRICE_MAP } from "../config/storeItems";

// export default function UpdateTeam() {
//     const [teamId, setTeamId] = useState("");
//     const [teamDoc, setTeamDoc] = useState(null);

//     const loadTeam = async () => {
//         try {
//             const doc = await databases.getDocument(
//                 DATABASE_ID,
//                 COLLECTION_TEAMS,
//                 String(teamId)
//             );
//             setTeamDoc(doc);
//         } catch {
//             alert("Team not found");
//         }
//     };

//     const calculateCost = (keywords, extras) => {
//         const all = [...keywords, ...extras];
//         return all.reduce((sum, item) => sum + (PRICE_MAP[item] || 0), 0);
//     };

//     const toggle = (field, value) => {
//         const newKeywords =
//             field === "purchased_keywords"
//                 ? teamDoc.purchased_keywords.includes(value)
//                     ? teamDoc.purchased_keywords.filter(v => v !== value)
//                     : [...teamDoc.purchased_keywords, value]
//                 : teamDoc.purchased_keywords;

//         const newExtras =
//             field === "purchased_extras"
//                 ? teamDoc.purchased_extras.includes(value)
//                     ? teamDoc.purchased_extras.filter(v => v !== value)
//                     : [...teamDoc.purchased_extras, value]
//                 : teamDoc.purchased_extras;

//         const newCost = calculateCost(newKeywords, newExtras);
//         if (newCost > teamDoc.points_total) return;

//         setTeamDoc(prev => ({
//             ...prev,
//             purchased_keywords: newKeywords,
//             purchased_extras: newExtras
//         }));
//     };

//     const save = async () => {
//         const currentCost = calculateCost(
//             teamDoc.purchased_keywords,
//             teamDoc.purchased_extras
//         );

//         const remainingPoints = teamDoc.points_total - currentCost;

//         // 🔹 Count extras
//         const timeWarpCount = teamDoc.purchased_extras.filter(e => e === "time_warp").length;
//         const pauseCount = teamDoc.purchased_extras.filter(e => e === "pause_time").length;
//         const secondChanceCount = teamDoc.purchased_extras.filter(e => e === "second_chance").length;

//         await databases.updateDocument(
//             DATABASE_ID,
//             COLLECTION_TEAMS,
//             String(teamId),
//             {
//                 purchased_keywords: teamDoc.purchased_keywords,
//                 purchased_extras: teamDoc.purchased_extras,
//                 points_used: currentCost,
//                 points_remaining: remainingPoints,

//                 // 🔹 Apply effects
//                 extra_time_sec: timeWarpCount * 300,
//                 pause_remaining_sec: pauseCount * 300,
//                 submissions_allowed: 1 + secondChanceCount
//             }
//         );

//         alert("Updated successfully");
//     };

//     if (!teamDoc) return (
//         <div style={{ padding: 20 }}>
//             <h2>Update Team Purchases</h2>
//             <input type="number" placeholder="Team ID" value={teamId} onChange={e => setTeamId(e.target.value)} />
//             <button onClick={loadTeam}>Load Team</button>
//         </div>
//     );

//     const currentCost = calculateCost(teamDoc.purchased_keywords, teamDoc.purchased_extras);
//     const remainingPoints = teamDoc.points_total - currentCost;

//     return (
//         <div style={{ padding: 20 }}>
//             <h2>Update Team Purchases</h2>

//             <div style={{ border: "1px solid #ccc", padding: 10 }}>
//                 <p>Total Points: {teamDoc.points_total}</p>
//                 <p>Points Used: {currentCost}</p>
//                 <p>Points Remaining: {remainingPoints}</p>
//             </div>

//             <h3>Keywords</h3>
//             {KEYWORDS.map(k => (
//                 <label key={k.id} style={{ display: "block" }}>
//                     <input
//                         type="checkbox"
//                         checked={teamDoc.purchased_keywords.includes(k.id)}
//                         onChange={() => toggle("purchased_keywords", k.id)}
//                     />
//                     {k.label} (🪙 {k.price})
//                 </label>
//             ))}

//             <h3>Extras</h3>
//             {EXTRAS.map(e => (
//                 <label key={e.id} style={{ display: "block" }}>
//                     <input
//                         type="checkbox"
//                         checked={teamDoc.purchased_extras.includes(e.id)}
//                         onChange={() => toggle("purchased_extras", e.id)}
//                     />
//                     {e.label} (🪙 {e.price})
//                 </label>
//             ))}

//             <button onClick={save}>Save Changes</button>
//         </div>
//     );
// }


import { useState, useEffect } from "react";
import { databases, DATABASE_ID, COLLECTION_TEAMS } from "../lib/appwrite";
import { KEYWORDS, EXTRAS, PRICE_MAP } from "../config/storeItems";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { getPrice, isLateMarket } from "../config/storeItems";

const COLORS = {
    bg: "#050505",
    surface: "#0F0F12",
    border: "#1F1F23",
    accent: "#00FF9C", // Neon Green for Points/Currency
    error: "#FD366E",
    text: "#F4F4F5",
    muted: "#666"
};

export default function UpdateTeam() {
    const [teamId, setTeamId] = useState("");
    const [teamDoc, setTeamDoc] = useState(null);

    useEffect(() => {
        document.body.style.backgroundColor = COLORS.bg;
    }, []);

    const loadTeam = async () => {
        try {
            const doc = await databases.getDocument(DATABASE_ID, COLLECTION_TEAMS, String(teamId));
            setTeamDoc(doc);
        } catch {
            alert("Team not found");
        }
    };

    const calculateCost = (keywords, extras) => {
        const late = isLateMarket(teamDoc);
        const all = [...keywords, ...extras];

        return all.reduce((sum, item) => sum + getPrice(item, late), 0);
    };

    const toggle = (field, value) => {
        if (field === "purchased_keywords") {
            const newKeywords = teamDoc.purchased_keywords.includes(value)
                ? teamDoc.purchased_keywords.filter(v => v !== value)
                : [...teamDoc.purchased_keywords, value];

            const newCost = calculateCost(newKeywords, teamDoc.purchased_extras);
            if (newCost > teamDoc.points_total) return;

            setTeamDoc(prev => ({ ...prev, purchased_keywords: newKeywords }));
        }

        if (field === "purchased_extras") {
            const currentCount = teamDoc.purchased_extras.filter(e => e === value).length;

            let newExtras = [...teamDoc.purchased_extras];

            // 🔁 CYCLE: 0 → 1 → 2 → 0
            if (currentCount === 0) {
                newExtras.push(value);
            } else if (currentCount === 1) {
                newExtras.push(value);
            } else {
                newExtras = newExtras.filter(e => e !== value);
            }

            const newCost = calculateCost(teamDoc.purchased_keywords, newExtras);
            if (newCost > teamDoc.points_total) return;

            setTeamDoc(prev => ({ ...prev, purchased_extras: newExtras }));
        }
    };


    const save = async () => {
        const currentCost = calculateCost(teamDoc.purchased_keywords, teamDoc.purchased_extras);
        const remainingPoints = teamDoc.points_total - currentCost;

        // 🔹 Count extras
        const timeWarpCount = teamDoc.purchased_extras.filter(e => e === "time_warp").length;
        const secondChanceCount = teamDoc.purchased_extras.filter(e => e === "second_chance").length;
        const speedBoostCount = teamDoc.purchased_extras.filter(e => e === "speed_boost").length;
        const problemSwapCount = teamDoc.purchased_extras.filter(e => e === "problem_swap").length;



        await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_TEAMS,
            String(teamId),
            {
                purchased_keywords: teamDoc.purchased_keywords,
                purchased_extras: teamDoc.purchased_extras,

                points_used: currentCost,
                points_remaining: remainingPoints,

                // ✅ Valid schema fields only
                extra_time_sec: timeWarpCount * 300,
                submissions_allowed: 2 + secondChanceCount,
                speed_boost_count: speedBoostCount,
                problem_swap_count: problemSwapCount,
                submissions_used: teamDoc.submissions_used || 0,
                //solved: teamDoc.solved || false,
                time_taken_sec: teamDoc.time_taken_sec || null,
            }
        );

        alert("Updated successfully");
    };


    const currentCost = teamDoc ? calculateCost(teamDoc.purchased_keywords, teamDoc.purchased_extras) : 0;
    const remainingPoints = teamDoc ? teamDoc.points_total - currentCost : 0;

    return (
        <BackgroundWrapper style={{ border: 'none' }}>
            <div style={{
                minHeight: "100vh",
                width: "100%",
                color: COLORS.text,
                fontFamily: "'Syncopate', 'Inter', sans-serif",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "60px 20px"
            }}>
                <div style={{ zIndex: 1, width: "100%", maxWidth: "800px" }}>
                    {/* Header */}
                    <header style={{ marginBottom: "40px", textAlign: "left" }}>
                        <div style={{ color: COLORS.accent, fontSize: "10px", fontFamily: "monospace", letterSpacing: "4px" }}>
                            MARKET_DATA_OVERRIDE
                        </div>
                        <h2 style={{ fontSize: "2.5rem", margin: "10px 0", fontWeight: "900" }}>
                            UPDATE PURCHASES<span style={{ color: COLORS.accent }}>_</span>
                        </h2>
                    </header>

                    {!teamDoc ? (
                        <div style={{ display: "flex", gap: "10px" }}>
                            <input
                                type="number"
                                placeholder="TEAM_ID"
                                value={teamId}
                                onChange={e => setTeamId(e.target.value)}
                                style={inputStyle}
                            />
                            <button onClick={loadTeam} style={buttonStyle(COLORS.accent)}>
                                Load Team
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "30px",
                            alignItems: "start"
                        }}>

                            {/* 🟢 TEAM INFO BAR */}
                            <div style={{
                                gridColumn: "1 / span 2",
                                border: `1px solid ${COLORS.border}`,
                                padding: "16px 20px",
                                backgroundColor: COLORS.surface,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <div>
                                    <div style={{ fontSize: "10px", color: COLORS.muted, letterSpacing: "2px" }}>
                                        TEAM IDENTIFIER
                                    </div>
                                    <div style={{ fontSize: "18px", fontWeight: "bold", color: COLORS.accent }}>
                                        #{teamDoc.team_id}
                                    </div>
                                </div>

                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "10px", color: COLORS.muted, letterSpacing: "2px" }}>
                                        TEAM NAME
                                    </div>
                                    <div style={{ fontSize: "18px", fontWeight: "bold", color: COLORS.text }}>
                                        {teamDoc.team_name}
                                    </div>
                                </div>
                            </div>

                            {/* Stats Panel */}
                            <div style={{ gridColumn: "1 / span 2", border: `1px solid ${COLORS.border}`, padding: "20px", display: "flex", justifyContent: "space-between", backgroundColor: COLORS.surface }}>
                                <StatBox label="TOTAL_BUDGET" value={teamDoc.points_total} color={COLORS.text} />
                                <StatBox label="POINTS_COMMITTED" value={currentCost} color={COLORS.error} />
                                <StatBox label="AVAILABLE_CREDIT" value={remainingPoints} color={COLORS.accent} />
                            </div>


                            {/* Keywords Column */}
                            <div style={sectionStyle}>
                                <h3 style={sectionHeaderStyle}>ENCRYPTED_KEYWORDS</h3>
                                {KEYWORDS.map(k => (
                                    <ToggleItem
                                        key={k.id}
                                        label={k.label}
                                        price={k.price}
                                        checked={teamDoc.purchased_keywords.includes(k.id)}
                                        onToggle={() => toggle("purchased_keywords", k.id)}
                                    />
                                ))}
                            </div>

                            {/* Extras Column */}
                            <div style={sectionStyle}>
                                <h3 style={sectionHeaderStyle}>SYSTEM_EXTRAS</h3>
                                {EXTRAS.map(e => {
                                    const count = teamDoc.purchased_extras.filter(x => x === e.id).length;

                                    return (
                                        <CycleItem
                                            key={e.id}
                                            label={e.label}
                                            price={getPrice(e.id, isLateMarket(teamDoc))}
                                            count={count}
                                            onClick={() => toggle("purchased_extras", e.id)}
                                        />
                                    );
                                })}
                            </div>



                            <div style={{ gridColumn: "1 / span 2", marginTop: "10px" }}>
                                <button
                                    onClick={save}
                                    style={{ ...buttonStyle(COLORS.accent), width: "100%", padding: "20px" }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BackgroundWrapper>
    );
}

// Sub-components for UI Cleanliness
const StatBox = ({ label, value, color }) => (
    <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "9px", fontFamily: "monospace", color: COLORS.muted }}>{label}</div>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", color }}>{value} 🪙</div>
    </div>
);

const ToggleItem = ({ label, price, checked, onToggle }) => (
    <div
        onClick={onToggle}
        style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "15px",
            marginBottom: "8px",
            border: `1px solid ${checked ? COLORS.accent : COLORS.border}`,
            backgroundColor: checked ? "rgba(0, 255, 156, 0.05)" : "transparent",
            cursor: "pointer",
            transition: "all 0.2s ease"
        }}
    >
        <span style={{ fontSize: "12px", color: checked ? COLORS.text : COLORS.muted }}>{label}</span>
        <span style={{ fontSize: "12px", fontFamily: "monospace", color: COLORS.accent }}>🪙 {price}</span>
    </div>
);

const inputStyle = {
    backgroundColor: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    color: COLORS.text,
    padding: "15px",
    fontFamily: "monospace",
    outline: "none",
    flexGrow: 1
};

const buttonStyle = (color) => ({
    backgroundColor: "transparent",
    border: `1px solid ${color}`,
    color: color,
    padding: "0 30px",
    fontFamily: "'Syncopate', sans-serif",
    fontSize: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease"
});

const sectionStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
};

const sectionHeaderStyle = {
    fontSize: "12px",
    letterSpacing: "2px",
    borderBottom: `1px solid ${COLORS.border}`,
    paddingBottom: "10px",
    marginBottom: "15px"
};

const CycleItem = ({ label, price, count, onClick }) => (
    <div
        onClick={onClick}
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px",
            marginBottom: "8px",
            border: `1px solid ${count > 0 ? COLORS.accent : COLORS.border}`,
            backgroundColor: count > 0 ? "rgba(0, 255, 156, 0.05)" : "transparent",
            cursor: "pointer",
            transition: "all 0.2s ease"
        }}
    >
        <span style={{ fontSize: "12px", color: COLORS.text }}>
            {label}
        </span>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontFamily: "monospace", color: COLORS.accent }}>
                🪙 {price}
            </span>

            <div style={{
                minWidth: "28px",
                textAlign: "center",
                fontSize: "12px",
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                padding: "2px 6px"
            }}>
                {count}/2
            </div>
        </div>
    </div>
);
