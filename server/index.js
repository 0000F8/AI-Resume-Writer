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

app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.post("/api/v1/cv", async (req, res) => {
  const { input, description } = req.body;

  try {
    console.log("Sending request to OpenAI");

    const content = generatePrompt(input, description);
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: content }],
      model: 'gpt-3.5-turbo',
      temperature: 1.1,
    });
    console.log("COMPLETED");
    console.log(completion.choices[0].message);

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
    Use the job description below to alter and return a new CV to match the job description better. 
    Rewrite the CV using the same tone and keywords from the job description then please return the CV in markdown.

    Here is the job description:

    ${description}
    ------

    Here is my CV:
    ${input}
  `;
}