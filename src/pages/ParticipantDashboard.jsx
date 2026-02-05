// import { useEffect, useState } from "react";
// import useContestTimer from "../hooks/useContestTimer";
// import { databases, DATABASE_ID, COLLECTION_TEAMS } from "../lib/appwrite";
// import CodeEditor from "../components/CodeEditor";
// import BackgroundWrapper from "../components/BackgroundWrapper";
// import NeoButton from "../components/NeoButton";

// import Particles from "../components/Particles"

// const EMPTY_TEAM = {
//     team_id: 0,
//     base_time_sec: 0,
//     extra_time_sec: 0,
//     pause_remaining_sec: 0,
//     points_remaining: 0,
//     submissions_allowed: 1,
//     submissions_used: 0,
//     $id: null
// };

// export default function ParticipantDashboard() {
//     const [team, setTeam] = useState(EMPTY_TEAM);
//     const [problem, setProblem] = useState(null);
//     const [isValid, setIsValid] = useState(false);
//     const [language, setLanguage] = useState("cpp");

//     useEffect(() => {
//         const t = localStorage.getItem("teamData");
//         const p = localStorage.getItem("problemData");
//         if (t) setTeam(JSON.parse(t));
//         if (p) setProblem(JSON.parse(p));
//     }, []);

//     const { remaining, pauseRemaining, isPaused, activatePause, formatTime } =
//         useContestTimer(team);

//     const isLoaded = team.team_id !== 0 && problem;

//     const refetchTeam = async () => {
//         const fresh = await databases.getDocument(
//             DATABASE_ID,
//             COLLECTION_TEAMS,
//             String(team.team_id)
//         );

//         setTeam(fresh);
//         localStorage.setItem("teamData", JSON.stringify(fresh));

//         const timerState = JSON.parse(localStorage.getItem("contest_timer_state"));
//         if (timerState && timerState.team_id === fresh.team_id) {
//             timerState.pauseRemaining = fresh.pause_remaining_sec;
//             localStorage.setItem("contest_timer_state", JSON.stringify(timerState));
//         }
//     };

//     const handlePause = async () => {
//         if (pauseRemaining <= 0 || isPaused) return;

//         activatePause();

//         await databases.updateDocument(
//             DATABASE_ID,
//             COLLECTION_TEAMS,
//             String(team.team_id),
//             { pause_remaining_sec: 0 }
//         );
//     };

//     const handleSubmit = async () => {
//         if (remaining === 0) return alert("Time up!");
//         if (team.submissions_used >= team.submissions_allowed)
//             return alert("No submissions left");

//         const updated = { submissions_used: team.submissions_used + 1 };

//         await databases.updateDocument(
//             DATABASE_ID,
//             COLLECTION_TEAMS,
//             String(team.team_id),
//             updated
//         );

//         const newTeam = { ...team, ...updated };
//         setTeam(newTeam);
//         localStorage.setItem("teamData", JSON.stringify(newTeam));

//         alert("Submission recorded");
//     };

//     return (

//         <BackgroundWrapper>
//             <div style={{
//                 display: "flex",
//                 height: "100vh",
//                 color: "#0F172A",        // dark text
//                 background: "#000000"    // light background
//             }}>

//                 <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
//                     <Particles
//                         particleColors={["#ffffff"]}
//                         particleCount={200}
//                         particleSpread={10}
//                         speed={0.1}
//                         particleBaseSize={100}
//                         moveParticlesOnHover={false}
//                         alphaParticles={false}
//                         disableRotation={false}
//                         pixelRatio={1}
//                     />
//                 </div>
//                 {!isLoaded ? (
//                     <div style={{ padding: 40 }}>Loading...</div>
//                 ) : (
//                     <>
//                         {/* LEFT SIDE — Problem */}
//                         <div style={{
//                             width: "50%",
//                             padding: 20,
//                             borderRight: "1px solid #5227FF55",
//                             overflowY: "auto"
//                         }}>
//                             <h2 style={{ color: "#6E44FF" }}>{problem.title}</h2>
//                             <p style={{ lineHeight: 1.6 }}>{problem.statement}</p>
//                         </div>

//                         {/* RIGHT SIDE */}
//                         <div style={{ width: "50%", padding: 20, display: "flex", flexDirection: "column" }}>
//                             <h3 style={{ color: "#6E44FF" }}>Team {team.team_id}</h3>

