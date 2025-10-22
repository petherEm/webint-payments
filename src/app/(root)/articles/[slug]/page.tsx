import { getPostBySlug } from "@/sanity/lib/queries/getPostBySlug";
import { notFound } from "next/navigation";
import ArticleContent from "./ArticleContent";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <ArticleContent post={post} />;
}
