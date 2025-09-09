"use client";
import { useRef } from "react";
import { Mail, Phone, Globe } from "lucide-react";

export default function DownloadPDF() {
    const componentRef = useRef<HTMLDivElement | null>(null);

    const handleDownload = async () => {
        try {
            const res = await fetch("/api", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    html: componentRef.current?.outerHTML, // send HTML for Puppeteer
                }),
            });

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "rana-dolui-cv.pdf";
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("PDF download failed:", error);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 p-8 bg-gray-50 min-h-screen">
            {/* ✅ CV Content */}
            <div
                ref={componentRef}
                className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-10 shadow-xl"
            >
                {/* Header */}
                <div className="flex flex-col items-center border-b border-gray-300 pb-6 text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Rana Dolui</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Full Stack Developer • React • Next.js • Python • AI
                    </p>

                    {/* ✅ Contact Links */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm">
                        <a
                            href="mailto:rana@example.com"
                            className="flex items-center gap-2 text-blue-600 hover:underline"
                        >
                            <Mail className="w-4 h-4 text-blue-600" />
                            rana@example.com
                        </a>
                        <a
                            href="tel:+919876543210"
                            className="flex items-center gap-2 text-green-600 hover:underline"
                        >
                            <Phone className="w-4 h-4 text-green-600" />
                            +91-9876543210
                        </a>
                        <a
                            href="https://ranadolui.me"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-indigo-600 hover:underline"
                        >
                            <Globe className="w-4 h-4 text-indigo-600" />
                            example.com
                        </a>
                    </div>
                </div>

                {/* Profile */}
                <section className="mt-6">
                    <h2 className="text-xl font-semibold text-indigo-600">Profile</h2>
                    <p className="mt-2 text-gray-700 leading-relaxed">
                        Passionate full-stack developer with expertise in building scalable
                        web applications, integrating AI systems, and contributing to open
                        source. Adept at working with React, Next.js, Python, and cloud
                        deployments (AWS, Docker).
                    </p>
                </section>

                {/* Skills */}
                <section className="mt-6">
                    <h2 className="text-xl font-semibold text-indigo-600">Skills</h2>
                    <ul className="mt-2 grid grid-cols-2 gap-2 text-gray-700">
                        <li>⚡ React / Next.js</li>
                        <li>⚡ Node.js / Express</li>
                        <li>⚡ Python / Django / Flask</li>
                        <li>⚡ MongoDB / PostgreSQL</li>
                        <li>⚡ Docker / AWS</li>
                        <li>⚡ TailwindCSS</li>
                    </ul>
                </section>

                {/* Experience */}
                <section className="mt-6">
                    <h2 className="text-xl font-semibold text-indigo-600">Experience</h2>
                    <div className="mt-2">
                        <h3 className="font-semibold text-gray-800">
                            Full Stack Developer – Open Source Projects
                        </h3>
                        <p className="text-sm text-gray-500">2022 – Present</p>
                        <p className="mt-1 text-gray-700 leading-relaxed">
                            Contributed to multiple open-source projects, built scalable
                            backend systems, and developed modern React/Next.js applications.
                        </p>
                    </div>
                </section>

                {/* Education */}
                <section className="mt-6">
                    <h2 className="text-xl font-semibold text-indigo-600">Education</h2>
                    <div className="mt-2">
                        <h3 className="font-semibold text-gray-800">
                            Bachelor of Computer Science
                        </h3>
                        <p className="text-sm text-gray-500">XYZ University • 2019 – 2022</p>
                    </div>
                </section>
            </div>

            {/* ✅ Download Button */}
            <button
                onClick={handleDownload}
                className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700"
            >
                📥 Download CV as PDF
            </button>
        </div>
    );
}
