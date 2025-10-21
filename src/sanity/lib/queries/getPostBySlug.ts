import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getPostBySlug = async (slug: string) => {
  const POST_BY_SLUG_QUERY = defineQuery(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
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
      body,
      seo{
        metaTitle,
        metaDescription,
        keywords,
        openGraphImage{
          asset,
          alt
        },
        noIndex,
        canonical
      }
    }`
  );
  
  try {
    const post = await sanityFetch({
      query: POST_BY_SLUG_QUERY,
      params: { slug },
    });
    return post.data || null;
  } catch (error) {
    console.error("Error fetching post by slug", error);
    return null;
  }
};