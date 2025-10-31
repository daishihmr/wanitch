const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "TODO",
});

const username = 'だいし'
const userid = 'daishihmr'

const response = openai.responses.create({
  model: "gpt-5-nano",
  input: `Twitch配信者「${username} (id: ${userid})」を200文字以内で簡単に紹介してください`,
  store: true,
});

response
  .then((result) => console.log(result.output_text))
  .catch((error) => console.error(error));
