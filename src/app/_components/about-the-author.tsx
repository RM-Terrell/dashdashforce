import Avatar from "@/app/_components/avatar";
import Link from "next/link";

export const AboutTheAuthor = () => {
  return (
    <Link href="/about" className="hover:underline about-the-author">
      <Avatar name="RM Terrell" picture="/assets/blog/authors/rm-terrell-small.jpg" />
    </Link>
  );
};
