const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const testDelay = async () => {
  for (let i = 0; i < 5; i++) {
    console.log("Before 1 delay");
    await delay(1000); // Wait for 1 second
    console.log("After 1 delay");
    console.log("Before 2 delay");
    await delay(1000); // Wait for 1 second
    console.log("After 2 delay");
    console.log("Before 3 delay");
    await delay(1000); // Wait for 1 second
    console.log("After 3 delay");
    console.log("Before 4 delay");
    await delay(1000); // Wait for 1 second
    console.log("After 4 delay");
  }
};

testDelay();