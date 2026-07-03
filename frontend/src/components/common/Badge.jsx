const Badge = ({ children, color }) => {
  return (
    <span className={`badge badge-${color}`}>
      {children}
    </span>
  );
};

export default Badge;