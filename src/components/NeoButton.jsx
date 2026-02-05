export default function NeoButton({ children, onClick, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "1px solid #5227FF",
                background: disabled ? "#333" : "linear-gradient(90deg, #5227FF, #6E44FF)",
                color: "white",
                cursor: disabled ? "not-allowed" : "pointer",
                boxShadow: disabled ? "none" : "0 0 12px #5227FF66",
                transition: "all 0.2s ease",
                marginTop: "10px"
            }}
        >
            {children}
        </button>
    );
}
