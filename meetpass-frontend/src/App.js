import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useParams,
  useLocation,
  useInRouterContext,
} from "react-router-dom";

/* --------------------------- Helper: Safe Router --------------------------- */
function MaybeWrapWithRouter({ children }) {
  const inCtx = useInRouterContext();
  return inCtx ? children : <BrowserRouter>{children}</BrowserRouter>;
}

/* ----------------------------- Reusable Styles ---------------------------- */
const colors = {
  bg: "#F2ECFF",
  panel: "#FFFFFF",
  primary: "#7C3AED",
  primaryDark: "#6D28D9",
  accent: "#A78BFA",
  text: "#2F275B",
  green: "#16a34a",
  red: "#dc2626",
  yellow: "#ca8a04",
  sidebar: "#4C1D95",
};

const s = {
  app: { display: "flex", minHeight: "100vh", background: colors.bg, color: colors.text },
  sidebar: { width: 240, background: colors.sidebar, color: "#fff", padding: 20, display: "flex", flexDirection: "column", gap: 12 },
  brand: { fontWeight: 800, letterSpacing: 0.5, fontSize: 22, marginBottom: 8 },
  link: { color: "white", textDecoration: "none", padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.08)" },
  linkActive: { background: "rgba(255,255,255,0.18)" },
  logout: { marginTop: 12, background: "#ef4444", border: "none", color: "white", padding: "10px 12px", borderRadius: 10, cursor: "pointer" },
  main: { flex: 1, padding: 24, display: "flex", justifyContent: "center", alignItems: "flex-start" },
  card: { width: "100%", maxWidth: 760, background: colors.panel, borderRadius: 16, padding: 20, boxShadow: "0 10px 30px rgba(0,0,0,.08)" },
  h1: { fontSize: 26, margin: "0 0 16px", color: colors.text },
  h2: { fontSize: 20, margin: "0 0 12px", color: colors.text },
  input: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", outline: "none" },
  textarea: { width: "100%", minHeight: 90, padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", outline: "none", resize: "vertical" },
  row: { display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0,1fr))" },
  btnPrimary: { background: colors.primary, color: "white", border: "none", padding: "10px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 600 },
  btnGhost: {
  background: "transparent",
  color: colors.primary,
  border: `1px solid ${colors.primary}`,
  padding: "10px 14px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600,
},

  tag: { fontSize: 12, padding: "4px 8px", borderRadius: 999, display: "inline-block", fontWeight: 700 },
};

/* ------------------------------ Auth Helpers ------------------------------ */
const getUserEmail = () => sessionStorage.getItem("userEmail");

/* ------------------------------ Sidebar ------------------------------ */
function Sidebar() {
  const email = getUserEmail();
  const nav = [
    { to: "/home", label: " Home" },
    { to: "/schedule", label: "Schedule Meeting" },
    { to: "/view-meetings", label: "View Meetings" },
  ];
  const navigate = useNavigate();

  const onLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };
  if (!email) return null;

  return (
    <aside style={s.sidebar}>
      <div style={s.brand}>MeetPass</div>
      {nav.map((n) => (
        <Link key={n.to} to={n.to} style={s.link}>
          {n.label}
        </Link>
      ))}
      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to logout?")) onLogout();
        }}
        style={s.logout}
      >
        Logout
      </button>
    </aside>
  );
}

/* ------------------------------ Login Page ------------------------------ */
function LoginRegNo() {
  const [regno, setRegno] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const BASE_URL = "https://meetpass-backend.onrender.com";

  const submit = async (e) => {
    e.preventDefault();
    try {
    const res = await axios.post(`${BASE_URL}/login-regno`, { regno, password });
// Save user info for Private route check
    localStorage.setItem("userRegNo", regno);
navigate(`/dashboard/${regno}`);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ maxWidth: 420, width: "100%", border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
        <h1>Login</h1>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="text" placeholder="Enter your RegNo" value={regno} onChange={(e) => setRegno(e.target.value)} style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }} required />
          <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }} required />
          <button type="submit" style={{ padding: 12, borderRadius: 8, backgroundColor: "#7C3AED", color: "#fff", border: "none", cursor: "pointer" }}> Login </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 12 }}>Don't have an account? <Link to="/signup" style={{ color: "#7C3AED", textDecoration: "none", fontWeight: 600 }}>Sign up</Link></p>
        <p style={{ textAlign: "center", marginTop: 8 }}><Link to="/forgot-password" style={{ color: "#EF4444", textDecoration: "none" }}>Forgot Password?</Link></p>
      </div>
    </div>
  );
}

