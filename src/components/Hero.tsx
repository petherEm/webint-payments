"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, BarChart3, LineChart, Activity } from "lucide-react";
import { useState, useEffect } from "react";

const stats = [
  { label: "Active Traders", value: "50K+", icon: Activity },
  { label: "Markets Tracked", value: "100+", icon: BarChart3 },
  { label: "Daily Updates", value: "1M+", icon: LineChart },
  { label: "Accuracy Rate", value: "99.9%", icon: TrendingUp },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const AnimatedPattern = () => {
  // Only render random elements after hydration to avoid mismatch
  const [isClient, setIsClient] = useState(false);
  const [floatingDots, setFloatingDots] = useState<
    Array<{ left: number; top: number; duration: number; delay: number }>
  >([]);

  useEffect(() => {
    setIsClient(true);
    setFloatingDots(
      Array.from({ length: 12 }).map(() => ({
        left: Math.random() * 80 + 10,
        top: Math.random() * 80 + 10,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      }))
    );
  }, []);

  return (
    <div className="relative w-full h-full min-h-[600px] flex items-center justify-center">
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 600 600">
          {/* Grid lines */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.line
              key={`h-${i}`}
              x1="0"
              y1={i * 30}
              x2="600"
              y2={i * 30}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border/30"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: i * 0.05 }}
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.line
              key={`v-${i}`}
              x1={i * 30}
              y1="0"
              x2={i * 30}
              y2="600"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border/30"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: i * 0.05 }}
            />
          ))}
        </svg>
      </div>

      {/* Floating orbs with glow */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/20 blur-2xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-40 h-40 rounded-full bg-chart-2/20 blur-2xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-36 h-36 rounded-full bg-green-500/20 blur-2xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 9,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Animated geometric shapes */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 600">
        {/* Hexagons */}
        {[
          { cx: 150, cy: 150, delay: 0 },
          { cx: 450, cy: 200, delay: 0.3 },
          { cx: 300, cy: 400, delay: 0.6 },
          { cx: 500, cy: 450, delay: 0.9 },
        ].map((hex, i) => (
          <motion.g key={`hex-${i}`}>
            <motion.polygon
              points={`${hex.cx},${hex.cy - 30} ${hex.cx + 26},${hex.cy - 15} ${
                hex.cx + 26
              },${hex.cy + 15} ${hex.cx},${hex.cy + 30} ${hex.cx - 26},${
                hex.cy + 15
              } ${hex.cx - 26},${hex.cy - 15}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-primary/40"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: hex.delay }}
            />
            <motion.circle
              cx={hex.cx}
              cy={hex.cy}
              r="3"
              fill="currentColor"
              className="text-primary"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ duration: 1, delay: hex.delay + 0.5 }}
            />
          </motion.g>
        ))}

        {/* Connecting lines */}
        <motion.path
          d="M 150 150 L 450 200 L 300 400 L 500 450"
          stroke="url(#gradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 3, delay: 1 }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.8" />
            <stop
              offset="50%"
              stopColor="rgb(34, 211, 238)"
              stopOpacity="0.6"
            />
            <stop
              offset="100%"
              stopColor="rgb(34, 197, 94)"
              stopOpacity="0.4"
            />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating data points - only render on client */}
      {isClient &&
        floatingDots.map((dot, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{
              left: `${dot.left}%`,
              top: `${dot.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: dot.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: dot.delay,
            }}
          />
        ))}

      {/* Pulsing rings */}
      {[
        { size: 200, delay: 0 },
        { size: 300, delay: 0.5 },
        { size: 400, delay: 1 },
      ].map((ring, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"
          style={{ width: ring.size, height: ring.size }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: ring.delay,
          }}
        />
      ))}
    </div>
  );
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-chart-2/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl py-16 sm:py-20 lg:py-28 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-primary">
                Real-time Market Analytics
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground text-balance leading-tight"
            >
              We Are{" "}
              <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent animate-gradient">
                Payments
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground text-balance leading-relaxed"
            >
              We analyze payment trends, process volumes, and market data to
              provide actionable insights for businesses and investors with
              major focus on tech and innovation in the payments industry.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link
                href="/sign-up"
                className="group relative px-8 py-4 bg-green-500 hover:bg-green-500/90 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 w-full sm:w-auto"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500 to-chart-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                href="#market-overview"
                className="px-8 py-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-lg transition-all duration-300 border border-border hover:border-primary/50 w-full sm:w-auto"
              >
                Explore Crypto
              </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    variants={statVariants}
                    className="group relative p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-foreground">
                          {stat.value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Column - Animated Pattern */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <AnimatedPattern />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
