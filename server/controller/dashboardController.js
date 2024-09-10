const Note = require("../models/Note");
const mongoose = require("mongoose");

// GET dashboard

exports.dashboard = async (req, res) => {
  let perPage = 12;
  let page = req.query.page || 1;

  const locals = {
    title: "Dashboard",
    description: "Free NodeJS Notes App",
  };

  try {
    const notes = await Note.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Note.countDocuments();

    res.render("dashboard/dashboard", {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard.ejs",
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
  }
};
