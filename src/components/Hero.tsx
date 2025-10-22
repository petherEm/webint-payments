"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, BarChart3, LineChart, Activity } from "lucide-react";

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
  const centerX = 300;
  const centerY = 300;
  const frontRadius = 180;
  const backRadius = 120; // Smaller radius for background octagon

  const frontNodes = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
    return {
      id: i + 1,
      x: centerX + frontRadius * Math.cos(angle),
      y: centerY + frontRadius * Math.sin(angle),
      layer: "front",
    };
  });

  const backNodes = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
    return {
      id: i + 9,
      x: centerX + backRadius * Math.cos(angle) - 30, // Offset left
      y: centerY + backRadius * Math.sin(angle) - 30, // Offset up
      layer: "back",
    };
  });

  const frontConnections = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
    { from: 6, to: 7 },
    { from: 7, to: 8 },
    { from: 8, to: 1 },
    { from: 1, to: 5 },
    { from: 2, to: 6 },
    { from: 3, to: 7 },
    { from: 4, to: 8 },
  ];

  const backConnections = [
    { from: 9, to: 10 },
    { from: 10, to: 11 },
    { from: 11, to: 12 },
    { from: 12, to: 13 },
    { from: 13, to: 14 },
    { from: 14, to: 15 },
    { from: 15, to: 16 },
    { from: 16, to: 9 },
  ];

  const depthConnections = [
    { from: 1, to: 9 },
    { from: 2, to: 10 },
    { from: 3, to: 11 },
    { from: 4, to: 12 },
    { from: 5, to: 13 },
    { from: 6, to: 14 },
    { from: 7, to: 15 },
    { from: 8, to: 16 },
  ];

  const allNodes = [...backNodes, ...frontNodes]; // Back nodes first for rendering order

  return (
    <div className="relative w-full h-full min-h-[600px] flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <svg className="w-full h-full" viewBox="0 0 600 600">
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

      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-500/10 blur-2xl"
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
        className="absolute bottom-1/4 right-1/4 w-36 h-36 rounded-full bg-green-500/15 blur-2xl"
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

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 600">
        {backConnections.map((conn, i) => {
          const fromNode = allNodes.find((n) => n.id === conn.from);
          const toNode = allNodes.find((n) => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`back-line-${i}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-green-500/15"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.08 }}
            />
          );
        })}

        {depthConnections.map((conn, i) => {
          const fromNode = allNodes.find((n) => n.id === conn.from);
          const toNode = allNodes.find((n) => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`depth-line-${i}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-green-500/20"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 + 0.5 }}
            />
          );
        })}

        {frontConnections.map((conn, i) => {
          const fromNode = allNodes.find((n) => n.id === conn.from);
          const toNode = allNodes.find((n) => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`front-line-${i}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-green-500/30"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          );
        })}

        {frontConnections.map((conn, i) => {
          const fromNode = allNodes.find((n) => n.id === conn.from);
          const toNode = allNodes.find((n) => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          return (
            <motion.circle
              key={`front-signal-${i}`}
              r="4"
              fill="currentColor"
              className="text-green-500"
              initial={{ cx: fromNode.x, cy: fromNode.y, opacity: 0 }}
              animate={{
                cx: [fromNode.x, toNode.x, fromNode.x],
                cy: [fromNode.y, toNode.y, fromNode.y],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: i * 0.3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <animate
                attributeName="r"
                values="3;5;3"
                dur="1s"
                repeatCount="indefinite"
              />
            </motion.circle>
          );
        })}

        {depthConnections.slice(0, 4).map((conn, i) => {
          const fromNode = allNodes.find((n) => n.id === conn.from);
          const toNode = allNodes.find((n) => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          return (
            <motion.circle
              key={`depth-signal-${i}`}
              r="3"
              fill="currentColor"
              className="text-green-400/70"
              initial={{ cx: fromNode.x, cy: fromNode.y, opacity: 0 }}
              animate={{
                cx: [fromNode.x, toNode.x, fromNode.x],
                cy: [fromNode.y, toNode.y, fromNode.y],
                opacity: [0, 0.7, 0.7, 0],
              }}
              transition={{
                duration: 2.5,
                delay: i * 0.6 + 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {allNodes.map((node, i) => {
          const isBack = node.layer === "back";
          return (
            <motion.g key={`node-${node.id}`}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={isBack ? 8 : 12}
                fill="none"
                stroke="currentColor"
                strokeWidth={isBack ? 1 : 1.5}
                className={isBack ? "text-green-500/20" : "text-green-500/40"}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: isBack ? [0.2, 0.4, 0.2] : [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={isBack ? 4 : 6}
                fill="currentColor"
                className={isBack ? "text-green-500/50" : "text-green-500"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={isBack ? 1.5 : 2}
                fill="currentColor"
                className="text-white"
              />
            </motion.g>
          );
        })}
      </svg>

      {[
        { size: 200, delay: 0 },
        { size: 300, delay: 0.5 },
        { size: 400, delay: 1 },
      ].map((ring, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-500/10"
          style={{ width: ring.size, height: ring.size }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-chart-2/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl py-16 sm:py-20 lg:py-28 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground text-balance leading-tight"
            >
              Trade Smarter with{" "}
              <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent animate-gradient">
                Advanced Analytics
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground text-balance leading-relaxed"
            >
              Professional-grade market insights, real-time data visualization,
              and powerful analytics tools to elevate your trading strategy.
            </motion.p>

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
                Explore Markets
              </Link>
            </motion.div>
          </motion.div>

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
