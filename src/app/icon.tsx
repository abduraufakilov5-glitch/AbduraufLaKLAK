import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#993556",
        borderRadius: 16,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 42,
          height: 42,
          border: "2px solid rgba(255,255,255,.28)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          color: "white",
          fontSize: 34,
          fontWeight: 700,
          lineHeight: 1,
          fontFamily: "Arial",
          letterSpacing: "-2px",
          marginTop: -2,
        }}
      >
        D
      </div>
    </div>,
    { ...size },
  );
}
