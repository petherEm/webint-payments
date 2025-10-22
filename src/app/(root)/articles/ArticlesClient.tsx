"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Clock, Tag, X, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { ALL_POSTS_QUERYResult } from "../../../../sanity.types";

type PostData = ALL_POSTS_QUERYResult[number];

interface ArticlesClientProps {
  posts: ALL_POSTS_QUERYResult;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function ArticlesClient({ posts }: ArticlesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Separate featured and regular posts
  const featuredPosts = useMemo(
    () => posts.filter((post) => post.isFeatured).slice(0, 2),
    [posts]
  );

  const regularPosts = useMemo(
    () => posts.filter((post) => !post.isFeatured),
    [posts]
  );

  // Extract all unique tags from categories
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.categories?.forEach((category) => {
        if (category) tags.add(category);
      });
    });
    return Array.from(tags).sort();
  }, [posts]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  const filteredArticles = useMemo(() => {
    return regularPosts.filter((article) => {
      const matchesSearch =
        searchQuery === "" ||
        article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.categories?.some((cat) =>
          cat?.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => article.categories?.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [regularPosts, searchQuery, selectedTags]);

  const getImageUrl = (post: PostData) => {
    if (!post.mainImage?.asset) return "/placeholder.svg";
    return urlFor(post.mainImage.asset).width(800).height(600).url();
  };

  const getAuthorImageUrl = (post: PostData) => {
    if (!post.author?.image?.asset) return null;
    return urlFor(post.author.image.asset).width(40).height(40).url();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#1a1a1a]">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0FEDBE]/10 via-transparent to-[#0FEDBE]/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0FEDBE]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0FEDBE]/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,237,190,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,237,190,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl py-20 sm:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0FEDBE]/10 border border-[#0FEDBE]/20 mb-4">
              <Sparkles className="w-4 h-4 text-[#0FEDBE]" />
              <span className="text-sm font-medium text-[#0FEDBE]">Expert Market Insights</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold">
              <span className="text-white">Market </span>
              <span className="bg-gradient-to-r from-[#0FEDBE] via-[#0FEDBE] to-[#0FEDBE]/70 bg-clip-text text-transparent">
                Insights
              </span>
              <span className="text-white"> & Analysis</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Stay ahead of the curve with expert analysis, proven trading strategies, and real-time market insights from industry professionals.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0FEDBE]">{posts.length}</div>
                <div className="text-sm text-gray-500">Articles</div>
              </div>
              <div className="h-8 w-px bg-[#1a1a1a]" />
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0FEDBE]">{allTags.length}</div>
                <div className="text-sm text-gray-500">Topics</div>
              </div>
              <div className="h-8 w-px bg-[#1a1a1a]" />
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0FEDBE]">{featuredPosts.length}</div>
                <div className="text-sm text-gray-500">Featured</div>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 max-w-2xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0FEDBE]/20 to-[#0FEDBE]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#0FEDBE] transition-colors" />
              <input
                type="text"
                placeholder="Search articles by title, content, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative w-full pl-14 pr-6 py-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0FEDBE]/50 focus:bg-[#0f0f0f] transition-all"
              />
            </div>
          </motion.div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Tag className="w-4 h-4" />
                  <span>Filter by:</span>
                </div>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedTags.includes(tag)
                        ? "bg-[#0FEDBE] text-black shadow-lg shadow-[#0FEDBE]/20"
                        : "bg-[#0a0a0a] text-gray-400 hover:bg-[#1a1a1a] hover:text-[#0FEDBE] border border-[#1a1a1a]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {(searchQuery || selectedTags.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300 flex items-center gap-2 border border-red-500/20"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Articles */}
      {featuredPosts.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Zap className="w-7 h-7 text-[#0FEDBE]" />
                <div className="absolute inset-0 bg-[#0FEDBE] blur-xl opacity-50" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                Featured Articles
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-[#1a1a1a] to-transparent" />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((article, index) => (
                <motion.article
                  key={article._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-[#0a0a0a] rounded-2xl overflow-hidden border border-[#1a1a1a] hover:border-[#0FEDBE]/50 transition-all duration-500"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0FEDBE]/0 to-[#0FEDBE]/0 group-hover:from-[#0FEDBE]/5 group-hover:to-[#0FEDBE]/0 transition-all duration-500" />

                  <Link
                    href={`/articles/${article.slug?.current}`}
                    className="block relative"
                  >
                    <div className="relative h-72 overflow-hidden">
                      <Image
                        src={getImageUrl(article)}
                        alt={article.mainImage?.alt || article.title || "Article image"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />

                      {/* Featured badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0FEDBE] text-black text-xs font-bold shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        FEATURED
                      </div>

                      {article.categories && article.categories[0] && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/50 text-[#0FEDBE] border border-[#0FEDBE]/30 backdrop-blur-sm">
                            {article.categories[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-4 relative">
                      <h3 className="text-2xl font-bold text-white group-hover:text-[#0FEDBE] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 line-clamp-2 leading-relaxed">
                        {article.excerpt || ""}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0FEDBE]/10 flex items-center justify-center text-[#0FEDBE] font-semibold overflow-hidden border border-[#0FEDBE]/20">
                            {getAuthorImageUrl(article) ? (
                              <Image
                                src={getAuthorImageUrl(article)!}
                                alt={article.author?.name || "Author"}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              article.author?.name?.charAt(0) || "A"
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {article.author?.name || "Anonymous"}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(article.publishedAt)}</span>
                              {article.readingTime && (
                                <>
                                  <span>•</span>
                                  <Clock className="w-3 h-3" />
                                  <span>{article.readingTime} min</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-[#0FEDBE] group-hover:translate-x-2 transition-transform">
                          →
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* All Articles */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl py-16 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-white">
              {searchQuery || selectedTags.length > 0
                ? "Search Results"
                : "Latest Articles"}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-[#1a1a1a] to-transparent" />
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0FEDBE]/10 mb-4">
                <Search className="w-8 h-8 text-[#0FEDBE]" />
              </div>
              <p className="text-xl text-gray-400 mb-2">
                {posts.length === 0
                  ? "No articles available yet. Check back soon!"
                  : "No articles found matching your criteria."}
              </p>
              {(searchQuery || selectedTags.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="mt-6 px-6 py-3 bg-[#0FEDBE] text-black rounded-xl hover:bg-[#0FEDBE]/90 transition-all font-semibold shadow-lg shadow-[#0FEDBE]/20"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <motion.article
                  key={article._id}
                  variants={itemVariants}
                  className="group relative bg-[#0a0a0a] rounded-xl overflow-hidden border border-[#1a1a1a] hover:border-[#0FEDBE]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#0FEDBE]/5"
                >
                  <Link
                    href={`/articles/${article.slug?.current}`}
                    className="block"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={getImageUrl(article)}
                        alt={article.mainImage?.alt || article.title || "Article image"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
                      {article.categories && article.categories[0] && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-[#0FEDBE]/90 text-black backdrop-blur-sm">
                            {article.categories[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#0FEDBE] transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {article.excerpt || ""}
                      </p>

                      {article.categories && article.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {article.categories.slice(0, 2).map((tag) => (
                            tag && (
                              <span
                                key={tag}
                                className="px-2 py-1 rounded-md text-xs bg-[#0FEDBE]/10 text-[#0FEDBE] border border-[#0FEDBE]/20"
                              >
                                {tag}
                              </span>
                            )
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-[#1a1a1a]">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#0FEDBE]/10 flex items-center justify-center text-[#0FEDBE] text-xs font-semibold overflow-hidden border border-[#0FEDBE]/20">
                            {getAuthorImageUrl(article) ? (
                              <Image
                                src={getAuthorImageUrl(article)!}
                                alt={article.author?.name || "Author"}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            ) : (
                              article.author?.name?.charAt(0) || "A"
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {article.author?.name || "Anonymous"}
                          </span>
                        </div>
                        {article.readingTime && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{article.readingTime} min</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
