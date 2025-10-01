import mongoose from "mongoose";


const projectSchema = new mongoose.Schema({
    name: { type: String, required: true},
    manager: { type: String, required: true},
    deadline: { type: Date, required: true},
    status: { type: String, enum: ['In Progress', 'review', 'Completed'], default: 'In Progress' },
    progress: { type: Number, default: 0 },
},  { timestamps: true } );

export default mongoose.model('Project', projectSchema);
