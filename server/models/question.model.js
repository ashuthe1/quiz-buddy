const mongoose = require("mongoose");

const { Schema } = mongoose;

const questionSchema = Schema(
  {
    questionBody: {
      type: String,
      required: [true, "Question body is required."],
    },
    options: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Option",
    },
    correctOption: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Option",
    },
  },
  // eslint-disable-next-line comma-dangle
  { timestamps: true }
);

const Question = mongoose.Model("Question", questionSchema);
module.exports = Question;
