import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { API_BASE, useAuth } from "../context/AuthContext";
import { Send, User, MessageSquare, MapPin } from "lucide-react";

export default function Inbox() {
  const { user, token, socket } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectUserParam = searchParams.get("selectUser");

  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const [textInput, setTextInput] = useState("");

  const [usersLoading, setUsersLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const currentUserId = user?.id || user?._id || "";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/chats/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error("Failed to fetch campus directory");
        const data = await response.json();
        setChatUsers(data.users || []);
        
        if (selectUserParam) {
          const matchedUser = data.users.find((u) => u._id === selectUserParam);
          if (matchedUser) {
            setSelectedUser(matchedUser);
          }
        }
      } catch (_err) {
      } finally {
        setUsersLoading(false);
      }
    };

    if (token) fetchUsers();
  }, [token, selectUserParam]);

  useEffect(() => {
    if (!selectedUser) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setMessagesLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/chats/${selectedUser._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error("Failed to fetch conversations");
        const data = await response.json();
        setMessages(data.messages || []);
      } catch (_err) {
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser, token]);

  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleNewMessage = (msg) => {
      const isFromCurrentConversation =
        (msg.sender._id === selectedUser._id && msg.receiver._id === currentUserId) ||
        (msg.sender._id === currentUserId && msg.receiver._id === selectedUser._id);

      if (isFromCurrentConversation) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on("chat:message", handleNewMessage);

    return () => {
      socket.off("chat:message", handleNewMessage);
    };
  }, [socket, selectedUser, currentUserId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!textInput.trim() || !selectedUser) return;

    const textToSend = textInput.trim();
    setTextInput("");

    if (socket && socket.connected) {
      socket.emit("chat:send", {
        receiverId: selectedUser._id,
        text: textToSend
      });
    } else {
      fetch(`${API_BASE}/api/chats/${selectedUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: textToSend })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            setMessages((prev) => [...prev, data.message]);
          }
        })
        .catch(() => {});
    }
  };

  const getContextProduct = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].product) {
        return messages[i].product;
      }
    }
    return null;
  };

  const contextProduct = getContextProduct();

  return (
    <div className="page-container inbox-page animate-fade-in" style={{
      maxWidth: "1100px",
      margin: "0 auto",
      padding: "1rem",
      height: "calc(100vh - 12rem)"
    }}>
      <div className="glass-panel inbox-container" style={{
        display: "grid",
        gridTemplateColumns: "320px 1fr",
        height: "100%",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--border-glass)"
      }}>
        
        <aside style={{
          borderRight: "1px solid var(--border-glass)",
          display: "flex",
          flexDirection: "column",
          background: "rgba(0, 0, 0, 0.15)"
        }}>
          <div style={{
            padding: "1.25rem",
            borderBottom: "1px solid var(--border-glass)",
            background: "rgba(255,255,255,0.01)"
          }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Hostel Directory</h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Active buyers and sellers online
            </p>
          </div>

          <div style={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "0.75rem"
          }}>
            {usersLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Loading...</span>
              </div>
            ) : chatUsers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                No active students online.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {chatUsers.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => {
                      setSelectedUser(u);
                      setSearchParams({ selectUser: u._id });
                    }}
                    style={{
                      border: "none",
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      background: selectedUser?._id === u._id ? "rgba(26, 128, 230, 0.12)" : "transparent",
                      color: selectedUser?._id === u._id ? "#ffffff" : "var(--text-primary)",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "var(--transition-smooth)",
                      borderLeft: selectedUser?._id === u._id ? "3px solid var(--primary)" : "3px solid transparent"
                    }}
                  >
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: selectedUser?._id === u._id ? "var(--primary)" : "var(--text-secondary)",
                      border: "1px solid var(--border-glass)"
                    }}>
                      <User size={16} />
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{u.name}</span>
                      <span style={{
                        fontSize: "0.75rem",
                        color: "var(--accent)",
                        fontWeight: 500,
                        textTransform: "capitalize"
                      }}>
                        {u.hostel} • Rm {u.roomNumber}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <main style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: "rgba(9, 13, 22, 0.4)"
        }}>
          {selectedUser ? (
            <>
              <header style={{
                padding: "1rem 1.5rem",
                borderBottom: "1px solid var(--border-glass)",
                background: "rgba(255, 255, 255, 0.01)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(26, 128, 230, 0.15)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <User size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>{selectedUser.name}</h4>
                    <span style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                      textTransform: "capitalize",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}>
                      <MapPin size={10} style={{ color: "var(--accent)" }} />
                      {selectedUser.hostel} Hostel • Room {selectedUser.roomNumber}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {socket?.connected ? (
                    <span style={{ color: "var(--success)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--success)" }} />
                      Live Link Active
                    </span>
                  ) : (
                    <span style={{ color: "var(--warning)", fontWeight: 600 }}>Syncing via REST</span>
                  )}
                </div>
              </header>

              {contextProduct && (
                <div style={{
                  background: "rgba(255, 179, 0, 0.06)",
                  borderBottom: "1px solid rgba(255, 179, 0, 0.15)",
                  padding: "0.6rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      background: "rgba(0,0,0,0.2)"
                    }}>
                      <img
                        src={contextProduct.imageUrl.startsWith("data:") ? contextProduct.imageUrl : `${API_BASE}${contextProduct.imageUrl}`}
                        alt={contextProduct.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Negotiating listing:</span>
                      <h5 style={{ fontSize: "0.85rem", fontWeight: 700 }}>{contextProduct.title}</h5>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--accent)" }}>₹{contextProduct.price}</span>
                    <Link to={`/product/${contextProduct._id}`} className="btn-secondary" style={{
                      padding: "0.25rem 0.5rem",
                      fontSize: "0.7rem",
                      border: "none",
                      background: "rgba(255, 255, 255, 0.05)"
                    }}>
                      View Listing
                    </Link>
                  </div>
                </div>
              )}

              <div style={{
                flexGrow: 1,
                overflowY: "auto",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
              }}>
                {messagesLoading && messages.length === 0 ? (
                  <div style={{ display: "flex", justifyContent: "center", margin: "auto" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Loading...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div style={{
                    margin: "auto",
                    textAlign: "center",
                    maxWidth: "350px",
                    color: "var(--text-secondary)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <MessageSquare size={32} style={{ color: "var(--text-muted)" }} />
                    <p style={{ fontSize: "0.95rem", fontWeight: 600 }}>Start the conversation</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Send a message to agree on prices, items, or lobby meetups.
                    </p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isOwnMessage = m.sender._id === currentUserId;
                    return (
                      <div
                        key={m._id}
                        style={{
                          display: "flex",
                          justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                          width: "100%"
                        }}
                      >
                        <div style={{
                          maxWidth: "65%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.25rem"
                        }}>
                          <div style={{
                            padding: "0.75rem 1rem",
                            borderRadius: "var(--radius-md)",
                            background: isOwnMessage ? "var(--primary)" : "rgba(255,255,255,0.05)",
                            color: "#ffffff",
                            fontSize: "0.92rem",
                            lineHeight: "1.45",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            border: isOwnMessage ? "none" : "1px solid var(--border-glass)",
                            borderRadiusTopRight: isOwnMessage ? 0 : "var(--radius-md)",
                            borderRadiusTopLeft: isOwnMessage ? "var(--radius-md)" : 0
                          }}>
                            {m.text}
                          </div>

                          <span style={{
                            fontSize: "0.7rem",
                            color: "var(--text-muted)",
                            textAlign: isOwnMessage ? "right" : "left",
                            padding: "0 0.25rem"
                          }}>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} style={{
                padding: "1rem 1.5rem",
                borderTop: "1px solid var(--border-glass)",
                background: "rgba(255, 255, 255, 0.01)",
                display: "flex",
                gap: "0.75rem"
              }}>
                <input
                  type="text"
                  className="form-input"
                  style={{
                    flexGrow: 1,
                    background: "rgba(9, 13, 22, 0.8)",
                    border: "1px solid var(--border-glass)",
                    borderRadius: "var(--radius-sm)"
                  }}
                  placeholder="Type a message to bargain or coordinate a meet up..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: "0.75rem 1.25rem",
                    borderRadius: "var(--radius-sm)"
                  }}
                >
                  <Send size={16} />
                  Send
                </button>
              </form>
            </>
          ) : (
            <div style={{
              margin: "auto",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
              maxWidth: "400px",
              padding: "2rem",
              color: "var(--text-secondary)"
            }}>
              <div style={{
                background: "rgba(26, 128, 230, 0.1)",
                color: "var(--primary)",
                padding: "1rem",
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.5rem"
              }}>
                <MessageSquare size={36} />
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Your Campus Inbox</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                Select a student from the hostel directory to start negotiating prices, coordinate trade timelines, or arrange corridor exchanges!
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
