import { Link } from 'react-router-dom';
import { allCountries } from '@/data';

const planningSteps = [
  {
    title: 'Start with your travel month',
    description: 'If your dates are fixed, compare destinations for that month rather than assuming summer is best everywhere. Check regional rainy seasons, winter access and daylight before choosing your route.',
    path: '/months',
    link: 'Explore where to travel from January to December',
  },
  {
    title: 'Compare the places you want to visit',
    description: 'If you already have a country in mind, use its recommended months and seasonal notes as a starting point. Coastal areas, mountain regions and cities can have different travel windows within the same country.',
    path: '/countries',
    link: 'Compare country guides and best visiting months',
  },
  {
    title: 'Choose the experience that matters',
    description: 'A beach holiday, a hiking trip and an aurora journey call for different conditions. Find destinations by interest, then check activity access and local conditions for your intended dates.',
    path: '/experiences',
    link: 'Find nature, culture, beach and adventure trips',
  },
];

const questions = [
  {
    question: 'What is When to Wander?',
    answer: `When to Wander (WhentoWander) is a free seasonal travel discovery website with guides to ${allCountries.length} countries. It helps you decide where to go and when, using recommended travel months, regional highlights, festivals and natural wonders. It is a planning resource, not a booking service.`,
    path: '/about',
    link: 'Learn how to use When to Wander',
  },
  {
    question: 'How do I find the best time to visit a country?',
    answer: 'Start with the country guide, then compare the specific regions and activities on your itinerary. A recommended month is a broad seasonal suggestion, not a guarantee of good weather or low prices. Check current forecasts, entry requirements and official travel advice before booking.',
    path: '/countries',
    link: 'Find your country travel guide',
  },
  {
    question: 'Can I plan a trip around festivals or natural wonders?',
    answer: 'Yes. Explore events and seasonal phenomena such as blossoms, northern lights and wildlife migrations. These depend on location and changing conditions; event dates can also move each year. Confirm dates with organisers and check local reports instead of treating a seasonal window as a guaranteed sighting.',
    path: '/phenomena',
    link: 'Explore seasonal natural wonders',
  },
  {
    question: 'Does shoulder season always mean cheaper, quieter travel?',
    answer: 'No. The weeks between peak and low season can offer a useful balance, but school holidays, festivals and local demand may keep prices high. Transport or attractions may run reduced schedules. Compare actual fares, accommodation availability and opening dates for the places you plan to visit.',
    path: '/months',
    link: 'Compare travel ideas by month',
  },
];

export function TravelPlanningGuide() {
  return (
    <section aria-labelledby="planning-guide-heading" className="bg-stone-900 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 id="planning-guide-heading" className="text-2xl font-bold tracking-tight text-white md:text-3xl">Seasonal travel guides: where to go and when</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone-300">
          When to Wander helps you compare the best times to visit {allCountries.length} countries, from city breaks and coastal escapes to mountain journeys.
          Start with your dates, a destination or an experience, then use the guides to build a trip around the seasons rather than a single worldwide “best month”.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {planningSteps.map((step, index) => (
            <article key={step.path} className="rounded-2xl border border-white/10 bg-stone-950 p-6">
              <h3 className="text-lg font-semibold text-white">{index + 1}. {step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-300">{step.description}</p>
              <Link to={step.path} className="mt-4 inline-block text-sm font-medium text-amber-300 underline underline-offset-4 hover:text-amber-200">{step.link}</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TravelPlanningFaq() {
  return (
    <section aria-labelledby="planning-faq-heading" className="bg-stone-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 id="planning-faq-heading" className="text-2xl font-bold tracking-tight text-white md:text-3xl">Questions about planning a seasonal trip</h2>
        <div className="mt-8 space-y-4">
          {questions.map(item => (
            <details key={item.question} className="rounded-xl border border-white/10 bg-stone-900 p-5">
              <summary className="cursor-pointer text-base font-semibold text-white">{item.question}</summary>
              <p className="mt-4 text-sm leading-relaxed text-stone-300">{item.answer}</p>
              <Link to={item.path} className="mt-3 inline-block text-sm text-amber-300 underline underline-offset-4 hover:text-amber-200">{item.link}</Link>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
