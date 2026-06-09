export default function InfoCard({ name, location, date, description, visible }) {
  return (
    <div style={{
      position: "absolute",
      top: "50%",
      right: "5%",
      transform: "translateY(-50%)",
      width: 320,
      background: "#060d14",
      border: "1.5px solid #3ecfef88",
      borderRadius: 20,
      padding: "28px 28px",
      boxShadow: "0 0 32px #3ecfef33, inset 0 0 24px #0a1a2a",
      opacity: visible ? 1 : 0,
      pointerEvents: "none",
      transition: "opacity 0.4s ease",
      zIndex: 50,
    }}>
      <h2 style={{
        color: "#e8f4f8",
        fontSize: 26,
        fontWeight: 400,
        fontFamily: "Georgia, serif",
        marginBottom: 10,
        lineHeight: 1.2,
      }}>
        {name}
      </h2>
      <p style={{
        color: "#5ba8c4",
        fontSize: 14,
        fontFamily: "monospace",
        marginBottom: 16,
        letterSpacing: "0.05em",
      }}>
        {location} | {date}
      </p>
      <p style={{
        color: "#c8dde8",
        fontSize: 13.5,
        fontFamily: "Georgia, serif",
        lineHeight: 1.7,
      }}>
        {description}
      </p>
    </div>
  );
}