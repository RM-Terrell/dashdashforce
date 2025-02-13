import { AboutTheAuthor } from "@/app/_components/about-the-author";

export function Intro() {
  return (
    <section className="flex flex-col md:flex-row items-center md:justify-between mt-16 mb-16 md:mb-12">
      <div className="flex flex-col items-center md:items-start">
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
          Dashdashforce
        </h1>
        <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
          Misadventures in software engineering
        </h4>
      </div>
      <AboutTheAuthor />
    </section>
  );
}
