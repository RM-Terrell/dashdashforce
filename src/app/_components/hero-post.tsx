import CoverImage from "@/app/_components/cover-image";
import { PostPreview } from "./post-preview";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  slug: string;
};

export function HeroPost({ title, coverImage, date, excerpt, slug }: Props) {
  return (
    <section>
      <div className="mb-8 md:mb-16">
        <CoverImage title={title} src={coverImage} slug={slug} />
      </div>
      <div className="mb-20 md:mb-28 border-b border-gray-400 p-4 dark:border-gray-600">
        <PostPreview
          title={title}
          date={date}
          slug={slug}
          excerpt={excerpt}
          isHero
        />
      </div>
    </section>
  );
}
