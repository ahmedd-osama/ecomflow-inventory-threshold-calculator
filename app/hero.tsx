import { LinesSeparator } from "@/components/lines-separator";
import Image from "next/image";
import Link from "next/link";

export const Hero = () => {
  return (
    <>
      {" "}
      <section className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
          EcomFlow <br />
          Inventory Threshold Calculator
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Calculate optimal inventory thresholds for your products using
          historical data and advanced analytics
        </p>
        <p className="mt-4 text-xl font-medium">
          Developed By:{" "}
          <Link target="_blank" className="underline" href={"https://osma.dev"}>
            Ahmed Osama{" "}
            <Image
              src="/logo.svg"
              alt="Ahmed Osama"
              width={30}
              height={30}
              className="inline"
            />
          </Link>
        </p>
      </section>
      <LinesSeparator />
      <section className="flex flex-col items-center justify-center text-center px-4 md:px-8">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
          Tech Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mt-10">
          <div>
            <p className="text-xl">Built using the following technologies:</p>
            <ul className="mt-4 list-disc list-inside text-lg px-10 md:px-24 text-start">
              <li>Next.js 15.2.0-canary</li>
              <li>Tailwind CSS V.4</li>
              <li>TypeScript</li>
              <li>Shadcn UI</li>
            </ul>
          </div>
          <div>
            <p className="text-xl">Used external libraries and tools:</p>
            <ul className="mt-4 list-disc list-inside text-lg px-10 md:px-24 text-start">
              {/*  */}
              <li>Cursor</li>
              <li>Zod</li>
              <li>React Hook Form</li>
              <li>Shadcn Charts</li>
              <li>MongoDB</li>
            </ul>
          </div>
        </div>
        <h3 className="text-2xl font-semibold my-8">
          Total Development Time:{" "}
          <span className="font-bold rounded-lg border-gray-400 border px-2 py-1">
            2 hours : 30 Mins
          </span>
        </h3>
      </section>
    </>
  );
};
