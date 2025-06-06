"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Register;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const auth_1 = require("../api/auth");
function Register() {
    const [firstName, setFirstName] = (0, react_1.useState)('');
    const [lastName, setLastName] = (0, react_1.useState)('');
    const [username, setUsername] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await (0, auth_1.register)(firstName, lastName, username, email, password, confirmPassword);
        if (res.ok) {
            navigate('/login');
        }
        else {
            const data = await res.json();
            setError(data.message || 'Registration failed');
        }
    };
    return ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Register" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: firstName, onChange: e => setFirstName(e.target.value), placeholder: "First Name", required: true }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: lastName, onChange: e => setLastName(e.target.value), placeholder: "Last Name", required: true }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: username, onChange: e => setUsername(e.target.value), placeholder: "Username", required: true }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: email, onChange: e => setEmail(e.target.value), placeholder: "Email", required: true }), (0, jsx_runtime_1.jsx)("input", { type: "password", value: password, onChange: e => setPassword(e.target.value), placeholder: "Password", required: true }), (0, jsx_runtime_1.jsx)("input", { type: "password", value: confirmPassword, onChange: e => setConfirmPassword(e.target.value), placeholder: "Confirm Password", required: true }), (0, jsx_runtime_1.jsx)("button", { type: "submit", children: "Sign Up" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Already have an account? ", (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => navigate('/login'), children: "Log In" })] }), error && (0, jsx_runtime_1.jsx)("p", { style: { color: 'red' }, children: error })] }));
}
