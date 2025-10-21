import { getAllPosts } from "@/sanity/lib/queries/getAllPosts";
import ArticlesClient from "./ArticlesClient";

export default async function ArticlesPage() {
  const posts = await getAllPosts();

  return <ArticlesClient posts={posts} />;
}
