"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Clock, TrendingUp, Tag, X } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl py-16 sm:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
              Market Insights &{" "}
              <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent">
                Analysis
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground text-balance">
              Stay informed with expert analysis, trading strategies, and market
              insights from industry professionals.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles by title, content, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="w-4 h-4" />
                  <span>Filter by tags:</span>
                </div>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedTags.includes(tag)
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {(searchQuery || selectedTags.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all duration-300 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
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
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Featured Articles
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((article, index) => (
                <motion.article
                  key={article._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                >
                  <Link
                    href={`/articles/${article.slug?.current}`}
                    className="block"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={getImageUrl(article)}
                        alt={article.mainImage?.alt || article.title || "Article image"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                      {article.categories && article.categories[0] && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                            {article.categories[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-4">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2">
                        {article.excerpt || ""}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold overflow-hidden">
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
                            <p className="text-sm font-medium text-foreground">
                              {article.author?.name || "Anonymous"}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(article.publishedAt)}</span>
                              {article.readingTime && (
                                <>
                                  <span>•</span>
                                  <Clock className="w-3 h-3" />
                                  <span>{article.readingTime} min read</span>
                                </>
                              )}
                            </div>
                          </div>
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
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-foreground">
            {searchQuery || selectedTags.length > 0
              ? "Search Results"
              : "Latest Articles"}
          </h2>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                {posts.length === 0
                  ? "No articles available yet. Check back soon!"
                  : "No articles found matching your criteria."}
              </p>
              {(searchQuery || selectedTags.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <motion.article
                  key={article._id}
                  variants={itemVariants}
                  className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
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
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                      {article.categories && article.categories[0] && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary/90 text-primary-foreground backdrop-blur-sm">
                            {article.categories[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.excerpt || ""}
                      </p>

                      {article.categories && article.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {article.categories.slice(0, 2).map((tag) => (
                            tag && (
                              <span
                                key={tag}
                                className="px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground"
                              >
                                {tag}
                              </span>
                            )
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold overflow-hidden">
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
                          <span className="text-xs text-muted-foreground">
                            {article.author?.name || "Anonymous"}
                          </span>
                        </div>
                        {article.readingTime && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{article.readingTime} min read</span>
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
