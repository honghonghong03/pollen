import { TOPICS } from '../data/mock';

export default function TopicFilter({ selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {TOPICS.map((topic) => (
        <button
          key={topic}
          onClick={() => onSelect(topic)}
          className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected === topic
              ? 'bg-stem text-white'
              : 'bg-white text-soil-light hover:bg-petal-dark'
          }`}
        >
          {topic}
        </button>
      ))}
    </div>
  );
}
