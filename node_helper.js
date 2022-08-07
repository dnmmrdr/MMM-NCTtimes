//Dependencies
const axios = require("axios");
const cheerio = require("cheerio");
const NodeHelper = require("node_helper");
const Log = require("logger");

module.exports = NodeHelper.create({
socketNotificationReceived: async function(notification, payload) {
  //Function that scrapes the site
  var thisnode = this;
  //Needed so the node_helper will send to only one instance of the module
  if (notification === "GET_TIMES") {
    //If the Get times notification is received start scraping the site for times in an interval
  	setInterval(async function() {
  try {
    const url = "https://www.nctx.co.uk/stops/" + payload.stop //Get the required stop 
    const { data } = await axios.get(url); //Get the source for the site
    const $ = cheerio.load(data); //Load the source into cheerio
    const listItems = $(".single-visit"); //Look for the class for single visit, all the data needed is within here
    const buses = [];
    listItems.each((idx, el) => {
      const Bus = { Number: "", Name: "", Due: "" };
      const content = $(el).children(".single-visit__content") //Gets the required childern needed for the time, bus number, and bust desination
      const duetime = $(el).children(".single-visit__time")
      Bus.Number = $(content).children(".single-visit__name").text();
      Bus.Name = $(content).children(".single-visit__description").text();
      Bus.Due = $(duetime).children(".single-visit__time").text();
      buses.push(Bus); //Load this data into a JSON object
    }
    )
    thisnode.sendSocketNotification("TIMES", {buses, id: payload.id}); //Send the times back to the module
  }
  catch (error){
    thisnode.sendSocketNotification("ERROR", {error: "There was an error scraping the data from NCT", id: payload.id}); //If we get an error send it to the module
  }
}, (payload.refresh) * 1000); 
}
  else if (notification === "GET_HEADER") {
  //This runs once to get the header name for the stop
    try {
      const url = "https://www.nctx.co.uk/stops/" + payload.stop
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const header = $(".place-info-banner__name").text(); //Get the header name
      var arr = header.toString().split("\n"); //Unfortunatly it's not in an easy class to scrape, turn the data into an array using line return as a split
      var slice = arr.slice(1); //Slice the array
      var slice2 = slice[0] //Slice it again
      var string = slice2.replace(/^ +/g, ""); //The head has leading white space, use regex to remove that 
      thisnode.sendSocketNotification("HEADER", {header: string, id: payload.id}); //Send it back to the main module
      }
    catch (error){
      thisnode.sendSocketNotification("ERROR", {error: "There was an error scraping the data from NCT", id: payload.id}); //If there is an error send it to the main module
    }
  }
  }
});