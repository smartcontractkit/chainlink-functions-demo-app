const [repo, metric, target, amount] = args;

if (metric !== 'stars' && metric !== 'forks') {
  throw new Error('Metric needs to be either "stars" or "forks"');
}
const metricKey = { stars: 'stargazers_count', forks: 'forks_count' }[metric];

const url = repo
  .replace('github.com/', 'github.com/repos/')
  .replace(/(https:\/\/)(.*)(github\.com.*)/, '$1api.$3');
const res = await Functions.makeHttpRequest({ url });
const metricCount = +res.data[metricKey];
if (typeof metricCount !== 'number') {
  throw new Error('Could not get the amount of metric for repo ' + repo);
}
if (metricCount === 0) {
  // noinspection JSAnnotator
  return Functions.encodeUint256(0);
}

const result = Math.floor(metricCount / +target) * +amount;

// noinspection JSAnnotator
return Functions.encodeUint256(result);
