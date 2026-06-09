import InfoCard from "./InfoCard";

export default function Hotspot({ src, x, y, width, height, torchX, torchY, torchRadius, card }) {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const dist = Math.hypot(torchX - centerX, torchY - centerY);
  const isHovered = dist < torchRadius;

  return (
    <>
      <img
        src={src}
        alt={card.name}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: width,
          height: height,
          objectFit: "contain",
          zIndex: 3,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />
      <InfoCard {...card} visible={isHovered} />
    </>
  );
}