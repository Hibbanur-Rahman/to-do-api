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
    description:{
      type:String,
      required:false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: String,
      required: false
    },
    priority:{
      type:String,
      required:false
    },
    startDate:{
      type:Date,
      required:false,
    },
    endDate:{
      type:Date,
      required:false,
    }
  }, { timestamps: true });

  module.exports = mongoose.model("task", TaskSchema);
