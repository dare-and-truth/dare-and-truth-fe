export const formatScores = (scores: number) => {
  if (scores < 10_000) return scores.toString();

  const kScores = (scores / 1000).toFixed(2); // Chia cho 1000 và giữ 2 số thập phân
  return kScores.endsWith('.00') ? `${parseInt(kScores)} K` : `${kScores} K`;
};