/* ------------------------------ Dashboard ------------------------------ */
function Dashboard() {
  const { regno } = useParams();
  const [user, setUser] = useState(null);
  const BASE_URL = "https://meetpass-backend.onrender.com";

  useEffect(() => {
   axios.get(`${BASE_URL}/dashboard/${regno}`)
  .then(res => setUser(res.data.user))
  .catch(err => console.error(err));

  }, [regno]);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>Welcome, {user.name}</h1>
      <div style={{ marginTop: 20, lineHeight: 2 }}>
        <p><strong>Registration Number:</strong> {user.regno}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
      <button style={{ marginTop: 20, padding: 10, borderRadius: 8, backgroundColor: "#7C3AED", color: "#fff", border: "none", cursor: "pointer" }} onClick={() => alert("Feature coming soon!")}>
        View Notifications
      </button>
    </div>
  );
}

/* ------------------------------- Sign Up Page ------------------------------- */
function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [regno, setRegno] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState("");

  const BASE_URL = "https://meetpass-backend.onrender.com";

  const submit = async (e) => {
    e.preventDefault();

    // Validate regno
    const regnoPattern = /^[0-9][A-Za-z0-9]{4,}$/;
    if (!regnoPattern.test(regno)) {
      return alert("Registration number must start with a number and be at least 5 characters long.");
    }

    // Check required fields
    if (!regno || !email || !pwd || !role || !name) {
      return alert("Please fill in all fields");
    }

    try {
      const res = await axios.post(`${BASE_URL}/signup`, {
        regno,
        name,
        email,
        password: pwd,
        role,
      });

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong during sign up.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: "100%",
          border: "1px solid #ddd",
          padding: 20,
          borderRadius: 8,
        }}
      >
        <h1 style={{ marginBottom: 16 }}>MeetPass Sign Up</h1>
        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
            required
          />
          <input
            type="text"
            placeholder="Registration Number"
            value={regno}
            onChange={(e) => setRegno(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
            required
          />
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
            required
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
          </select>
          <button
            type="submit"
            style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: "#7C3AED",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 12 }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#7C3AED",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
/* ------------------------------- Forgot Password ------------------------------- */
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const BASE_URL = "https://meetpass-backend.onrender.com";

  const submit = async (e) => {
    e.preventDefault();
    try {
     const res = await axios.post(`${BASE_URL}/forgot-password`, { email });

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ maxWidth: 420, width: "100%", border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
        <h1>Forgot Password</h1>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }} required />
          <button type="submit" style={{ padding: 12, borderRadius: 8, backgroundColor: "#7C3AED", color: "#fff", border: "none", cursor: "pointer" }}>Send Reset Link</button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------- Reset Password ------------------------------- */
function ResetPassword() {
  const { token } = useParams();
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();
  const BASE_URL = "https://meetpass-backend.onrender.com";

  const submit = async (e) => {
    e.preventDefault();
    try {
    const res = await axios.post(`${BASE_URL}/reset-password/${token}`, { newPassword: pwd });
      alert(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ maxWidth: 420, width: "100%", border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
        <h1>Reset Password</h1>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="password" placeholder="New Password" value={pwd} onChange={(e) => setPwd(e.target.value)} style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }} required />
          <button type="submit" style={{ padding: 12, borderRadius: 8, backgroundColor: "#7C3AED", color: "#fff", border: "none", cursor: "pointer" }}>Reset Password</button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------- Home Page ------------------------------- */
function Home() {
  const userName = sessionStorage.getItem("name");
  return (
    <div style={{ textAlign: "center", marginTop: 240, fontSize: 24, fontWeight: "bold", color: "#4C1D95" }}>
     Welcome to MeetPass {userName ? `, ${userName}` : ""}

    </div>
  );
}

/* --------------------------- Schedule Meeting --------------------------- */
function Schedule() {
  const scheduler = getUserEmail();
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();
  const [participantEmail, setParticipantEmail] = useState("");
  const [purpose, setPurpose] = useState("");
  const [venue, setVenue] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [participants, setParticipants] = useState([]);

 const token = useMemo(() => `SJU-${Math.random().toString(36).slice(2, 5).toUpperCase()}`, []);


  const submit = async (e) => {
    e.preventDefault();
    const meetingData = { scheduler, status: role === "staff" ? "Approved" : "Pending", participantEmail, purpose, venue, startTime, endTime, isGroup, participants, token };
   try {
  const BASE_URL = "https://meetpass-backend.onrender.com";
  await axios.post(`${BASE_URL}/meetings`, meetingData);
  alert(`✅ Meeting Scheduled\nToken: ${token}\nStatus: ${meetingData.status}`);
  navigate("/view-meetings");
} catch (err) {
  console.error("Error scheduling meeting:", err);
  alert("❌ Failed to schedule meeting");
}

  };

  return (
    <div style={s.main}>
      <div style={s.card}>
        <h1 style={s.h1}>Schedule a Meeting</h1>
        <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={s.h2}>Meeting With</label>
            <input style={s.input} type="email" placeholder="Enter email" value={participantEmail} onChange={(e) => setParticipantEmail(e.target.value)} required />
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <label style={s.h2}>Group Meeting</label>
            <input type="checkbox" checked={isGroup} onChange={(e) => setIsGroup(e.target.checked)} />
          </div>
          {isGroup && (
            <div>
              <label style={s.h2}>Participants (multi-select)</label>
              <MultiSelect placeholder="Type a name/email and press Enter" values={participants} setValues={setParticipants} />
            </div>
          )}
          <div>
            <label style={s.h2}>Purpose of Meeting</label>
            <textarea style={s.textarea} placeholder="Describe the purpose of the meeting" value={purpose} onChange={(e) => setPurpose(e.target.value)} required />
          </div>
          <div>
            <label style={s.h2}>Venue</label>
            <input style={s.input} placeholder="Room / Hall / Online link" value={venue} onChange={(e) => setVenue(e.target.value)} required />
          </div>
          <div style={s.row}>
            <div>
              <label style={s.h2}>Start Time</label>
              <input style={s.input} type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </div>
            <div>
              <label style={s.h2}>End Time</label>
              <input style={s.input} type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontWeight: 700 }}>Token:</span>
            <code style={{ background: "#F5F3FF", padding: "6px 10px", borderRadius: 8, color: colors.primary }}>{token}</code>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" style={s.btnPrimary}>Submit</button>
            <Link to="/home" style={{ ...s.btnGhost, textDecoration: "none", display: "inline-block" }}>Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------- View Meetings -------------------------- */
function ViewMeetings() {
  const navigate = useNavigate();
  const userEmail = getUserEmail();
  const isStaff = sessionStorage.getItem("role") === "staff"; 
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "https://meetpass-backend.onrender.com";

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
      const res = await axios.get(`${BASE_URL}/meetings/${userEmail}`);

        setMeetings(res.data);
      } catch (err) {
        alert("Failed to fetch meetings");
      } finally {
        setLoading(false);
      }
    };
    if (userEmail) fetchMeetings();
  }, [userEmail]);

  const handleAction = async (meetingId, action) => {
    try {
     await axios.patch(`${BASE_URL}/meetings/${meetingId}`, { status: action, approvedBy: userEmail });

      setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, status: action, approvedBy: userEmail } : m));
    } catch (err) {
      console.error(err);
      alert("Failed to update meeting status");
    }
  };

  const now = new Date();
  const upcomingMeetings = meetings.filter(m => m.startTime && new Date(m.startTime) > now);

  if (loading) return <p>Loading meetings...</p>;

  return (
    <div style={s.main}>
      <div style={s.card}>
        <h1 style={s.h1}>📅 Scheduled Meetings</h1>
        {upcomingMeetings.length === 0 ? (
          <p>No meetings scheduled yet.</p>
        ) : (
          upcomingMeetings.map((m) => (
            <div key={m.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, marginBottom: 12, background: "#fafafa" }}>
              <p><strong>Token:</strong> {m.token || "N/A"}</p>
              <p><strong>Meeting From:</strong> {m.scheduler || "N/A"}</p>
              <p><strong>Meeting To:</strong> {m.participantEmail || "N/A"}</p>
              <p><strong>Date & Time:</strong> {m.startTime || "N/A"}</p>
              <p><strong>Venue:</strong> {m.venue || "N/A"}</p>
              <p><strong>Purpose:</strong> {m.purpose || "N/A"}</p>
              <p><strong>Status:</strong>{" "}
                <span style={{ ...s.tag, background: m.status==="Approved"?"#dcfce7": m.status==="Rejected"?"#fee2e2":"#fef9c3", color: m.status==="Approved"?colors.green: m.status==="Rejected"?colors.red: colors.yellow }}>{m.status || "Pending"}</span>
              </p>
              {m.approvedBy && <p><strong>Approved By:</strong> {m.approvedBy}</p>}
              {isStaff && m.status==="Pending" && (
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button style={{ ...s.btnPrimary, background: colors.green }} onClick={() => handleAction(m.id, "Approved")}>✅ Approve</button>
                  <button style={{ ...s.btnPrimary, background: colors.red }} onClick={() => handleAction(m.id, "Rejected")}>❌ Reject</button>
                </div>
              )}
            </div>
          ))
        )}
        <button onClick={() => navigate("/home")} style={{ ...s.btnGhost, marginTop: 16 }}>⬅ Back to Dashboard</button>
      </div>
    </div>
  );
}

