"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Linkedin,
  Facebook,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { PortableText } from "@portabletext/react";
import type { POST_BY_SLUG_QUERYResult } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";

// Helper function to extract text from React children
const extractTextFromChildren = (children: any): string => {
  if (!children) return '';

  if (typeof children === 'string') return children;

  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }

  if (typeof children === 'object' && children.props) {
    return extractTextFromChildren(children.props.children);
  }

  return '';
};

// Helper function to create URL-safe IDs from heading text
const slugify = (text: string): string => {
  if (!text || typeof text !== 'string') return '';

  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

interface ArticleContentProps {
  post: NonNullable<POST_BY_SLUG_QUERYResult>;
}

export default function ArticleContent({ post }: ArticleContentProps) {
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Extract headings for table of contents with memoization
  const headings = useMemo(() => {
    if (!post.body) return [];

    return (post.body as any[])
      .filter((block: any) =>
        block.style && ["h1", "h2", "h3", "h4"].includes(block.style)
      )
      .map((block: any) => {
        const text = block.children?.map((child: any) => child.text || "").join("") || "";
        const id = slugify(text);
        return {
          id,
          text,
          level: block.style,
        };
      })
      .filter(h => h.text && h.id); // Remove empty headings or headings without valid IDs
  }, [post.body]);

  // Track active heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map((h) =>
        document.getElementById(h.id)
      );
      const scrollPosition = window.scrollY + 150;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveHeading(headings[i].id);
          return;
        }
      }

      // If we're at the top, clear active heading
      if (window.scrollY < 100) {
        setActiveHeading("");
      }
    };

    handleScroll(); // Run on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const shareOnTwitter = () => {
    const url = window.location.href;
    const text = `Check out: ${post.title}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareOnLinkedIn = () => {
    const url = window.location.href;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const portableTextComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset) return null;
        return (
          <div className="my-10 rounded-xl overflow-hidden border border-[#1a1a1a] shadow-lg">
            <Image
              src={urlFor(value).url()}
              alt={value.alt || "Article image"}
              width={1200}
              height={600}
              className="w-full h-auto"
            />
            {value.alt && (
              <p className="text-sm text-gray-400 text-center py-3 bg-[#0a0a0a] border-t border-[#1a1a1a]">
                {value.alt}
              </p>
            )}
          </div>
        );
      },
      code: ({ value }: any) => {
        const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;
        return (
          <div className="my-8 group relative">
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={() => copyCode(value.code, codeId)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-xs text-gray-300 hover:text-green-500 hover:border-green-500 transition-all"
              >
                {copied === codeId ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden shadow-lg">
              <div className="px-4 py-2 border-b border-[#1a1a1a] text-xs text-green-500 font-mono font-semibold">
                {value.language || "code"}
              </div>
              <pre className="p-6 overflow-x-auto text-sm leading-relaxed">
                <code className="font-mono text-gray-300">{value.code}</code>
              </pre>
            </div>
          </div>
        );
      },
    },
    block: {
      h1: ({ children }: any) => {
        const text = extractTextFromChildren(children);
        const id = slugify(text);
        return (
          <h1
            id={id}
            className="text-4xl md:text-5xl font-bold text-white mt-16 mb-6 scroll-mt-24 border-b border-[#1a1a1a] pb-4"
          >
            {children}
          </h1>
        );
      },
      h2: ({ children }: any) => {
        const text = extractTextFromChildren(children);
        const id = slugify(text);
        return (
          <h2
            id={id}
            className="text-3xl md:text-4xl font-bold text-white mt-14 mb-5 scroll-mt-24 border-l-4 border-green-500 pl-4"
          >
            {children}
          </h2>
        );
      },
      h3: ({ children }: any) => {
        const text = extractTextFromChildren(children);
        const id = slugify(text);
        return (
          <h3
            id={id}
            className="text-2xl md:text-3xl font-bold text-white mt-10 mb-4 scroll-mt-24"
          >
            {children}
          </h3>
        );
      },
      h4: ({ children }: any) => {
        const text = extractTextFromChildren(children);
        const id = slugify(text);
        return (
          <h4
            id={id}
            className="text-xl md:text-2xl font-bold text-white mt-8 mb-3 scroll-mt-24"
          >
            {children}
          </h4>
        );
      },
      normal: ({ children }: any) => (
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          {children}
        </p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-green-500 pl-6 py-4 my-8 italic text-gray-300 bg-[#0a0a0a] rounded-r-lg">
          {children}
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }: any) => (
        <strong className="font-bold text-white">{children}</strong>
      ),
      em: ({ children }: any) => <em className="italic">{children}</em>,
      code: ({ children }: any) => (
        <code className="px-2 py-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-green-500 text-sm font-mono">
          {children}
        </code>
      ),
      link: ({ children, value }: any) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-500 hover:text-green-400 underline underline-offset-4 font-medium transition-colors"
        >
          {children}
        </a>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc list-outside ml-6 space-y-3 mb-6 text-gray-300 text-lg">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal list-outside ml-6 space-y-3 mb-6 text-gray-300 text-lg">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => (
        <li className="pl-2">{children}</li>
      ),
      number: ({ children }: any) => (
        <li className="pl-2">{children}</li>
      ),
    },
  };

  const authorImageUrl = post.author?.image?.asset
    ? urlFor(post.author.image).width(200).height(200).url()
    : null;

  const mainImageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : null;

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            image: mainImageUrl,
            datePublished: post.publishedAt,
            author: {
              "@type": "Person",
              name: post.author?.name,
            },
          }),
        }}
      />

      <div className="min-h-screen bg-[#050505] text-gray-100">
        {/* Back to Blog */}
        <div className="container mx-auto px-6 pt-24 pb-8">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#0a0a0a] border border-green-500/30 rounded-full text-green-500 text-sm font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                {authorImageUrl ? (
                  <Image
                    src={authorImageUrl}
                    alt={post.author?.name || "Author"}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-green-500"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-black font-bold text-lg">
                    {post.author?.name?.[0] || "A"}
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">{post.author?.name}</p>
                  {post.author?.title && (
                    <p className="text-sm text-gray-400">{post.author.title}</p>
                  )}
                </div>
              </div>
              <div className="h-6 w-px bg-[#1a1a1a]" />
              <div className="text-sm text-gray-400">
                <p>{publishedDate}</p>
                {post.readingTime && <p>{post.readingTime} min read</p>}
              </div>
            </div>

            {/* Featured Image */}
            {mainImageUrl && (
              <div className="rounded-2xl overflow-hidden border border-[#1a1a1a] mb-12 shadow-2xl">
                <Image
                  src={mainImageUrl}
                  alt={post.mainImage?.alt || post.title || "Article image"}
                  width={1200}
                  height={630}
                  className="w-full h-auto"
                  priority
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 pb-24">
          <div className="max-w-7xl mx-auto flex gap-12">
            {/* Article Content */}
            <article className="flex-1 max-w-4xl">
              <div className="prose prose-invert prose-lg max-w-none">
                {post.body && (
                  <PortableText
                    value={post.body}
                    components={portableTextComponents}
                  />
                )}
              </div>

              {/* Share Section */}
              <div className="mt-16 pt-8 border-t border-[#1a1a1a]">
                <h3 className="text-xl font-bold mb-4 text-white">
                  Share this article
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={shareOnTwitter}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg hover:border-green-500 hover:text-green-500 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    Twitter
                  </button>
                  <button
                    onClick={shareOnLinkedIn}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg hover:border-green-500 hover:text-green-500 transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </button>
                  <button
                    onClick={shareOnFacebook}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg hover:border-green-500 hover:text-green-500 transition-all"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </button>
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg hover:border-green-500 hover:text-green-500 transition-all"
                  >
                    {linkCopied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Author Bio */}
              {post.author && (
                <div className="mt-12 p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl">
                  <div className="flex items-start gap-6">
                    {authorImageUrl ? (
                      <Image
                        src={authorImageUrl}
                        alt={post.author.name || "Author"}
                        width={80}
                        height={80}
                        className="rounded-full border-2 border-green-500"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-black font-bold text-2xl flex-shrink-0">
                        {post.author.name?.[0] || "A"}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1 text-white">
                        {post.author.name}
                      </h3>
                      {post.author.title && (
                        <p className="text-green-500 mb-3 font-medium">
                          {post.author.title}
                        </p>
                      )}
                      {post.author.bio && (
                        <div className="text-gray-300 mb-4 text-base">
                          <PortableText value={post.author.bio} />
                        </div>
                      )}
                      <div className="flex gap-3">
                        {post.author.linkedin && (
                          <a
                            href={post.author.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-green-500 transition-colors"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {post.author.github && (
                          <a
                            href={post.author.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-green-500 transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar - Table of Contents */}
            {headings.length > 0 && (
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <div className="p-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl shadow-lg">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-green-500">
                      Table of Contents
                    </h3>
                    <nav className="space-y-1">
                      {headings.map((heading) => (
                        <a
                          key={heading.id}
                          href={`#${heading.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(heading.id);
                            if (element) {
                              const offset = 100;
                              const elementPosition = element.getBoundingClientRect().top;
                              const offsetPosition = elementPosition + window.pageYOffset - offset;
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth"
                              });
                            }
                          }}
                          className={`block text-sm transition-colors py-1.5 px-2 rounded ${
                            heading.level === "h1" ? "" :
                            heading.level === "h2" ? "pl-3" :
                            heading.level === "h3" ? "pl-6" :
                            "pl-9"
                          } ${
                            activeHeading === heading.id
                              ? "text-green-500 font-semibold bg-green-500/10"
                              : "text-gray-400 hover:text-gray-200 hover:bg-[#141414]"
                          }`}
                        >
                          {heading.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
