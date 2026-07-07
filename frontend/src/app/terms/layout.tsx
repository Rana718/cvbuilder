"use client"

import Navbar from '@/components/Navbar'
import React from 'react'
import Footer from '@/components/Footer'

function layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {/* <Navbar /> */}
            {children}
            <Footer />
        </div>
    )
}

export default layout