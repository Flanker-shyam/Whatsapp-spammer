const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function getMemeImage() {
  try {
    const response = await axios.get('https://meme-api.com/gimme');
    const memeUrl = response.data.url;  // Meme URL received from API

    console.log(memeUrl)

    // Download the image
    const memeImageResponse = await axios.get(memeUrl, { responseType: 'arraybuffer' });
    console.log(memeImageResponse.data)
    const filePath = path.resolve(__dirname, 'random_meme.jpg');
    
    // Save the image locally
    fs.writeFileSync(filePath, memeImageResponse.data);
    console.log('Meme image saved to', filePath);
  } catch (error) {
    console.error('Error fetching meme image:', error);
  }
}

getMemeImage();
