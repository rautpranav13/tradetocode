import { useState } from "react";
import { databases, DATABASE_ID, COLLECTION_TEAMS } from "../lib/appwrite";
import { Query, ID } from "appwrite";

const KEYWORDS = ["for", "while", "do", "if", "else", "break", "array_access", "string_access"];
const EXTRAS = ["time_warp", "clean_slate", "problem_swap", "speed_boost"];

export default function AdminDashboard() {
    const [teamId, setTeamId] = useState("");
    const [docId, setDocId] = useState(null);
    const [keywords, setKeywords] = useState([]);
    const [extras, setExtras] = useState([]);

    const loadTeam = async () => {
        if (!teamId.trim()) return alert("Enter Team ID");

        try {
            const res = await databases.listDocuments(DATABASE_ID, COLLECTION_TEAMS, [
                Query.equal("team_id", teamId.trim())
            ]);

            if (res.documents.length > 0) {
                const doc = res.documents[0];
                setDocId(doc.$id);
                setKeywords(doc.purchased_keywords || []);
                setExtras(doc.purchased_extras || []);
                alert("Team loaded");
            } else {
                // Team does not exist → create new
                const newDoc = await databases.createDocument(
                    DATABASE_ID,
                    COLLECTION_TEAMS,
                    ID.unique(),
                    {
                        team_id: teamId.trim(),
                        team_name: "",
                        problem_id: "",
                        started: false,
                        start_time: null,
                        base_time_sec: 1800,
                        extra_time_sec: 0,
                        pause_remaining_sec: 300,
                        submissions_allowed: 1,
                        submissions_used: 0,
                        solved: false,
                        time_taken_sec: null,
                        purchased_keywords: [],
                        purchased_extras: []
                    }
                );

                setDocId(newDoc.$id);
                setKeywords([]);
                setExtras([]);
                alert("New team created");
            }
        } catch (err) {
            console.error(err);
            alert("Error loading team");
        }
    };

    const toggleKeyword = (k) => {
        setKeywords(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
    };

    const toggleExtra = (e) => {
        setExtras(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);
    };

    const saveChanges = async () => {
        if (!docId) return alert("Load team first");

        try {
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_TEAMS,
                docId,
                {
                    purchased_keywords: keywords,
                    purchased_extras: extras
                }
            );
            alert("Purchases updated");
        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Admin Dashboard</h2>

            <input
                placeholder="Enter Team ID"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
            />
            <button onClick={loadTeam}>Load / Create Team</button>

            <h3>Keywords</h3>
            {KEYWORDS.map(k => (
                <label key={k} style={{ display: "block" }}>
                    <input
                        type="checkbox"
                        checked={keywords.includes(k)}
                        onChange={() => toggleKeyword(k)}
                    />
                    {k}
                </label>
            ))}

            <h3>Extras</h3>
            {EXTRAS.map(e => (
                <label key={e} style={{ display: "block" }}>
                    <input
                        type="checkbox"
                        checked={extras.includes(e)}
                        onChange={() => toggleExtra(e)}
                    />
                    {e}
                </label>
            ))}

            <button onClick={saveChanges} style={{ marginTop: 20 }}>
                Save Purchases
            </button>
        </div>
    );
}

