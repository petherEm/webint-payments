import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllPosts = async () => {
  const ALL_POSTS_QUERY = defineQuery(
    `*[_type == "post"] {
      _id,
      title,
      slug,
      "excerpt": array::join(string::split((pt::text(body)), "")[0..200], "") + "...",
      "author": author->{
        _id,
        name,
        slug,
        title,
        bio,
        linkedin,
        github,
        image{
          asset,
          alt
        }
      },
      mainImage{
        asset,
        alt
      },
      "categories": categories[]->title,
      publishedAt,
      isFeatured,
      readingTime,
      body
    } | order(publishedAt desc)`
  );
  
  try {
    const posts = await sanityFetch({
      query: ALL_POSTS_QUERY,
    });
    return posts.data || [];
  } catch (error) {
    console.error("Error fetching all posts", error);
    return [];
  }
};