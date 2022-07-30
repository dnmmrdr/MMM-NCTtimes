//Dependencies
const axios = require("axios");
const cheerio = require("cheerio");
const NodeHelper = require("node_helper");


module.exports = NodeHelper.create({
socketNotificationReceived: async function(notification, payload) {
  if (notification === "config") {
  try {
    const url = "https://www.nctx.co.uk/stops/" + payload
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const listItems = $(".single-visit");
    const header = $(".place-info-banner__name").text();
    const buses = [];
    listItems.each((idx, el) => {
      const Bus = { Number: "", Name: "", Due: "" };
      const content = $(el).children(".single-visit__content")
      const duetime = $(el).children(".single-visit__time")
      Bus.Number = $(content).children(".single-visit__name").text();
      Bus.Name = $(content).children(".single-visit__description").text();
      Bus.Due = $(duetime).children(".single-visit__time").text();
      buses.push(Bus);
    }
    )
    var arr = header.toString().split("\n");
    var slice = arr.slice(1);
    var slice2 = slice[0]
    var string = slice2.replace(/^ +/g, "");
    console.log(payload)
    this.sendSocketNotification(payload + "_HEADER", string);
    console.log(buses)
    console.log(string)
    this.sendSocketNotification(payload + "_BUSES", buses);
  }
  catch (error){
    this.sendSocketNotification(payload + "_ERROR", "There was an error scraping the data from NCT")
  }
}
  }
});