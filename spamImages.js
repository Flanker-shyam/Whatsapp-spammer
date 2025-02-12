const puppeteer = require("puppeteer");
const readline = require("readline");
const { setTimeout } = require("timers/promises");
const { MetaPrompt } = require("./jokes");
const { timeout } = require("puppeteer");
const fs = require('fs')

const initConnection = async (url) => {
  console.log("creating connection!");
  const browser = await puppeteer.connect({
    browserWSEndpoint: url, // Connect to the browser via WebSocket endpoint
    defaultViewport: null, // Optional: Ensure full screen if needed
    headless: true, // Ensure the browser runs headlessly in the background
  });

  const pages = await browser.pages();
  const page = pages[0];
  console.log("returning ---");
  return page;
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
    const message = `${randomMessage}`;
    console.log("Messa: ", message);
    try {
      await inputBox.type("@meta", { timeout: 1000 });
      await page.keyboard.press("Enter", { timeout: 10000 }); // Press Enter to send the message
      await inputBox.type(message, { timeout: 10000 }); // Type the message in the input box
      await page.keyboard.press("Enter", { timeout: 10000 }); // Press Enter to send the message
      await setTimeout(1000);
    } catch (err) {
      throw err;
    }
  }

  console.log("Messages sent successfully");
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
        // Call the function to send the message
        const messages = MetaPrompt;
        console.log("here:", messages);

        sendMessage(targetUrl, page, user, messages, 50);

        // Close the readline interface after sending the message
        rl.close();
      });
    } else {
      console.log("Failed to load WhatsApp.");
      rl.close();
    }
  });
};

main();
