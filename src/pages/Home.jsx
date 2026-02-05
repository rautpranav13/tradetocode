// import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundWrapper from "../components/BackgroundWrapper";
import Particles from "../components/Particles";

const COLORS = {
    bg: "#050505",
    card: "#0F0F12",
    border: "#1F1F23",
    accent: "#FD366E", 
    // cyan: "#00F0FF",
    text: "#F4F4F5"
};

export default function Home() {
    // const navigate = useNavigate();

    // React.useEffect(() => {
    //     // Remove default browser spacing
    //     document.body.style.margin = "0";
    //     document.body.style.padding = "0";
    //     document.body.style.backgroundColor = COLORS.bg;

    //     // Ensure the root container doesn't have an outline or overflow issue
    //     const root = document.getElementById('root');
    //     if (root) {
    //         root.style.backgroundColor = COLORS.bg;
    //         root.style.border = "none";
    //     }
    // }, []);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.backgroundColor = COLORS.bg;
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <BackgroundWrapper>
            <div style={{
                minHeight: "100vh",
                height: "100vh",
                backgroundColor: COLORS.bg,
                color: COLORS.text,
                fontFamily: "'Syncopate', 'Inter', sans-serif", // Using a wider, more tech-forward font
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                border: "none",   // Final safeguard
                outline: "none"
            }}>
                
                {/* Particle Container with Top Masking */}
                <div style={{ 
                    position: "absolute", 
                    inset: 0, 
                    zIndex: 1,
                    maskImage: "linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 90%)",
                    WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 90%)"
                }}>
                    <Particles 
                        particleColors={[COLORS.accent, "#FFFFFF"]} 
                        speed={0.15} 
                        particleCount={120}
                        particleBaseSize={120}
                    />
                </div>

                {/* <main style={{ 
                    zIndex: 1, 
                    padding: "80px 10%", 
                    display: "flex", 
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100%" 
                }}> */}
                <main style={{ 
                    zIndex: 1, 
                    padding: isMobile ? "40px 20px" : "80px 10%", 
                    display: "flex", 
                    flexDirection: "column",
                    justifyContent: "center",
                    minHeight: "100vh" 
                }}>
                    
                    {/* Typography Overhaul */}
                    {/* <div style={{ marginBottom: "80px" }}> */}
                    <div style={{ marginBottom: isMobile ? "40px" : "80px" }}>
                        <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "12px", 
                            marginBottom: "10px",
                            fontFamily: "monospace",
                            color: COLORS.accent,
                            letterSpacing: "4px",
                            fontSize: "12px"
                        }}>
                            <span style={{ width: "40px", height: "1px", background: COLORS.accent }}></span>
                            TERMINAL_SESSION_v1.0
                        </div>
                        
                        {/* <h1 style={{ 
                            fontSize: "clamp(3rem, 8vw, 6rem)", 
                            fontWeight: "900", 
                            lineHeight: "0.9",
                            margin: 0,
                            letterSpacing: "-2px",
                            textTransform: "uppercase"
                        }}>
                            TRADE<span style={{ color: COLORS.accent }}>.</span><br />
                            TO<br />
                            <span style={{ 
                                color: "transparent", 
                                WebkitTextStroke: `1px ${COLORS.text}`,
                                opacity: 0.8
                            }}>CODE</span>
                        </h1> */}
                        <h1 style={{ 
                            fontSize: isMobile ? "3rem" : "clamp(3rem, 8vw, 6rem)", 
                            fontWeight: "900", 
                            lineHeight: "0.9",
                            margin: 0,
                            letterSpacing: "-2px",
                        }}>
                            TRADE<span style={{ color: COLORS.accent }}>.</span><br />
                            TO<br />
                            <span style={{ 
                                color: "transparent", 
                                WebkitTextStroke: isMobile ? "0.5px #F4F4F5" : "1px #F4F4F5",
                            }}>CODE</span>
                        </h1>
                    </div>

                    {/* Navigation Menu - List Style for Professional Feel */}
                    {/* <div style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: "2px", 
                        maxWidth: "500px",
                        borderTop: `1px solid ${COLORS.border}`
                    }}> */}
                    <div style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        width: "100%",
                        maxWidth: "500px",
                        borderTop: `1px solid ${COLORS.border}`
                    }}>
                        <MenuLink 
                            number="01" 
                            label="PARTICIPANT_LOGIN" 
                            desc="Access your trading terminal"
                            onClick={() => navigate("/participant")}
                        />
                        <MenuLink 
                            number="02" 
                            label="CREATE_TEAM" 
                            desc="Register a new team"
                            onClick={() => navigate("/admin/add-team")}
                        />
                        <MenuLink 
                            number="03" 
                            label="UPDATE_TEAM" 
                            desc="Modify existing parameters"
                            onClick={() => navigate("/admin/update-team")}
                        />
                    </div>
                </main>

                {/* Aesthetic Detail Sidebar */}
                {!isMobile && (
                <div style={{
                    position: "absolute",
                    right: "40px",
                    bottom: "40px",
                    writingMode: "vertical-rl",
                    fontFamily: "monospace",
                    fontSize: "10px",
                    color: "#444",
                    letterSpacing: "5px"
                }}>
                    EST. 2026 // TRADE.TO.CODE_ENGINE // VIDYOTAN
                </div>
                )}
            </div>
        </BackgroundWrapper>
    );
}

function MenuLink({ number, label, desc, onClick }) {
    const [hover, setHover] = useState(false);

    return (
        <div 
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: "flex",
                alignItems: "center",
                padding: "24px 0",
                borderBottom: `1px solid ${COLORS.border}`,
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden"
            }}
        >
            <span style={{ 
                fontFamily: "monospace", 
                fontSize: "14px", 
                color: hover ? COLORS.accent : "#444",
                marginRight: "40px",
                transition: "color 0.3s ease"
            }}>
                {number}
            </span>
            
            <div style={{ flexGrow: 1 }}>
                <h2 style={{ 
                    margin: 0, 
                    fontSize: "1.2rem", 
                    fontWeight: "600",
                    letterSpacing: "2px",
                    color: hover ? COLORS.accent : COLORS.text,
                    transform: hover ? "translateX(10px)" : "translateX(0)",
                    transition: "all 0.3s ease"
                }}>
                    {label}
                </h2>
                <p style={{ 
                    margin: 0, 
                    fontSize: "12px", 
                    color: "#666", 
                    opacity: hover ? 1 : 0.6,
                    transform: hover ? "translateX(10px)" : "translateX(0)",
                    transition: "all 0.3s ease"
                }}>
                    {desc}
                </p>
            </div>

            {/* Hover Indicator */}
            {hover && (
                <div style={{ 
                    width: "8px", 
                    height: "8px", 
                    background: COLORS.accent, 
                    borderRadius: "50%",
                    boxShadow: `0 0 15px ${COLORS.accent}`
                }} />
            )}
        </div>
    );
}