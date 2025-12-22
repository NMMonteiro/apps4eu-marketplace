'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Sparkles, ArrowRight, Shield, Zap, Globe, Cpu, Database, Command } from 'lucide-react'

export default function HomeHero() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const heroRef = useRef<HTMLDivElement>(null)

    // Generate random background particles
    const particles = useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
            opacity: Math.random() * 0.3 + 0.1
        }))
    }, [])

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
            className="relative min-h-[110vh] flex items-center justify-center bg-[#010103] text-white overflow-hidden perspective-2000"
        >
            {/* 1. Cinematic Background Layer */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen grayscale-[0.5]"
                    style={{
                        transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px) scale(1.15) rotate(${mousePos.x * 2}deg)`
                    }}
                >
                    <source src="https://cdn.pixabay.com/video/2021/08/21/85848-591322049_tiny.mp4" type="video/mp4" />
                </video>

                {/* Randomly Floating Particles */}
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="absolute rounded-full bg-blue-400 blur-[1px] animate-float"
                        style={{
                            top: p.top,
                            left: p.left,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            opacity: p.opacity,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `${p.delay}s`,
                            transform: `translate(${mousePos.x * (p.size * 10)}px, ${mousePos.y * (p.size * 10)}px)`
                        }}
                    />
                ))}

                {/* Stochastic Overlays */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#010103_85%)]" />
                <div className="absolute inset-0 opacity-[0.03] animate-grain pointer-events-none" />
            </div>

            {/* 2. Layered Parallax Elements (Webflow Interactive Style) */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                {/* Floating Tech Orbs */}
                <div
                    className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] animate-pulse"
                    style={{ transform: `translate(${mousePos.x * -150}px, ${mousePos.y * -150}px)` }}
                />
                <div
                    className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]"
                    style={{ transform: `translate(${mousePos.x * 120}px, ${mousePos.y * 120}px)` }}
                />

                {/* Floating Floating UI Widgets */}
                <div
                    className="absolute top-[15%] left-[12%] w-72 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-2xl transition-all duration-1000 hidden lg:block"
                    style={{ transform: `translate(${mousePos.x * -60}px, ${mousePos.y * -60}px) rotateY(${mousePos.x * 25}deg)` }}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Cpu className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="h-2.5 w-24 bg-white/20 rounded-full mb-2" />
                            <div className="h-2 w-16 bg-white/10 rounded-full" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl">
                            <Database className="w-4 h-4 text-blue-400" />
                            <div className="h-1.5 w-32 bg-white/10 rounded-full" />
                        </div>
                    </div>
                </div>

                <div
                    className="absolute bottom-[20%] right-[12%] w-80 bg-[#0a0a0c]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl transition-all duration-1000 hidden lg:block"
                    style={{ transform: `translate(${mousePos.x * -100}px, ${mousePos.y * -100}px) rotateX(${mousePos.y * 30}deg)` }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Command className="w-5 h-5 text-indigo-400" />
                        <span className="text-[10px] uppercase font-black tracking-widest text-indigo-200">System Core v4.2</span>
                    </div>
                    <div className="flex items-end gap-2 h-20 mb-6">
                        {[60, 40, 80, 50, 90, 70, 45, 85].map((h, i) => (
                            <div key={i} className="flex-1 rounded-full bg-gradient-to-t from-indigo-500/20 to-indigo-500 group-hover:to-blue-400 transition-all duration-500" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[72%] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                    </div>
                </div>
            </div>

            {/* 3. Main Narrative Layer */}
            <div className="container mx-auto px-4 relative z-20">
                <div className="max-w-5xl mx-auto text-center">
                    <div
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-500/10 text-blue-300 text-[10px] font-black leading-none mb-12 border border-blue-500/20 backdrop-blur-3xl animate-fade-in uppercase tracking-[0.4em] shadow-2xl shadow-blue-500/10"
                        style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` }}
                    >
                        <Zap className="w-4 h-4 text-blue-400 fill-blue-400" />
                        Direct Distribution Protocol
                    </div>

                    <h1
                        className="text-7xl md:text-[8rem] lg:text-[10rem] font-black mb-12 tracking-tighter leading-[0.8] animate-slide-up"
                        style={{
                            transform: `translate(${mousePos.x * 45}px, ${mousePos.y * 45}px) rotateY(${mousePos.x * 8}deg) rotateX(${mousePos.y * -8}deg)`,
                            textShadow: '0 0 80px rgba(59, 130, 246, 0.1)'
                        }}
                    >
                        Future <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-blue-300 italic font-serif tracking-normal">
                            Unfolded.
                        </span>
                    </h1>

                    <p
                        className="text-blue-100/40 max-w-3xl mx-auto text-xl md:text-3xl font-light leading-relaxed mb-16 animate-fade-in-delayed"
                        style={{ transform: `translate(${mousePos.x * 22}px, ${mousePos.y * 22}px)` }}
                    >
                        Deploy production-ready European infrastructure with a single primitive.
                        Enterprise frameworks, automated scaling, and sovereign AI at your command.
                    </p>

                    <div
                        className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-fade-in-delayed"
                        style={{ transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)` }}
                    >
                        <a href="/marketplace" className="group relative px-14 py-8 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-110 hover:-rotate-1 active:scale-95 shadow-2xl shadow-blue-600/30 flex items-center gap-4">
                            <span className="relative z-10">Initialize Catalog</span>
                            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-2" />
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 mix-blend-difference" />
                        </a>
                        <a href="#marketplace" className="px-14 py-8 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-[2rem] font-black text-sm uppercase tracking-widest backdrop-blur-3xl transition-all hover:border-white/30 flex items-center gap-4">
                            See Previews
                            <Globe className="w-5 h-5 text-blue-500" />
                        </a>
                    </div>
                </div>
            </div>

            {/* 4. Stochastic Decorative Layer */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.05] mixture-overlay">
                <div className="absolute top-0 left-1/4 w-px h-full bg-blue-400 animate-scan-slow" style={{ animationDuration: '7s' }} />
                <div className="absolute top-0 right-1/3 w-px h-full bg-indigo-400 animate-scan-slow" style={{ animationDuration: '11s', animationDelay: '3s' }} />
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-6 group cursor-pointer animate-fade-in-delayed">
                <span className="text-[10px] uppercase font-black tracking-[0.5em] opacity-20 group-hover:opacity-100 transition-opacity">Explore</span>
                <div className="w-[2px] h-20 bg-white/10 relative overflow-hidden rounded-full">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-500 animate-scroll-line" />
                </div>
            </div>
        </div>
    )
}
