"use client";

import { useState, useEffect } from "react";
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

interface ArticleContentProps {
  post: NonNullable<POST_BY_SLUG_QUERYResult>;
}

export default function ArticleContent({ post }: ArticleContentProps) {
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Extract headings for table of contents
  const headings = post.body
    ? (post.body as any[])
        .filter(
          (block: any) => block.style && ["h2", "h3"].includes(block.style)
        )
        .map((block: any, index: number) => ({
          id: `heading-${index}`,
          text: block.children?.map((child: any) => child.text).join("") || "",
          level: block.style,
        }))
    : [];

  // Track active heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map((h) =>
        document.getElementById(h.id)
      );
      const scrollPosition = window.scrollY + 100;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveHeading(headings[i].id);
          return;
        }
      }
    };

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
          <div className="my-8 rounded-xl overflow-hidden border border-[#1a1a1a]">
            <Image
              src={urlFor(value).url()}
              alt={value.alt || "Article image"}
              width={1200}
              height={600}
              className="w-full h-auto"
            />
            {value.alt && (
              <p className="text-sm text-gray-400 text-center py-2 bg-[#0a0a0a]">
                {value.alt}
              </p>
            )}
          </div>
        );
      },
      code: ({ value }: any) => {
        const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;
        return (
          <div className="my-6 group relative">
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={() => copyCode(value.code, codeId)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-xs text-gray-300 hover:text-[#0FEDBE] hover:border-[#0FEDBE] transition-all"
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
            <div className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden">
              <div className="px-4 py-2 border-b border-[#1a1a1a] text-xs text-gray-400 font-mono">
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
      h2: ({ children, value }: any) => {
        const index = headings.findIndex((h) => h.text === children?.[0]);
        const id = index >= 0 ? headings[index].id : "";
        return (
          <h2
            id={id}
            className="text-3xl font-bold text-white mt-12 mb-4 scroll-mt-24"
          >
            {children}
          </h2>
        );
      },
      h3: ({ children, value }: any) => {
        const index = headings.findIndex((h) => h.text === children?.[0]);
        const id = index >= 0 ? headings[index].id : "";
        return (
          <h3
            id={id}
            className="text-2xl font-bold text-white mt-8 mb-3 scroll-mt-24"
          >
            {children}
          </h3>
        );
      },
      h4: ({ children }: any) => (
        <h4 className="text-xl font-bold text-white mt-6 mb-2">{children}</h4>
      ),
      normal: ({ children }: any) => (
        <p className="text-gray-300 leading-relaxed mb-4">{children}</p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-[#0FEDBE] pl-6 py-2 my-6 italic text-gray-300 bg-[#0a0a0a] rounded-r-lg">
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
        <code className="px-2 py-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#0FEDBE] text-sm font-mono">
          {children}
        </code>
      ),
      link: ({ children, value }: any) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0FEDBE] hover:underline font-medium"
        >
          {children}
        </a>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">
          {children}
        </ul>
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
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#0FEDBE] transition-colors group"
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
                    className="px-3 py-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-full text-[#0FEDBE] text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
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
                    className="rounded-full border-2 border-[#0FEDBE]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0FEDBE] to-[#0FEDBE]/50 flex items-center justify-center text-black font-bold text-lg">
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
              <div className="rounded-2xl overflow-hidden border border-[#1a1a1a] mb-12">
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
              <div className="mt-12 pt-8 border-t border-[#1a1a1a]">
                <h3 className="text-xl font-bold mb-4 text-white">
                  Share this article
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={shareOnTwitter}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg hover:border-[#0FEDBE] hover:text-[#0FEDBE] transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    Twitter
                  </button>
                  <button
                    onClick={shareOnLinkedIn}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg hover:border-[#0FEDBE] hover:text-[#0FEDBE] transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </button>
                  <button
                    onClick={shareOnFacebook}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg hover:border-[#0FEDBE] hover:text-[#0FEDBE] transition-all"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </button>
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg hover:border-[#0FEDBE] hover:text-[#0FEDBE] transition-all"
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
                        className="rounded-full border-2 border-[#0FEDBE]"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0FEDBE] to-[#0FEDBE]/50 flex items-center justify-center text-black font-bold text-2xl">
                        {post.author.name?.[0] || "A"}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1 text-white">
                        {post.author.name}
                      </h3>
                      {post.author.title && (
                        <p className="text-[#0FEDBE] mb-3">
                          {post.author.title}
                        </p>
                      )}
                      {post.author.bio && (
                        <div className="text-gray-300 mb-4">
                          <PortableText value={post.author.bio} />
                        </div>
                      )}
                      <div className="flex gap-3">
                        {post.author.linkedin && (
                          <a
                            href={post.author.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#0FEDBE] transition-colors"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {post.author.github && (
                          <a
                            href={post.author.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#0FEDBE] transition-colors"
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
                  <div className="p-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#0FEDBE]">
                      Table of Contents
                    </h3>
                    <nav className="space-y-2">
                      {headings.map((heading) => (
                        <a
                          key={heading.id}
                          href={`#${heading.id}`}
                          className={`block text-sm transition-colors ${
                            heading.level === "h3" ? "pl-4" : ""
                          } ${
                            activeHeading === heading.id
                              ? "text-[#0FEDBE] font-medium"
                              : "text-gray-400 hover:text-gray-200"
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
