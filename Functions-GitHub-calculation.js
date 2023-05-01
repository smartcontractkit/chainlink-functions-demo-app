/** @typedef {import('./FunctionsSandboxLibrary/Functions').FunctionsModule} FunctionsModule */
/** @var {FunctionsModule.prototype} Functions */
/** @var {[ repo: string, target: string, amount: string ]} args */
const [repo, target, amount] = args;

const url = repo
  .replace('github.com/', 'github.com/repos/')
  .replace(/(https:\/\/)(.*)(github\.com.*)/, '$1api.$3');
/** @var {{ data: { stargazers_count: string }}} res */
const res = await Functions.makeHttpRequest({ url });
const stars = +res.data.stargazers_count;
if (typeof stars !== 'number') {
  throw new Error('Could not get the amount of stars for repo ' + repo);
}

const result = Math.floor(stars / +target) * +amount;

// noinspection JSAnnotator
return Functions.encodeUint256(result);
