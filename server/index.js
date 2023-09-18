// server/index.js

const express = require("express");

const path = require('path');

const PORT = process.env.PORT || 1337;

const app = express();

require('dotenv').config();

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const title = "Product Manager";

app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.post("/api/v1/cv", async (req, res) => {
  const { input, description } = req.body;

  try {
    console.log(new Date().toISOString(), "🙇 Sending request to OpenAI");

    const content = generatePrompt(input, description);
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: content }],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
    });
    console.log(new Date().toISOString(), "👍 Request complete.");
    // console.log(completion.choices[0].message);

    res.status(200).json({ result: completion.choices[0].message.content });

  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

function generatePrompt(input, description) {
  return `
  I want you to act as a resume writer and rewrite my CV using a job description for the position of ${title}.
  Please expand and highlight my relevant skills and experiences to make me stand out as an ideal candidate for this role.
  Please rewrite the experience section in my CV as many keywords from the job description as possible. 
  Return the new CV you generate in markdown. Highlight your changes using markdown.
  
  [CV Text]
  ${input}

  [Job Description]
  ${description}
  `;
}