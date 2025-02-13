import { Post } from "@/interfaces/post";
import { PostPreview } from "./post-preview";

type Props = {
  posts: Post[];
};

export function MoreStories({ posts }: Props) {
  return (
    <section>
      <h2 className="mb-8 text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
        Other Writings
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
        {posts.map((post) => (
            <div key={post.slug} className="border-b border-gray-400 p-4 dark:border-gray-600">
                <PostPreview
                    title={post.title}
                    date={post.date}
                    slug={post.slug}
                    excerpt={post.excerpt}
                />
            </div>
        ))}
      </div>
    </section>
  );
}
