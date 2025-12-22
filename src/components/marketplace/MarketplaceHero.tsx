'use client'

import { useState, useEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'

export default function MarketplaceHero() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const heroRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!heroRef.current) return
            const { left, top, width, height } = heroRef.current.getBoundingClientRect()
            const x = (e.clientX - left) / width - 0.5
            const y = (e.clientY - top) / height - 0.5
            setMousePos({ x, y })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center bg-brand-navy text-white overflow-hidden perspective-1000"
        >
            {/* Background Video Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-30 scale-110"
                    style={{
                        transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px) scale(1.1)`
                    }}
                >
                    <source src="https://cdn.pixabay.com/video/2020/09/14/49673-458999960_tiny.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 via-transparent to-brand-navy" />

                {/* Interactive Grid Lines */}
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)`
                    }}
                />
            </div>

            {/* Glowing Orbs with Parallax */}
            <div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none"
                style={{
                    transform: `translate(${mousePos.x * -60}px, ${mousePos.y * -60}px)`
                }}
            />
            <div
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"
                style={{
                    transform: `translate(${mousePos.x * -100}px, ${mousePos.y * -100}px)`
                }}
            />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-blue-200 text-sm font-medium mb-8 border border-white/10 backdrop-blur-xl animate-fade-in"
                    style={{
                        transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`
                    }}
                >
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="tracking-widest uppercase text-[10px] font-black">Future of European Distribution</span>
                </div>

                <h1
                    className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter leading-[0.8] animate-slide-up"
                    style={{
                        transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px) rotateY(${mousePos.x * 5}deg) rotateX(${mousePos.y * -5}deg)`
                    }}
                >
                    Power Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 bg-300% animate-gradient italic">
                        Ambition.
                    </span>
                </h1>

                <p
                    className="text-white/60 max-w-2xl mx-auto text-lg md:text-2xl font-medium leading-relaxed mb-12 animate-fade-in-delayed"
                    style={{
                        transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`
                    }}
                >
                    Deploy enterprise-tier infrastructures, AI-driven engines, and bespoke management platforms designed for the next wave of EU innovation.
                </p>

                <div
                    className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-delayed"
                    style={{
                        transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`
                    }}
                >
                    <button className="group relative px-10 py-5 bg-white text-brand-navy rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl">
                        <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300">Enter Marketplace</span>
                    </button>
                    <button className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest backdrop-blur-xl transition-all hover:border-white/40">
                        View Documentation
                    </button>
                </div>
            </div>

            {/* Bottom Gradient for Smooth Filter Transition */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent z-10" />
        </div>
    )
}
