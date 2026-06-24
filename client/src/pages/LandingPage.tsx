import { Link } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

const features = [
  {
    title: 'AI Summary',
    description:
      'Actionable summaries and insights that help you focus on what matters most each day.',
    icon: '✦',
  },
  {
    title: 'Cognitive Offloading',
    description:
      'An assistant that categorizes and prioritizes your thoughts so you can think less and do more.',
    icon: '◎',
  },
  {
    title: 'Tactile Interface',
    description:
      'Smooth interactions and subtle feedback designed to feel natural and distraction-free.',
    icon: '✎',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 pt-16 pb-20 text-center">
        <p className="mb-6 text-xs font-medium tracking-[0.25em] text-zinc-400 uppercase">
          The new standard for focus
        </p>
        <h1 className="text-4xl leading-tight font-semibold tracking-tight text-black md:text-5xl">
          Quiet productivity for deep thinkers and doers.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-500">
          Experience a task manager that recedes into the background. No noise,
          no cluttered dashboards—just you and your most important work, refined
          by AI.
        </p>
        <Link
          to="/signup"
          className="mt-10 inline-block rounded-md bg-black px-8 py-3 text-sm font-medium tracking-wide text-white uppercase transition hover:bg-zinc-800"
        >
          Start Focusing
        </Link>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-black">
              Today&apos;s Intentions
            </h3>
            <ul className="space-y-4 text-left">
              {[
                { text: 'Finalize design system documentation', done: true, time: '9:00 AM' },
                { text: 'Review architectural patterns for Q3', done: false, time: '11:30 AM' },
                { text: 'Lunch with creative lead', done: false, time: '1:00 PM' },
              ].map((task) => (
                <li key={task.text} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      task.done
                        ? 'border-black bg-black text-[10px] text-white'
                        : 'border-zinc-300'
                    }`}
                  >
                    {task.done ? '✓' : ''}
                  </span>
                  <span
                    className={`flex-1 text-sm ${
                      task.done ? 'text-zinc-400 line-through' : 'text-zinc-800'
                    }`}
                  >
                    {task.text}
                  </span>
                  <span className="text-xs text-zinc-400">{task.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
            <p className="mb-3 text-xs font-medium tracking-wider text-zinc-400 uppercase">
              AI Insight
            </p>
            <p className="text-left text-sm leading-relaxed text-zinc-600 italic">
              &ldquo;You are most productive before 11 AM. I&apos;ve rescheduled
              your deep work sessions to match your biological rhythm.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-black">
            Designed to disappear.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500">
            We believe the best productivity tool is the one you forget
            you&apos;re using. Our interface is built on the principles of
            reductionism.
          </p>

          <div className="mt-16 grid gap-10 text-left md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded border border-zinc-200 bg-white text-sm text-zinc-700">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-semibold text-black">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
