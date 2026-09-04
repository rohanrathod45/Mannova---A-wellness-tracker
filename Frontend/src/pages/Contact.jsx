import Layout from "../components/Layout";

export default function Contact() {
  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 mb-4">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            We're Here to Support You
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Have questions, feedback, or need guidance? Reach out to the Mannova team anytime.
          </p>
        </header>

        <div className="bg-white dark:bg-[#121b2d] rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-md">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#172338] text-gray-800 dark:text-white outline-none focus:border-violet-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#172338] text-gray-800 dark:text-white outline-none focus:border-violet-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="How can we help you today?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#172338] text-gray-800 dark:text-white outline-none focus:border-violet-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold shadow-lg hover:shadow-purple-500/25 transition cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}