import Container from "@/app/_components/container";
import Image from "next/image";
import { FaCoffee, FaGithub } from "react-icons/fa";
import Header from "@/app/_components/header";

export default function About() {
  return (
    <main>
      <Container>
        <Header />
        <article className="mb-32">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-8 mt-10">
            <Image
              src="/assets/blog/authors/rm-terrell.jpg"
              alt="RM Terrell"
              width={300}
              height={300}
              className="rounded-2xl"
            />
            <Image
              src="/assets/blog/authors/asarigawa_onsen.jpg"
              alt="Asarigawa Onsen Skiing"
              width={400}
              height={400}
              className="rounded-2xl"
            />
          </div>

          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">About the Author</h1>
            <div className="flex justify-center space-x-4 mb-4">
              <a
                href="https://github.com/RM-Terrell"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="text-2xl text-gray-600 hover:text-gray-800" />
              </a>
              <a
                href="https://buymeacoffee.com/rm.terrell"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaCoffee className="text-2xl text-gray-600 hover:text-gray-800" />
              </a>
            </div>
            <p className="text-lg mb-8">
              I am a software engineer living in Boulder Colorado, where I am
              currently employed at Yes Energy working as a Java,
              React/Javascript, SQL, and Snowflake engineer. I also have
              experience using Go, Rust, Python, Kubernetes, Docker, Postgres
              and other related technologies building data intensive
              applications for a wide range of industries including medical and
              cloud application data management. I have a passion for well
              tested, clearly structured code and I've developed a passion for
              teaching other engineers and building them custom tools to enhance
              their workflows, along with promoting good documentation practices
              even when deadlines are tight.
            </p>
            <p className="text-lg mb-8">
              My distractions from work include mountain biking, skiing, and
              photography. I shamelessly use this blog to show off my amateur
              photography skills. I'm also actively trying to be a less terrible
              cook.
            </p>
            <p className="text-lg mb-8">
              Some notes on this blog and its contents: I dislike most blog
              websites. I won't name names but advertisements, popups, cookies,
              forced account logins, user telemetry, etc are in my opinion a
              cancer on knowledge. As such you will find none of that here. The
              source code of this blog is on{" "}
              <a href="https://github.com/RM-Terrell">my GitHub</a> and I've
              kept it as minimal as my obsessions over aesthetics will allow. It
              is currently built with Vercel and NextJS along with some
              customizations of my own. Enjoy the knowledge and experiences
              here, borrow and steal them all you want.
            </p>
            <p className="text-lg mb-8">
              That said. If you think the information and knowledge here was
              worth something, I have a Buy Me a Coffee page which can be found{" "}
              <a href="https://buymeacoffee.com/rm.terrell">here</a>. It will
              likely literally go towards fueling my problematic relationship
              with caffeine and encourage me to continue writing and building
              community tools.
            </p>
            <p className="text-lg">Cheers.</p>
          </div>
        </article>
      </Container>
    </main>
  );
}
