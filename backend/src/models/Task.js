import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: { type: String, ruquired: true },
    assignedTo: { type: String, required: true },
    deadline: { type: Date, requird: true },
    status: { type: String, enum: ['To Do', 'In Progress', 'Completed'], default: 'To Do' },
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);


    
