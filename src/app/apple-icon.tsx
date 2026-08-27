import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#993556",
        borderRadius: 38,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 118,
          height: 118,
          border: "4px solid rgba(255,255,255,.28)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          color: "white",
          fontSize: 96,
          fontWeight: 700,
          lineHeight: 1,
          fontFamily: "Arial",
          letterSpacing: "-6px",
          marginTop: -7,
        }}
      >
        D
      </div>
    </div>,
    { ...size },
  );
}
