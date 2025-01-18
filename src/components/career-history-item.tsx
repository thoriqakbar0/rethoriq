interface CareerData {
  company: string;
  duration: string;
  achievements: string[];
}

export default function CareerHistoryItem({ data }: { data: CareerData }) {
  return (
    <div className="text-xl">
      <span className="font-bold">{data.company}. </span>
      <span className="font-normal">{data.duration}</span>
      {data.achievements.length > 0 ? <ul className="list-disc pl-6">
        {data.achievements.map((achievement, index) => (
          <li key={index} className="tracking-tighter font-light">{achievement}</li>
        ))}
      </ul> : <div className="font-light tracking-tighter opacity-65 text-xl">pending</div>}
    </div>
  );
}

// Usage example
// <Career data={careerData} />
