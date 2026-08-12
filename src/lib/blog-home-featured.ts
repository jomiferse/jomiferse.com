interface HomeFeaturedPost {
	id: string;
	data: {
		homeFeatured?: number;
	};
}

export function selectHomeFeaturedBlogPosts<T extends HomeFeaturedPost>(
	posts: T[],
) {
	const selected = posts.filter(
		(post) => typeof post.data.homeFeatured === "number",
	);
	const positions = selected.map((post) => post.data.homeFeatured as number);

	if (new Set(positions).size !== positions.length) {
		throw new Error("Home featured blog positions must be unique per locale");
	}

	return selected.sort(
		(a, b) => (a.data.homeFeatured as number) - (b.data.homeFeatured as number),
	);
}
