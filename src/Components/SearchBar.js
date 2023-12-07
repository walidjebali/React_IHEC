import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';

// Import the necessary functions from './req'
import { summarizeData, roast } from './req';

function SearchBar() {
  const [url, setUrl] = React.useState("");
  const [language, setLanguage] = React.useState("");
  const [canSendData, setCanSendData] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [response, setResponse] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Assuming this is your original handleSummarize function on the front end
const handleSummarize = async () => {
  setIsLoading(true);
  setIsSubmitting(true);
  handleSnackbarOpen(); // Open the Snackbar
  const data = { language: language, url: url };

  try {
    const response = await fetch('http://localhost:3000/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();

    // Assuming the response structure is { result: 'summary text' }
    setResponse(result.result);
    setIsLoading(false);
    setSnackbarOpen(false); // Close the Snackbar when the response appears
    setIsSubmitting(false);
  } catch (error) {
    console.error('Error:', error);
    setIsLoading(false);
    setSnackbarOpen(false); // Close the Snackbar on error
    setIsSubmitting(false);
  }
};


  const handleRoast =async () => {
    setIsLoading(true);
    setIsSubmitting(true);
    handleSnackbarOpen(); // Open the Snackbar
    const data = { language: language, url: url };
    const result = await roast(data);
    setResponse(result.data.message.content);
    setIsLoading(false);
    setSnackbarOpen(false); // Close the Snackbar when the response appears
    setIsSubmitting(false);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const validateURL = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/;
    if (urlPattern.test(url)) {
      setCanSendData(true);
      setErrorMessage("");
      setUrl(url);
    } else {
      setErrorMessage("Please enter a valid URL");
      setCanSendData(false);
    }
  };

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <FormControl error variant="standard">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'align',
          }}
        >
          <TextField
            error={errorMessage.length > 0}
            onChange={(event) => {
              validateURL(event.target.value);
            
            }}
            id="outlined-basic"
            label="Enter Website URL"
            variant="outlined"
            sx={{
              outlineColor: '#002B40',
              width: '100vh',
              marginRight :2


            }}
          ></TextField>

          <FormControl style={{ width: '30%' }}>
            <InputLabel>Language</InputLabel>
            <Select value={language} label="langue" onChange={handleLanguageChange}>
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value={'fr'}>French</MenuItem>
              <MenuItem value={'en'}>English</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <FormHelperText id="component-error-text">{errorMessage}</FormHelperText>
      </FormControl>

      <Stack spacing={2} direction="row" sx={{ marginTop: 2, marginBottom : 5 }}>
        <Button variant="contained" disabled={!canSendData || isSubmitting} onClick={handleSummarize}>
          Summarize
        </Button>
        <Button variant="outlined" disabled={!canSendData || isSubmitting} onClick={handleRoast}>
          Roast
        </Button>
      </Stack>

      {isLoading ? (
        <Box sx={{  }}>
          <Skeleton animation="wave"  width={1000} height={20} sx={{margin : 1}}/>
          <Skeleton animation="wave"  width={1000} height={20} sx={{margin : 1}}/>
          <Skeleton animation="wave"  width={1000} height={20} sx={{margin : 1}}/>
          <Skeleton animation="wave"  width={1000} height={20} sx={{margin : 1}}/>
        </Box>
      ) : response ? (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          marginLeft :40,
          marginRight :40
        }}>{response}</Box>
      ) : null}

      <Snackbar
        open={snackbarOpen}
        message="Fetching data..."
        autoHideDuration={4000} // Adjust the duration as needed
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Set anchor origin to top-center

      />
    </Box>
  );
}

export default SearchBar;
