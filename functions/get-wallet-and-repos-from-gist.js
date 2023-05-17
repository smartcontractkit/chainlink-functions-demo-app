const [url, sender] = args;

if (!/^https:\/\/gist\.github\.com/.test(url)) {
  throw new Error('supplied URL must be a GitHub gist');
}
const id = url.split('/').at(-1);
const { data } = await Functions.makeHttpRequest({
  url: `https://api.github.com/gists/${id}`,
});

const files = Object.values(data.files);
if (files.length === 0) {
  throw new Error('There are no files in the provided gist');
}

const wallet = Object.values(data.files)[0].content;
if (wallet.slice(0, 2) !== '0x' || wallet.length < 34 || wallet.length > 62) {
  throw new Error('Gist does not contain a valid address');
}
if (sender.toLowerCase() !== wallet.toLowerCase()) {
  throw new Error('Sender and found address do not match');
}

// noinspection JSAnnotator
return Functions.encodeString(data.owner.login);
