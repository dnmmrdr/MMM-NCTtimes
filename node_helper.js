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
    //const header = $(".place-info-banner__name").text();
    const buses = [];
    listItems.each((idx, el) => {
      const Bus = { Number: "", Name: "", Due: "" };
      const content = $(el).children(".single-visit__content")
      const duetime = $(el).children(".single-visit__time")
      //var arr = header.toString().split("\n");
      //var slice = arr.slice(1);
      //var slice2 = slice[0]
      //var string = slice2.replace(/^ +/g, "");
      //Bus.Header = string;
      Bus.Number = $(content).children(".single-visit__name").text();
      Bus.Name = $(content).children(".single-visit__description").text();
      Bus.Due = $(duetime).children(".single-visit__time").text();
      buses.push(Bus);
    }
    )
    console.log(buses);
    this.sendSocketNotification("bus-times", buses);
  }
  catch (error){
    this.sendSocketNotification("error", "There was an error scraping the data from NCT")
  }
}
  }
});