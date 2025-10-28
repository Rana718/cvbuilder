import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import puppeteer from "puppeteer";
import cors from "cors";

const app = express();
const PORT = 4000;
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Content-Disposition']
}));

app.use(bodyParser.json({ limit: "10mb" }));

app.options("/generate-pdf", (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(200);
});

app.post("/generate-pdf", async (req: Request, res: Response) => {
    try {
        const { html } = req.body;

        if (!html) {
            return res.status(400).json({ error: "HTML content is required" });
        }

        const browser = await puppeteer.launch({
            headless: true,
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
            format: "a4",
            printBackground: true,
        });

        await browser.close();

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=download.pdf",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });

        return res.send(pdfBuffer);
    } catch (error) {
        console.error("Puppeteer PDF error:", error);
        return res.status(500).json({ error: "Failed to generate PDF" });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Express server running at http://localhost:${PORT}`);
});
