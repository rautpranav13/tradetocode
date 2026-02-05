const BASE = "https://sphere-proxy.rautpranav0811.workers.dev";

const LANG = {
    c: 11,
    cpp: 44,
    java: 10
};

export async function createSubmission(code, language, input) {
    const res = await fetch(`${BASE}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            compilerId: LANG[language],   // 🔥 THIS IS THE FIX
            source: code,
            input: input ?? ""
        })

    });

    const data = await res.json();
    console.log("Create submission response:", data);

    if (!data.id) throw new Error("Submission failed: " + JSON.stringify(data));

    return data.id;
}


export async function getResult(id) {
    const res = await fetch(`${BASE}/result/${id}`);
    return await res.json();
}
