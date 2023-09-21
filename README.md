# AI Resume Writer (POC)

This proof-of-concept will provide an interface for modifying your CV to fit the description of job using remote API calls to an LLM such as ChatGPT.

# TECH

Node/React/LLMs

## INSTALL

You really just need node, run npm install, then generate an OpenAI key, and place it in the server's .env

## RUNNING

in client directory:

```
npm run watch
```

in server directory:

```
npm run start
```

## USING

You'll be presented by a page on http://localhost:1337/ where you can input your CV and the job description.

It will return a modified CV and cover letter.


