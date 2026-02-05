/* ===============================
   STORE CONFIG — GAME ECONOMY
================================= */

// 🔹 Syntax tools (unlimited use once bought)
export const KEYWORDS = [
    { id: "for", label: "`for` loop", price: 3 },
    { id: "while", label: "`while` loop", price: 3 },
    { id: "do_while", label: "`do-while` loop", price: 2 },
    { id: "if_else", label: "`if / else`", price: 4 },
    { id: "break", label: "`break`", price: 2 },
    { id: "continue", label: "`continue`", price: 2 },
    { id: "comparison_ops", label: "Comparison operators", price: 3 },
    { id: "modulo", label: "Modulo `%`", price: 2 },
    { id: "increment_decrement", label: "`++ / --`", price: 2 },
    { id: "array_access", label: "Array Access `[]`", price: 4 },
    { id: "string_access", label: "String Access", price: 4 }
];

// 🔹 Power-ups (max 2 per team)
export const EXTRAS = [
    { id: "time_warp", label: "Extra Time (+5 min)", price: 6 },
    { id: "speed_boost", label: "Speed Boost (−1 min final time)", price: 5 },
    { id: "problem_swap", label: "Problem Swap", price: 8 },
    { id: "second_chance", label: "Second Chance", price: 6 }
];

// 🔹 Base price map
export const PRICE_MAP = Object.fromEntries(
    [...KEYWORDS, ...EXTRAS].map(item => [item.id, item.price])
);

/* ===============================
   LATE MARKET PRICING
================================= */

export const getPrice = (itemId, isLate) => {
    const base = PRICE_MAP[itemId] || 0;
    return isLate ? Math.ceil(base * 1.5) : base;
};

/* ===============================
   POWER-UP LIMIT CHECK
================================= */

export const isPowerUp = (id) =>
    ["time_warp", "speed_boost", "problem_swap", "second_chance"].includes(id);

export const exceedsPowerUpLimit = (purchased) => {
    const count = purchased.filter(isPowerUp).length;
    return count >= 2;
};

export const isLateMarket = (team) => {
    if (!team.started || !team.start_time) return false;

    return true;
};

