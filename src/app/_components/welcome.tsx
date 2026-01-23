import Link from "next/link";

const Welcome = () => {
  return (
    <div>
      <div>
        <div>
          <Link href="/chat">
            <button className="rounded-lg bg-pink-500 px-6 py-3 font-semibold text-white transition hover:bg-pink-600">
              Go to chat
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
