import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Social share card (1200×630) for every page: GET /api/og?title=…&kicker=…
 * Lives under /api so the next-intl proxy leaves it alone. Pages point their
 * Open Graph and Twitter images here through `ogImages()` in lib/seo.ts.
 */
const asset = (path: string) => readFile(join(process.cwd(), "public", path));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "Impact Axis").slice(0, 90);
  const kicker = (searchParams.get("kicker") || "impact-axis.org").slice(0, 60);

  const [heading, body, logo, symbol] = await Promise.all([
    asset("fonts/host_grotesk/HostGrotesk-SemiBold.otf"),
    asset("fonts/pp-neue-montreal/NeueMontreal-Medium.otf"),
    asset("logos/impact_axis_white_transparent.png"),
    asset("logos/impact_axis_symbol_white_transparent.png"),
  ]);
  const src = (png: Buffer) => `data:image/png;base64,${png.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#101b62",
          backgroundImage:
            "radial-gradient(circle at 88% 12%, rgba(116,185,255,0.45) 0%, rgba(16,27,98,0) 45%), radial-gradient(circle at 8% 110%, rgba(255,190,152,0.35) 0%, rgba(16,27,98,0) 40%)",
          fontFamily: "Body",
          color: "white",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain img only */}
        <img
          src={src(symbol)}
          alt=""
          width={520}
          height={520}
          style={{ position: "absolute", right: -90, bottom: -110, opacity: 0.09 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "64px 72px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain img only */}
          <img src={src(logo)} alt="" width={235} height={88} />
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div
              style={{
                display: "flex",
                width: 120,
                height: 10,
                borderRadius: 999,
                backgroundImage: "linear-gradient(90deg, #f4c600, #ffbe98)",
              }}
            />
            <div
              style={{
                display: "flex",
                fontFamily: "Heading",
                fontSize: title.length > 48 ? 64 : 76,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                maxWidth: 980,
              }}
            >
              {title}
            </div>
            <div style={{ display: "flex", fontSize: 30, color: "#f4c600" }}>{kicker}</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Heading", data: heading, weight: 600, style: "normal" },
        { name: "Body", data: body, weight: 500, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable" },
    },
  );
}
