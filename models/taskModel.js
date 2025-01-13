const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    taskName: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: String,
      required: false
    },
  }, { timestamps: true });

  module.exports = mongoose.model("task", TaskSchema);
