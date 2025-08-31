import React from "react";

function Footer() {
    const handleRedirect = () => {
        window.open("https://aydpm.in/", "_blank"); // opens in new tab
    };

    return (
        <footer className="bg-orange-600 text-white py-2 cursor-pointer" onClick={handleRedirect}>
            <div className="container mx-auto px-6 text-center">
                <p className="text-orange-100 hover:text-white transition">
                    © Resume AI | All rights reserved | Developed by AYD Software.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
