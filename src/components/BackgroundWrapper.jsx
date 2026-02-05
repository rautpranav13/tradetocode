import Particles from "./Particles";

const COLORS = {
    bg: "#050505",
    accent: "#FD366E",
};

export default function BackgroundWrapper({ children }) {
    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                minHeight: "100vh",   // 🔥 allow content growth
                background: COLORS.bg,
            }}
        >
            {/* 🌌 Fixed Background */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            >
                <Particles
                    particleColors={[COLORS.accent, "#FFFFFF"]}
                    speed={0.1}
                    particleCount={150}
                    particleBaseSize={150}
                />
            </div>

            {/* 🧱 Scrollable Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {children}
            </div>
        </div>
    );
}
