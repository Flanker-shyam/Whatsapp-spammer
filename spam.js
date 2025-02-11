const puppeteer = require("puppeteer");
const readline = require("readline");
const { setTimeout } = require("timers/promises");

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const initConnection = async (url) => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: url, // Connect to the browser via WebSocket endpoint
    defaultViewport: null, // Optional: Ensure full screen if needed
    headless: true, // Ensure the browser runs headlessly in the background
  });

  const pages = await browser.pages();
  const page = pages[0];
  //   await page.goto("http://localhost:9222/json", {
  //     waitUntil: "domcontentloaded",
  //   });

  return page;
};

const extractUrlFromJson = (textBody) => {
  for (let i = 0; i < textBody.length; i++) {
    if (textBody[i].title === "WhatsApp") {
      return textBody[i].url; // Corrected this line, `textBody[i].url` instead of `textBody.url`
    }
  }
  return null;
};

const getWhatsappUrl = async (page) => {
  const jsonData = await page.evaluate(() => {
    const preElement = document.querySelector("pre");
    if (preElement) {
      return JSON.parse(preElement.textContent);
    } else {
      return null;
    }
  });

  if (jsonData) {
    const targetUrl = extractUrlFromJson(jsonData);
    return targetUrl;
  } else {
    console.log("No data found in JSON.");
    return null;
  }
};

const sendMessage = async (targetUrl, page, user, messages, count) => {
  await page.goto(targetUrl, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector('[aria-label="Search"]'); // Wait for the search box to load

  // Wait for the search box to appear and then interact with it
  const searchBox = await page.$('[aria-label="Search"]');
  if (!searchBox) {
    console.log("Search box not found!");
    return;
  }
  console.log("Search Box found, typing the user name...");

  await searchBox.type(user); // Type the user's name in the search box
  await page.keyboard.press("Enter"); // Press Enter to search for the user

  // Wait for the message input box to appear

  await page.waitForSelector('[aria-label="Type a message"]'); // Wait for the input box

  const inputBox = await page.$('[aria-label="Type a message"]');
  if (!inputBox) {
    console.log("Message input box not found!");
    return;
  }
  console.log("Input box found, typing the message...");

  for (let i = 0; i < count; i++) {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const message = `${randomMessage} 😂`;
    await inputBox.type(message); // Type the message in the input box
    await page.keyboard.press("Enter"); // Press Enter to send the message
  }

  console.log("Message sent successfully");
};

const main = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Please enter the URL: ", async (url) => {
    // Initialize the connection and get the page object
    const page = await initConnection(url);

    // Open WhatsApp URL from the page and extract the target URL
    // const targetUrl = await getWhatsappUrl(page);
    const targetUrl = "https://web.whatsapp.com/";

    if (targetUrl) {
      console.log("WhatsApp URL loaded successfully!", targetUrl);

      // Ask for the user input (name) and message in sequence
      rl.question("Please enter the name of the user: ", (user) => {
        rl.question("Please enter the message: ", (message) => {
          // Call the function to send the message
          const messages = [
            "Why don’t scientists trust atoms? Because they make up everything! 😂",
            "I told my computer I needed a break, and now it won’t stop sending me Kit-Kats! 🍫",
            "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾😆",
            "Parallel lines have so much in common. It’s a shame they’ll never meet. 😢",
            "Why don’t skeletons fight each other? They don’t have the guts. 💀",
            "I would tell you a joke about an elevator, but it’s an uplifting experience! 🚀",
            "Why did the math book look sad? Because it had too many problems. 📚",
            "I told my wife she was drawing her eyebrows too high. She looked surprised. 😲",
            "Why don’t some couples go to the gym? Because some relationships don’t work out. 💪",
            "I’m reading a book on anti-gravity. It’s impossible to put down! 📖",
            "Why did the bicycle fall over? Because it was two-tired! 🚲",
            "I told my dog a joke and he laughed his tail off! 🐶",
            "Why did the coffee file a police report? It got mugged! ☕",
            "I used to play piano by ear, but now I use my hands. 🎹",
            "Why did the tomato turn red? Because it saw the salad dressing! 🍅",
            "I would tell you a joke about a roof, but it’s over your head. 🏠",
            "Why don’t oysters donate to charity? Because they are shellfish. 🦪",
            "I told my friend 10 jokes to make him laugh. Sadly, no pun in ten did. 😂",
            "Why did the golfer bring two pairs of pants? In case he got a hole in one! ⛳",
          ];

          sendMessage(targetUrl, page, user, messages, 50);

          // Close the readline interface after sending the message
          rl.close();
        });
      });
    } else {
      console.log("Failed to load WhatsApp.");
      rl.close();
    }
  });
};

main();
