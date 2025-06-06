"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dashboard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const auth_1 = require("../api/auth");
const react_router_dom_1 = require("react-router-dom");
function Dashboard() {
    const [user, setUser] = (0, react_1.useState)(null);
    const navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        (0, auth_1.getUser)().then(data => {
            if (data)
                setUser(data.user); // очаква се user: { username, ... }
            else
                navigate('/login');
        });
    }, []);
    const handleLogout = async () => {
        await (0, auth_1.logout)();
        navigate('/login');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { children: ["Welcome, ", user?.username, "!"] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleLogout, children: "Log Out" })] }));
}
