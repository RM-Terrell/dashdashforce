import Link from "next/link";
import DateFormatter from "./date-formatter";
import cn from "classnames";

type Props = {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  isHero?: boolean;
};

export function PostPreview({
  title,
  date,
  excerpt,
  slug,
  isHero = false,
}: Props) {
  return (
    <div>
      <h3
        className={cn("leading-snug mb-3", {
          "text-3xl": !isHero,
          "text-4xl lg:text-5xl": isHero,
        })}
      >
        <Link href={`/posts/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h3>
      <div className="text-lg mb-4">
        <DateFormatter dateString={date} />
      </div>
      <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
    </div>
  );
}
