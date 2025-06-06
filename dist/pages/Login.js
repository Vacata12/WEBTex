"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Login;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const auth_1 = require("../api/auth");
function Login() {
    const [username, setUsername] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await (0, auth_1.login)(username, password);
        if (res.ok) {
            navigate('/dashboard');
        }
        else {
            const data = await res.json();
            setError(data.message || 'Invalid username or password');
        }
    };
    return ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Login" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: username, onChange: e => setUsername(e.target.value), placeholder: "Username", required: true }), (0, jsx_runtime_1.jsx)("input", { type: "password", value: password, onChange: e => setPassword(e.target.value), placeholder: "Password", required: true }), (0, jsx_runtime_1.jsx)("button", { type: "submit", children: "Log In" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Don't have an account? ", (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => navigate('/register'), children: "Sign Up" })] }), error && (0, jsx_runtime_1.jsx)("p", { style: { color: 'red' }, children: error })] }));
}
