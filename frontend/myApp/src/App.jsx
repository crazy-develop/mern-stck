import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("checking"); // 'connected' | 'error' | 'checking'
  const [timestamp, setTimestamp] = useState("");

  // State for sending custom message to backend (POST endpoint)
  const [inputText, setInputText] = useState("");
  const [postResponse, setPostResponse] = useState(null);
  const [postLoading, setPostLoading] = useState(false);

  // Fetch greeting message from backend (GET /api/hello)
  const fetchMessage = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use relative URL (proxied by Vite) with full URL fallback if needed
      const res = await fetch("/api/hello").catch(() =>
        fetch("http://localhost:3000/api/hello")
      );

      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }

      const data = await res.json();
      setMessage(data.message);
      setTimestamp(data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : "");
      setStatus("connected");
    } catch (err) {
      console.error("Backend Connection Error:", err);
      setError("Unable to connect to Express backend on port 3000.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // Send custom message to backend (POST /api/message)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setPostLoading(true);
    setPostResponse(null);
    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      }).catch(() =>
        fetch("http://localhost:3000/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: inputText }),
        })
      );

      const data = await res.json();
      setPostResponse(data);
      setInputText("");
    } catch (err) {
      console.error("POST Error:", err);
      setPostResponse({ status: "error", message: "Failed to send message to backend." });
    } finally {
      setPostLoading(false);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.badgeContainer}>
          <span
            style={{
              ...styles.statusDot,
              backgroundColor:
                status === "connected"
                  ? "#10B981"
                  : status === "error"
                    ? "#EF4444"
                    : "#F59E0B",
            }}
          />
          <span style={styles.badgeText}>
            {status === "connected"
              ? "Backend Connected"
              : status === "error"
                ? "Backend Offline"
                : "Checking Connection..."}
          </span>
        </div>
        <h1 style={styles.title}>MERN Stack Connection Portal</h1>
        <p style={styles.subtitle}>
          React Frontend & Express Backend Integration Demo
        </p>
      </header>

      {/* Main Grid Content */}
      <main style={styles.grid}>
        {/* Card 1: GET Request (Fetch Data from Server) */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.methodGet}>GET</span>
            <h2 style={styles.cardTitle}>Fetch Data from Backend</h2>
          </div>
          <p style={styles.cardDescription}>
            Endpoint: <code>/api/hello</code>
          </p>

          <button
            onClick={fetchMessage}
            disabled={loading}
            style={styles.primaryButton}
          >
            {loading ? "Fetching..." : "Fetch Message from Server"}
          </button>

          {error && (
            <div style={styles.errorBox}>
              <strong style={{ display: 'block', marginBottom: '4px' }}>⚠️ Connection Failed</strong>
              {error}
            </div>
          )}

          {message && !error && (
            <div style={styles.responseBox}>
              <div style={styles.responseLabel}>Server Response:</div>
              <div style={styles.responseText}>{message}</div>
              {timestamp && (
                <div style={styles.timestamp}>Received at: {timestamp}</div>
              )}
            </div>
          )}
        </div>

        {/* Card 2: POST Request (Send Data to Server) */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.methodPost}>POST</span>
            <h2 style={styles.cardTitle}>Send Data to Backend</h2>
          </div>
          <p style={styles.cardDescription}>
            Endpoint: <code>/api/message</code>
          </p>

          <form onSubmit={handleSendMessage} style={styles.form}>
            <input
              type="text"
              placeholder="Enter message to send..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={styles.input}
              disabled={postLoading}
            />
            <button
              type="submit"
              disabled={postLoading || !inputText.trim()}
              style={{
                ...styles.secondaryButton,
                opacity: postLoading || !inputText.trim() ? 0.6 : 1,
              }}
            >
              {postLoading ? "Sending..." : "Send to Server"}
            </button>
          </form>

          {postResponse && (
            <div
              style={{
                ...styles.responseBox,
                borderColor:
                  postResponse.status === "success" ? "#10B981" : "#EF4444",
              }}
            >
              <div style={styles.responseLabel}>
                {postResponse.status === "success"
                  ? "Server Reply:"
                  : "Error:"}
              </div>
              <div style={styles.responseText}>
                {postResponse.serverReply || postResponse.message}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Instructions */}
      <footer style={styles.footer}>
        <div style={styles.infoCard}>
          <h3 style={styles.infoTitle}>💡 How to Run local servers:</h3>
          <div style={styles.infoSteps}>
            <div>
              <strong>1. Backend Server:</strong> Open terminal in <code>backend/</code> folder and run:
              <br />
              <code style={styles.cmdCode}>npm start</code> (Runs on port 3000)
            </div>
            <div style={{ marginTop: "10px" }}>
              <strong>2. Frontend React App:</strong> Open terminal in <code>frontend/myApp/</code> folder and run:
              <br />
              <code style={styles.cmdCode}>npm run dev</code>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Inline Styles for Modern Glassmorphism Aesthetic
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0F172A",
    color: "#F8FAFC",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    maxWidth: "600px",
  },
  badgeContainer: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    marginBottom: "16px",
  },
  statusDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    boxShadow: "0 0 8px currentColor",
  },
  badgeText: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#E2E8F0",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    margin: "0 0 10px 0",
    background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#94A3B8",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
    width: "100%",
    maxWidth: "880px",
    marginBottom: "40px",
  },
  card: {
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "28px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  },
  methodGet: {
    backgroundColor: "#10B981",
    color: "#022C22",
    fontWeight: "700",
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "6px",
  },
  methodPost: {
    backgroundColor: "#3B82F6",
    color: "#1E3A8A",
    fontWeight: "700",
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "6px",
  },
  cardTitle: {
    fontSize: "1.25rem",
    margin: 0,
    fontWeight: "700",
    color: "#F1F5F9",
  },
  cardDescription: {
    fontSize: "0.9rem",
    color: "#94A3B8",
    marginTop: 0,
    marginBottom: "20px",
  },
  primaryButton: {
    backgroundColor: "#6366F1",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "10px",
    padding: "12px 20px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s, background-color 0.2s",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
  },
  secondaryButton: {
    backgroundColor: "#3B82F6",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "10px",
    padding: "12px 20px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s, background-color 0.2s",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    backgroundColor: "#1E293B",
    border: "1px solid #475569",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#F8FAFC",
    fontSize: "0.95rem",
    outline: "none",
  },
  responseBox: {
    marginTop: "20px",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderRadius: "10px",
    padding: "16px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  errorBox: {
    marginTop: "20px",
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    color: "#FCA5A5",
    borderRadius: "10px",
    padding: "16px",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    fontSize: "0.9rem",
  },
  responseLabel: {
    fontSize: "0.8rem",
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  responseText: {
    fontSize: "1rem",
    color: "#38BDF8",
    fontWeight: "500",
  },
  timestamp: {
    fontSize: "0.75rem",
    color: "#64748B",
    marginTop: "8px",
  },
  footer: {
    width: "100%",
    maxWidth: "880px",
  },
  infoCard: {
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderRadius: "14px",
    padding: "20px",
    border: "1px dashed rgba(255, 255, 255, 0.15)",
  },
  infoTitle: {
    margin: "0 0 12px 0",
    fontSize: "1rem",
    color: "#F1F5F9",
  },
  infoSteps: {
    fontSize: "0.9rem",
    color: "#CBD5E1",
    lineHeight: "1.5",
  },
  cmdCode: {
    backgroundColor: "#0F172A",
    color: "#A78BFA",
    padding: "2px 8px",
    borderRadius: "4px",
    fontFamily: "monospace",
  },
};

export default App;