/* ------------------------------ MultiSelect ------------------------------ */
function MultiSelect({ values, setValues, placeholder }) {
  const [text, setText] = useState("");
  const add = () => {
    const v = text.trim();
    if (!v || values.includes(v)) return;
    setValues([...values, v]);
    setText("");
  };
  const remove = (v) => setValues(values.filter(x => x !== v));
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input style={s.input} placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key==="Enter"?(e.preventDefault(),add()):null} />
        <button type="button" style={s.btnGhost} onClick={add}>Add</button>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {values.map((v) => (
          <span key={v} style={{ ...s.tag, background: "#EDE9FE", color: colors.primary }}>
  {v} <button type="button" onClick={() => remove(v)} style={{ marginLeft: 6, border: "none", background: "transparent", cursor: "pointer", color: colors.primary }} aria-label={`Remove ${v}`}>×</button>
</span>

        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Private Route ------------------------------ */
function Private({ children }) {
  return getUserEmail() ? children : <Navigate to="/login" replace />;
}

/* ------------------------------ Shell ------------------------------ */
function Shell() {
  const location = useLocation();
  const noSidebarRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];
  const hideSidebar = noSidebarRoutes.some(path => location.pathname.startsWith(path));

  return (
    <div style={s.app}>
      {!hideSidebar && <Sidebar />}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/login" element={<LoginRegNo />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/:regno" element={<Private><Dashboard /></Private>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/home" element={<Private><Home /></Private>} />
          <Route path="/schedule" element={<Private><Schedule /></Private>} />
          <Route path="/view-meetings" element={<Private><ViewMeetings /></Private>} />
          <Route path="*" element={<Navigate to={getUserEmail()?"/home":"/login"} replace />} />
        </Routes>
      </div>
    </div>
  );
}

/* ------------------------------ App ------------------------------ */
export default function App() {
  return (
    <MaybeWrapWithRouter>
      <Shell />
    </MaybeWrapWithRouter>
  );
}