import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Grid from '@mui/material/Unstable_Grid2';
import "./App.css";
import { Button, Container, LinearProgress, Typography } from "@mui/material";

function App() {

  const [cv, setCv] = useState('');
  const [altCv, setAltCv] = useState('');
  const [description, setDescription] = useState('');
  const [wait, setWait] = useState(false);

  const sites = [
    "https://www.indeed.com/",
    "https://glassdoor.com/",
    "https://remoteok.com/",
    "https://www.ziprecruiter.com/",
    "https://www.theladders.com/",
    "https://wellfound.com/",
    "https://www.linkedin.com/",
    "https://getwork.com/",
    "https://www.snagajob.com/",
    "https://www.monster.com/",
    "https://www.flexjobs.com/"
  ]

  const sendCV = () => {
    setWait(true);
    setAltCv('');
    fetch("/api/v1/cv", {
      method: "POST", // Use the POST method
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify({ input: cv, description: description }), // Replace with your desired parameters
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.result);
        setWait(false);
        setAltCv(data.result);
      });
  }

  const renderSites = () => {
    return (sites).map((site)=>{
      return (
        <div>
          <a href={site} target="_blank" rel="noreferrer">{site}</a>
        </div>
      )
    });
  }

  const loadingBar = () => {
    if(wait === true) {
      return (
        <LinearProgress />
      )
    }
  }

  return (
    <Container>
      <Typography>AI JOB FINDER v1.0</Typography>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap"}}>
            { renderSites() }
          </div>
        </Grid>
        <Grid xs={6}>
          <Typography>Your CV</Typography>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={20}
            maxRows={20}
            placeholder="Paste your CV here"
            onChange={(e) => setCv(e.target.value)}
            value={cv}
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid xs={6}>
          <Typography>Job Description</Typography>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={20}
            maxRows={20}
            placeholder="Paste the job description here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid xs={12}>
          { loadingBar() }
          <Button variant="contained"
            fullWidth
            onClick={sendCV}
            disabled={wait}
          >Submit</Button>
        </Grid>
        <Grid xs={6}>
          <Typography>Your altered resume</Typography>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={20}
            maxRows={20}
            placeholder="Your altered CV should appear here"
            onChange={(e) => setAltCv(e.target.value)}
            value={altCv}
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid xs={6}>
          <Typography>Your cover letter</Typography>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={20}
            maxRows={20}
            placeholder="Your new cover letter should appear here"
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid xs={12}>
          <Typography>Suitable HR email</Typography>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            placeholder="Relevant email here"
            style={{ width: "100%" }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;