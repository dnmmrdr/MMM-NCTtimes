//Dependencies
const axios = require("axios");
const cheerio = require("cheerio");
const NodeHelper = require("node_helper");

// URL of the page we want to scrape


module.exports = NodeHelper.create({
socketNotificationReceived: async function scrapeData(notification, payload) {
  if (notification === "config") {
  try {
    const url = "https://www.nctx.co.uk/stops/" + payload
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in single visit class
    const listItems = $(".single-visit");
    // Stores data for all buses at the stop
    const buses = [];
    listItems.each((idx, el) => {
      const Bus = { Number: "", Name: "", Due: ""};
      const content = $(el).children(".single-visit__content")
      const duetime = $(el).children(".single-visit__time")
      Bus.Number = $(content).children(".single-visit__name").text();
      Bus.Name = $(content).children(".single-visit__description").text();
      Bus.Due = $(duetime).children(".single-visit__time").text();
      buses.push(Bus);
    }
    )
    this.sendSocketNotification("bus-times", buses);
  }
  catch (error){
    console.error(error)
  }
}
  }
});