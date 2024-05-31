const QueryResponse = require("../models/queryResponse");
const contactDetail = require("../models/contact");

const creatingQueryResponse = async (req, res) => {
  try {
    const { query, response } = req.body;
    const newQueryResponse = new QueryResponse({
      query,
      response
    })
    await newQueryResponse.save();
    res.status(201).json({
      message: "Query response created successfully",
      data: newQueryResponse
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
}

const gettingQueryResponses = async (req, res) => {
  try {
    const { query: userInput, dbquery: dbInput } = req.body;

    if (!userInput && !dbInput) {
      return res.status(400).json({ error: "Please provide a query" });
    }

    // Check if the userInput contains keywords related to date
    const dateKeywords = ["today", "date", "current date", "today's date"];
    const containsDateKeyword = userInput && dateKeywords.some(keyword =>
      new RegExp(keyword, 'i').test(userInput)
    );

    if (containsDateKeyword) {
      const today = new Date();
      return res.status(200).json({ response: today.toDateString() });
    }

    let queryResponse = null;

    if (userInput) {
      const regex = new RegExp(userInput, 'i'); // 'i' makes the search case-insensitive
      queryResponse = await QueryResponse.findOne({ query: { $elemMatch: { $regex: regex } } });
    }

    if (!queryResponse && dbInput) {
      queryResponse = await QueryResponse.findOne({ query: { $in: dbInput } });
    }

    if (queryResponse) {
      return res.status(200).json({ response: queryResponse.response });
    } else {
      return res.status(200).json({
        response: "I'm sorry, but I don't understand what you're asking. Could you please contact the P.P.T Travels & Tours for more information? Hotline : 011-236-4999, Email : info@ppttravel.com, Website : www.ppttravel.com."
      });
    }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const gettingSuggestionQueryResponse = async (req, res) => {
  try {
    const { queryString } = req.body;

    if (!queryString) {
      res.status(200).json([]);
      return;
    }

    const regex = new RegExp(queryString, 'i'); // 'i' makes the search case-insensitive

    const results = await QueryResponse.aggregate([
      { $match: { query: { $elemMatch: { $regex: regex } } } },
      { $unwind: "$query" },
      { $match: { query: { $regex: regex } } },
      {
        $group: {
          _id: null,
          allQueries: { $push: "$query" }
        }
      },
      {
        $project: {
          _id: 0,
          allQueries: 1
        }
      }
    ]);

    res.status(200).json(results.length > 0 ? results[0].allQueries : []);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

/* contact detail posting */
const contactMessage = async (req, res) => {
  console.log(req.body);
  try {
    const newContactMessage = new contactDetail({
      ...req.body,
    });
    await newContactMessage.save();
    console.log(newContactMessage);
    return res.status(201).json(newContactMessage);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

const getAllContactMessages = async (req, res) => {
  try {
    const allContactMessages = await contactDetail.find();
    console.log(allContactMessages);
    return res.status(200).json(allContactMessages);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


module.exports = {
  creatingQueryResponse,
  gettingQueryResponses,
  gettingSuggestionQueryResponse,
  contactMessage,
  getAllContactMessages
}