//                             <div style={{
//                                 border: "1px solid #5227FF",
//                                 borderRadius: 8,
//                                 padding: 12,
//                                 marginBottom: 20,
//                                 boxShadow: "0 0 10px #5227FF44"
//                             }}>
//                                 <h3>⏱ {formatTime(remaining)}</h3>
//                                 <p className="text-black">
//                                     Pause Remaining: {formatTime(pauseRemaining)}
//                                 </p>

//                                 {isPaused && <p>⏸ Pause Active</p>}
//                                 <NeoButton onClick={handlePause} disabled={pauseRemaining === 0 || isPaused}>
//                                     Use Pause
//                                 </NeoButton>
//                             </div>

//                             <p>Points Remaining: {team.points_remaining}</p>
//                             <p>Submissions Left: {team.submissions_allowed - team.submissions_used}</p>

//                             <NeoButton onClick={refetchTeam}>Refetch Purchases</NeoButton>

//                             <div style={{ marginTop: 20, flexGrow: 1 }}>
//                                 <CodeEditor
//                                     team={team}
//                                     onValidChange={setIsValid}
//                                     onLanguageChange={setLanguage}
//                                 />
//                             </div>

//                             <NeoButton
//                                 onClick={handleSubmit}
//                                 disabled={!isValid || remaining === 0}
//                             >
//                                 Submit Code
//                             </NeoButton>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </BackgroundWrapper>
//     );
// }


import { useEffect, useState } from "react";
import useContestTimer from "../hooks/useContestTimer";
import { databases, DATABASE_ID, COLLECTION_TEAMS, COLLECTION_PROBLEMS } from "../lib/appwrite";
import CodeEditor from "../components/CodeEditor";
import BackgroundWrapper from "../components/BackgroundWrapper";
import NeoButton from "../components/NeoButton";
import { createSubmission, getResult } from "../lib/sphereEngine";
import { Query } from "appwrite";


// Constants for Appwrite-style UI
const COLORS = {
    bg: "#0B0C0E",
    surface: "#161618",
    border: "#2C2C2E",
    primary: "#FD366E", // Appwrite Pink
    secondary: "#818CF8",
    textMain: "#E4E4E7",
    textMuted: "#A1A1AA"
};

const EMPTY_TEAM = {
    team_id: 0,
    base_time_sec: 0,
    extra_time_sec: 0,
    pause_remaining_sec: 0,
    points_remaining: 0,
    submissions_allowed: 1,
    submissions_used: 0,
    $id: null
};

