import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: Request) {
    try {
        const { html } = await req.json();

        const browser = await puppeteer.launch({
            headless: true, // ✅ use boolean for TypeScript compatibility
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();

        await page.setContent(`
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body>${html}</body>
      </html>
    `);

        const pdfBuffer = await page.pdf({
            format: "a4", // ✅ must be lowercase
            printBackground: true,
        });

        await browser.close();

        // ✅ Convert Buffer → Uint8Array for NextResponse
        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=download.pdf",
            },
        });
    } catch (error: any) {
        console.error("Puppeteer PDF error:", error);
        return NextResponse.json(
            { error: "Failed to generate PDF" },
            { status: 500 }
        );
    }
}
