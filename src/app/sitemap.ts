import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://portfolio.example.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/nextjs-portfolio`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/web-design-principles`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/typescript-guide`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.6,
    },
  ];
}
