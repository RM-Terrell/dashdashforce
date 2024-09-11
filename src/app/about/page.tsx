import Container from "@/app/_components/container";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import Header from "@/app/_components/header";

export default function About() {
  return (
    <Container>
      <Header />
      <div className="flex flex-col items-center text-center mt-10">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
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
        <h1 className="text-4xl font-bold mb-4">About the Author</h1>
        <p className="text-lg mb-8">
          I am a software engineer living in Boulder Colorado, where I am
          currently employed at Yes Energy working as a Java, Rust, SQL, and
          Javascript Engineer. I also have experience using Go, Python, React,
          Kubernetes, Docker, MongoDB, and other technologies building data
          intensive applications for a wide range of industries including
          medical and cloud application data management.
        </p>
        <p className="text-lg mb-8">
          I have a passion for well tested and clearly structured code with
          experience in Jest, React Testing Library, Enzyme, Pytest, Postman,
          Golang testing, and Cypress/Selenium. I've also developed a passion
          for teaching other engineers and building them custom tools to enhance
          their workflows.
        </p>
        <p className="text-lg mb-8">
          My distractions from work include mountain biking, skiing, and
          photography. I shamelessly use this blog to show off my amateur
          photography skills. I'm also actively trying to be a less terrible
          cook.
        </p>
        <p className="text-lg mb-8">
          Some notes on this blog and its contents: I hate most blog websites. I
          won't name names but advertisements, popups, cookies, forced account
          logins, user telemetry, etc are in my opinion a cancer on knowledge. As
          such you will find none of that here. The source code of this blog is
          on [my GitHub](https://github.com/RM-Terrell) and I've kept it as
          minimal as my obsessions over aesthetics will allow. It is currently
          built with Vercel's NextJS system along with some customizations of my
          own. Enjoy the knowledge and experiences here, borrow and steal them
          all you want. I hope you and your AI scraper find them useful.
        </p>
        <div className="flex space-x-4">
          <a
            href="https://github.com/RM-Terrell"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-2xl text-gray-600 hover:text-gray-800" />
          </a>
        </div>
      </div>
    </Container>
  );
}
