export const getSeverityCount = (incidents, severity) => {
  return incidents.filter(
    (incident) => incident.severity === severity
  ).length;
};