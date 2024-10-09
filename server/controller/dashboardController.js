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
          updatedAt: -1,
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
      layout: "layouts/dashboard.ejs",
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
  }
};

// View Note

exports.dashboardViewNote = async (req, res) => {
  const note = await Note.findById({ _id: req.params.id })
    .where({
      user: req.user.id,
    })
    .lean();

  if (note) {
    res.render("dashboard/view-notes", {
      noteId: req.params.id,
      note,
      layout: "layouts/dashboard",
    });
  } else {
    res.send("Something went wrong");
  }
};

// Update Note

exports.dashboardUpdateNote = async (req, res) => {
  try {
    await Note.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now()
      }
    ).where({ user: req.user.id });

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

// Delete note

exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.deleteOne({
      _id: req.params.id,
    }).where({ user: req.user.id });

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

// Add note page

exports.dashboardAddNote = async (req, res) => {
  res.render("dashboard/add", {
    layout: "layouts/dashboard",
  });
};

// Add note submit

exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

// Search note GET

exports.dashboardSearch = async (req, res) => {
  try {
    res.render("dashboard/search", {
      searchResults: "",
      layout: "layouts/dashboard",
    });
  } catch (error) {}
};

// Search note GET

exports.dashboardSearchSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, " ");

    const searchResults = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    }).where({ user: req.user.id });

    res.render("dashboard/search", {
      searchResults,
      layout: "layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};
