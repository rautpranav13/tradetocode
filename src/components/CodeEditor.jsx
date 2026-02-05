import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";

export default function CodeEditor({ team, language, onValidChange, onCodeChange }) {
    const [code, setCode] = useState("");
    const [violations, setViolations] = useState([]);
    const [showToast, setShowToast] = useState(false);

    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const decorationsRef = useRef([]);

    /* ---------------- Validation ---------------- */
    const strip = (c) =>
        c.replace(/"([^"\\]|\\.)*"/g, "").replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");

    const validate = (val) => {
        const clean = strip(val || "");
        const notAllowed = [];
        const allowed = team.purchased_keywords || [];

        const rules = {
            for: /\bfor\b/,
            while: /\bwhile\b/,
            do_while: /\bdo\b/,
            if_else: /\bif\b|\belse\b/,
            break: /\bbreak\b/,
            continue: /\bcontinue\b/,
            comparison_ops: /<=|>=|==|!=|<|>/,
            modulo: /%/,
            increment_decrement: /\+\+|--/,
            array_access: /\[[^\]]*\]/,
            string_access: /\bstring\b|\bString\b|\bchar\s*\[/
        };


        Object.entries(rules).forEach(([key, regex]) => {
            if (!allowed.includes(key) && regex.test(clean)) {
                notAllowed.push(key);
            }
        });


        setViolations(notAllowed);
        onValidChange(notAllowed.length === 0);
    };

    useEffect(() => {
        if (violations.length > 0) setShowToast(true);
    }, [violations]);

    /* ---------------- Highlighting ---------------- */
    const HIGHLIGHT_CONFIG = {
        for: { regex: /\bfor\b/g, className: "monaco-highlight-for" },
        while: { regex: /\bwhile\b/g, className: "monaco-highlight-while" },
        if: { regex: /\bif\b/g, className: "monaco-highlight-if" },
        else: { regex: /\belse\b/g, className: "monaco-highlight-else" },
        break: { regex: /\bbreak\b/g, className: "monaco-highlight-break" },
        continue: { regex: /\bcontinue\b/g, className: "monaco-highlight-continue" }
    };

    const updateHighlights = () => {
        const editor = editorRef.current;
        const monaco = monacoRef.current;
        if (!editor || !monaco) return;

        const model = editor.getModel();
        if (!model) return;

        const newDecorations = [];

        Object.values(HIGHLIGHT_CONFIG).forEach(({ regex, className }) => {
            const matches = model.findMatches(
                regex.source,
                false,
                true,
                false,
                null,
                true
            );

            matches.forEach((m) => {
                newDecorations.push({
                    range: m.range,
                    options: { inlineClassName: className }
                });
            });
        });

        decorationsRef.current = editor.deltaDecorations(
            decorationsRef.current,
            newDecorations
        );
    };

    const handleEditorMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
        updateHighlights();
    };

    const onChange = (v) => {
        const text = v || "";
        setCode(text);
        validate(text);
        updateHighlights();
        onCodeChange?.(text); // 🔥 send code to parent
    };


    useEffect(() => {
        updateHighlights();
    }, [language]);

    /* ---------------- Render ---------------- */
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
            <div style={{
                border: "1px solid #5227FF",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 0 15px #5227FF33",
                flexGrow: 1,
                minHeight: 0
            }}>
                <Editor
                    height="100%"
                    language={language}
                    value={code || "\n\n\n\n\n\n\n\n\n\n"}
                    theme="hc-black"
                    onMount={handleEditorMount}
                    onChange={onChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        padding: { top: 10 }
                    }}
                />
            </div>

            {showToast && violations.length > 0 && (
                <div style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    background: "linear-gradient(135deg, rgba(43,10,22,0.95), rgba(58,15,31,0.95))",
                    border: "1px solid rgba(253,54,110,0.9)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    boxShadow: "0 0 25px rgba(253,54,110,0.25)",
                    maxWidth: "360px"
                }}>
                    <strong style={{ color: "#FD366E" }}>⚠ Unauthorized Syntax</strong>
                    <ul style={{ margin: "6px 0 0 18px" }}>
                        {violations.map(v => <li key={v}>{v}</li>)}
                    </ul>
                </div>
            )}

            <style>{`
        .monaco-highlight-for { color: #4EA1FF !important; font-weight: 600; }
        .monaco-highlight-while { color: #FFB86B !important; font-weight: 600; }
        .monaco-highlight-if, .monaco-highlight-else { color: #C792EA !important; font-weight: 600; }
        .monaco-highlight-break, .monaco-highlight-continue { color: #FF6B6B !important; font-weight: 600; }
      `}</style>
        </div>
    );
}
