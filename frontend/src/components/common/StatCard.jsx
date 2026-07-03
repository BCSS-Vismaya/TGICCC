import Card from "./Card";

const StatCard = ({ title, value, color }) => {
  return (
    <Card className="stat-card">

      <p>{title}</p>

      <h2
        style={{
          color,
        }}
      >
        {value}
      </h2>

    </Card>
  );
};

export default StatCard;