export default function ParticipantDashboard() {
    const [team, setTeam] = useState(EMPTY_TEAM);
    const [problem, setProblem] = useState(null);
    const [isValid, setIsValid] = useState(false);
    const [language, setLanguage] = useState("cpp");
    const [code, setCode] = useState("");


    // Load cached data
    useEffect(() => {
        const t = localStorage.getItem("teamData");
        const p = localStorage.getItem("problemData");
        if (t) setTeam(JSON.parse(t));
        if (p) setProblem(JSON.parse(p));
    }, []);

    // Always fetch fresh problem (with hidden test cases)
    useEffect(() => {
        const fetchProblem = async () => {
            if (!team.problem_id) return;

            const freshProblem = await databases.getDocument(
                DATABASE_ID,
                COLLECTION_PROBLEMS,
                team.problem_id
            );

            console.log("🧪 Loaded problem from DB:", freshProblem);
            setProblem(freshProblem);
            localStorage.setItem("problemData", JSON.stringify(freshProblem));
        };

        const initStart = async () => {
            if (!team.team_id || team.started) return;

            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_TEAMS,
                String(team.team_id),
                {
                    started: true,
                    start_time: Date.now()
                }
            );

            setTeam(prev => ({ ...prev, started: true, start_time: Date.now() }));
        };


        fetchProblem();
        initStart();
    }, [team.problem_id]);

    const { remaining, usedExtra, speedUsed, extendTime, applySpeedBoost, formatTime } = useContestTimer(team);

    const extensionLeft = (team.extra_time_sec || 0) - usedExtra;
    const canExtend = extensionLeft > 0;

    const isLoaded = team.team_id !== 0 && problem;

    const refetchTeam = async () => {
        const fresh = await databases.getDocument(DATABASE_ID, COLLECTION_TEAMS, String(team.team_id));
        setTeam(fresh);
        localStorage.setItem("teamData", JSON.stringify(fresh));
    };

    const normalize = (txt) =>
        (txt || "")
            .replace(/\r\n/g, "\n")
            .trim();

    const handleSubmit = async () => {
        console.log("🟡 Submit clicked");

        try {
            if (!isValid) return alert("Code contains unpurchased syntax!");
            if (!code.trim()) return alert("No code!");
            if (remaining === 0) return alert("Time up!");
            if (team.submissions_used >= team.submissions_allowed)
                return alert("No submissions left");

            console.log("📤 Sending submission...");
            const hiddenInput = problem.test_case_input || "";
            const id = await createSubmission(code, language, hiddenInput);

            console.log("🆔 Submission ID:", id);

            let result;
            while (true) {
                await new Promise(r => setTimeout(r, 1500));
                result = await getResult(id);
                console.log("📥 Status:", result.result?.status);
                if (!result.executing) break;
            }

            console.log("✅ Final Result:", result);

            let outputText = "";
            let errorText = "";

            const streams = result.result?.streams;

            // 🔹 FETCH OUTPUT THROUGH YOUR WORKER PROXY
            if (streams?.output?.uri) {
                const proxy =
                    "https://sphere-proxy.rautpranav0811.workers.dev/file?uri=" +
                    encodeURIComponent(streams.output.uri);

                const res = await fetch(proxy);
                outputText = await res.text();
            }

            // 🔹 FETCH ERROR FILE THROUGH WORKER
            if (streams?.error?.uri) {
                const errProxy =
                    "https://sphere-proxy.rautpranav0811.workers.dev/file?uri=" +
                    encodeURIComponent(streams.error.uri);

                const errRes = await fetch(errProxy);
                errorText = await errRes.text();
            }

            const expectedOutput = normalize(problem.test_case_output);
            const userOutput = normalize(outputText);

            console.log("🧾 Expected:", JSON.stringify(expectedOutput));
            console.log("🧾 User:", JSON.stringify(userOutput));

            // Runtime / compile errors first
            if (errorText.trim()) {
                alert("💥 Runtime / Compilation Error\n\n" + errorText);
                return;
            }

            // ⏱ Calculate raw time taken
            const timerState = JSON.parse(localStorage.getItem("contest_timer_state"));
            const rawTimeTaken = Math.floor((Date.now() - timerState.startTime) / 1000);

            // ⚡ Apply speed boost
            const speedReduction = timerState.speedUsed * 60;
            const finalTimeTaken = Math.max(rawTimeTaken - speedReduction, 0);

            console.log("⏱ Raw time:", rawTimeTaken);
            console.log("⚡ Speed reduction:", speedReduction);
            console.log("🏁 Final recorded time:", finalTimeTaken);

            // Save to DB
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_TEAMS,
                String(team.team_id),
                {
                    solved: true,
                    time_taken_sec: finalTimeTaken
                }
            );

            // Judge comparison
            // Judge comparison FIRST
            if (userOutput === expectedOutput) {
                alert("✅ Accepted\n\nOutput:\n" + userOutput);

                const timerState = JSON.parse(localStorage.getItem("contest_timer_state")) || {};
                const rawTimeTaken = Math.floor((Date.now() - (timerState.startTime || Date.now())) / 1000);
                const speedReduction = (timerState.speedUsed || 0) * 60;
                const finalTimeTaken = Math.max(rawTimeTaken - speedReduction, 0);

                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTION_TEAMS,
                    String(team.team_id),
                    {
                        solved: true,
                        time_taken_sec: finalTimeTaken
                    }
                );

            } else {
                alert(
                    "❌ Wrong Answer\n\nYour Output:" +
                    userOutput
                );
            }


            const updated = { submissions_used: team.submissions_used + 1 };
            await databases.updateDocument(DATABASE_ID, COLLECTION_TEAMS, String(team.team_id), updated);
            setTeam(prev => ({ ...prev, ...updated }));
            localStorage.setItem("teamData", JSON.stringify({ ...team, ...updated }));


        } catch (err) {
            console.error("💥 Submission error:", err);
            alert("Submission failed. Check console.");
        }
    };


    const handleProblemSwap = async () => {
        if (team.problem_swap_count <= 0)
            return alert("No problem swaps available");

        if (team.solved) return alert("Problem already solved");

        try {
            // 🔎 Get problems of same difficulty except current
            const res = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_PROBLEMS,
                [
                    Query.equal("difficulty", problem.difficulty),
                    Query.notEqual("$id", problem.$id),
                    Query.limit(50)
                ]
            );

            if (!res.documents.length)
                return alert("No alternative problems available");

            // 🎲 Pick random new problem
            const newProblem =
                res.documents[Math.floor(Math.random() * res.documents.length)];

            // 🧠 Update DB
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_TEAMS,
                String(team.team_id),
                {
                    problem_id: newProblem.$id,
                    problem_swap_count: team.problem_swap_count - 1
                }
            );

            // 🧹 Reset local code
            setCode("");
            localStorage.removeItem("problemData");

            // 🔄 Update state
            setTeam(prev => ({
                ...prev,
                problem_id: newProblem.$id,
                problem_swap_count: prev.problem_swap_count - 1
            }));

            setProblem(newProblem);

            alert("🔁 Problem swapped successfully!");

        } catch (err) {
            console.error(err);
            alert("Swap failed");
        }
    };


    return (
        <BackgroundWrapper>
            <div style={{
                display: "flex",
                height: "100vh",
                color: COLORS.textMain,
                background: COLORS.bg,
                fontFamily: "'Inter', sans-serif",
                position: "relative",
                overflow: "hidden"
            }}>
                {!isLoaded ? (
                    <div style={{ margin: "auto", zIndex: 1, color: COLORS.primary }}>
                        <div className="loader">Initializing Terminal...</div>
                    </div>
                ) : (
                    <div style={{ display: "flex", width: "100%", zIndex: 1, padding: "16px", gap: "16px" }}>

                        {/* LEFT SIDE — Problem Description */}
                        <div style={{
                            width: "45%",
                            backgroundColor: "rgba(22, 22, 24, 0.7)",
                            backdropFilter: "blur(12px)",
                            borderRadius: "12px",
                            border: `1px solid ${COLORS.border}`,
                            padding: "32px",
                            display: "flex",
                            flexDirection: "column",
                            overflowY: "auto"
                        }}>
                            <div style={{ marginBottom: "24px" }}>
                                <span style={{ color: COLORS.primary, fontSize: "12px", fontWeight: "bold", letterSpacing: "1.5px" }}>PROBLEM STATEMENT</span>
                                <h1 style={{ fontSize: "2rem", marginTop: "8px", fontWeight: "700" }}>{problem.title}</h1>
                            </div>
                            <div style={{
                                color: COLORS.textMuted,
                                lineHeight: "1.8",
                                fontSize: "1.05rem",
                                whiteSpace: "pre-wrap",
                                fontFamily: "'JetBrains Mono', monospace"
                            }}>
                                {problem.statement}
                            </div>

                            {problem.input_format && (
                                <>
                                    <SectionTitle>INPUT FORMAT</SectionTitle>
                                    <div style={psBlock}>{problem.input_format}</div>
                                </>
                            )}

                            {problem.output_format && (
                                <>
                                    <SectionTitle>OUTPUT FORMAT</SectionTitle>
                                    <div style={psBlock}>{problem.output_format}</div>
                                </>
                            )}

                            {problem.example_test_case_input && (
                                <>
                                    <SectionTitle>EXAMPLE INPUT</SectionTitle>
                                    <CodeBlock>{problem.example_test_case_input}</CodeBlock>
                                </>
                            )}

                            {problem.example_test_case_output && (
                                <>
                                    <SectionTitle>EXAMPLE OUTPUT</SectionTitle>
                                    <CodeBlock>{problem.example_test_case_output}</CodeBlock>
                                </>
                            )}



                        </div>

                        {/* RIGHT SIDE — Controls & Editor */}
                        <div style={{ width: "55%", display: "flex", flexDirection: "column", gap: "16px" }}>

                            {/* Stats Bar */}
                            <div style={{
                                backgroundColor: COLORS.surface,
                                borderRadius: "12px",
                                border: `1px solid ${COLORS.border}`,
                                padding: "20px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <div>
                                    <p style={{ fontSize: "12px", color: COLORS.textMuted, margin: 0 }}>TIME REMAINING</p>
                                    <h2 style={{ margin: 0, color: remaining < 300 ? COLORS.primary : COLORS.textMain }}>
                                        {formatTime(remaining)}
                                    </h2>
                                </div>

                                <div style={{ textAlign: "right", display: "flex", gap: "24px" }}>
                                    <StatItem label="POINTS" value={team.points_remaining} />
                                    <StatItem label="ATTEMPTS" value={`${team.submissions_allowed - team.submissions_used} left`} />
                                </div>
                            </div>

                            {/* Purchased Items Bar */}
                            <PurchasedBar team={team} />

                            {/* Code Editor Container */}
                            <div style={{
                                flexGrow: 1,
                                backgroundColor: COLORS.surface,
                                borderRadius: "12px",
                                border: `1px solid ${COLORS.border}`,
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column"
                            }}>
                                <div style={{ padding: "10px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span style={{ fontSize: "13px", color: COLORS.textMuted }}>main.</span>
                                        <select
                                            value={language}
                                            onChange={e => setLanguage(e.target.value)}
                                            style={{
                                                background: "transparent",
                                                border: `1px solid ${COLORS.border}`,
                                                color: COLORS.textMain,
                                                padding: "2px 6px",
                                                borderRadius: "4px",
                                                fontSize: "12px"
                                            }}
                                        >
                                            <option value="cpp">CPP</option>
                                            <option value="c">C</option>
                                            <option value="java">JAVA</option>
                                        </select>
                                    </div>

                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <SmallActionButton onClick={extendTime} disabled={!canExtend}>
                                            {canExtend ? `EXTEND TIME (+5:00)` : "NO EXTENSIONS"}
                                        </SmallActionButton>

                                        <SmallActionButton
                                            onClick={applySpeedBoost}
                                            disabled={speedUsed >= team.speed_boost_count}
                                        >
                                            {speedUsed < team.speed_boost_count
                                                ? `SPEED BOOST (-1:00)`
                                                : "NO BOOSTS"}
                                        </SmallActionButton>

                                        <SmallActionButton
                                            onClick={handleProblemSwap}
                                            disabled={team.problem_swap_count <= 0}
                                        >
                                            {team.problem_swap_count > 0
                                                ? `SWAP PROBLEM (${team.problem_swap_count})`
                                                : "NO SWAPS"}
                                        </SmallActionButton>


                                        <SmallActionButton onClick={refetchTeam}>
                                            REFETCH
                                        </SmallActionButton>
                                    </div>

                                </div>
                                <div style={{ flexGrow: 1 }}>
                                    <CodeEditor
                                        key={problem.$id}
                                        team={team}
                                        language={language}     // 🔥 REQUIRED
                                        onValidChange={setIsValid}
                                        onCodeChange={setCode}
                                    />
                                </div>
                            </div>

                            <NeoButton
                                onClick={handleSubmit}
                                disabled={!isValid || remaining === 0}
                                style={{
                                    height: "56px",
                                    fontSize: "16px",
                                    background: isValid ? COLORS.primary : COLORS.border,
                                    borderRadius: "12px",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                SUBMIT SOLUTION
                            </NeoButton>
                        </div>
                    </div>
                )}
            </div>
        </BackgroundWrapper>
    );
}

// Sub-components for cleaner code
const StatItem = ({ label, value }) => (
    <div>
        <p style={{ fontSize: "10px", color: COLORS.textMuted, margin: 0, letterSpacing: "1px" }}>{label}</p>
        <p style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>{value}</p>
    </div>
);

const SmallActionButton = ({ children, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            background: "transparent",
            border: `1px solid ${COLORS.border}`,
            color: disabled ? "#444" : COLORS.textMain,
            padding: "4px 12px",
            borderRadius: "6px",
            fontSize: "11px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            ":hover": { borderColor: COLORS.primary } // Apply via CSS classes in real app
        }}
    >
        {children}
    </button>
);

const PurchasedBar = ({ team }) => {
    const keywords = team.purchased_keywords?.join(", ") || "None";
    const extras = team.purchased_extras?.join(", ") || "None";

    return (
        <div style={{
            backgroundColor: COLORS.surface,
            borderRadius: "12px",
            border: `1px solid ${COLORS.border}`,
            padding: "18px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "13px"
        }}>
            <div>
                <p style={{ fontSize: "10px", color: COLORS.textMuted, margin: 0 }}>PURCHASED KEYWORDS</p>
                <p style={{ margin: 0, color: COLORS.textMain }}>{keywords}</p>
            </div>

            <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "10px", color: COLORS.textMuted, margin: 0 }}>SYSTEM EXTRAS</p>
                <p style={{ margin: 0, color: COLORS.secondary }}>{extras}</p>
            </div>
        </div>
    );
};

const SectionTitle = ({ children }) => (
    <h3 style={{
        marginTop: "28px",
        marginBottom: "8px",
        fontSize: "13px",
        color: COLORS.secondary,
        letterSpacing: "1px"
    }}>
        {children}
    </h3>
);

const psBlock = {
    color: COLORS.textMuted,
    lineHeight: "1.8",
    fontSize: "1.05rem",
    whiteSpace: "pre-wrap",
    fontFamily: "'JetBrains Mono', monospace"
};

const CodeBlock = ({ children }) => (
    <div style={{
        background: "#0F0F11",
        border: `1px solid ${COLORS.border}`,
        padding: "12px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#e4e4e7",
        whiteSpace: "pre-wrap"
    }}>
        {children}
    </div>
);
