export const isPublishedBlogPost = (data: { draft?: boolean }) => !data.draft;
