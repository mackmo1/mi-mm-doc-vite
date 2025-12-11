import Branches1 from "../models/Branches1.js";

const getBranches1 = async (req,res)=>{
    try {
        const branches1 = await Branches1.findAll();
        res.status(200).json(branches1);
    } catch (error) {
        res.status(404).json({message:`Failed to get Branches1 !!! ${error}`});
    }
}

const getBranch1 = async (req,res)=>{
    try {
        const {id} = req.params;
        const [branch1] = await Branches1.findById(id);
        res.status(200).json(branch1);
    } catch (error) {
        res.status(404).json({message:`Failed to finds this branch1 !!! ${error}`});
    }
}

const createBranch1 = async (req,res)=>{
    try {
        const branch1 = req.body;
        const newBranch1 = new Branches1(branch1);
        await newBranch1.save();
        res.status(201).json(newBranch1);
    } catch (error) {
        res.status(404).json({message:`Failed to create new branch1 !!! ${error}`});
    }
}

const updateBranch1 = async (req,res)=>{
    try {
        const {id} = req.params;
        const branch1 = req.body;
        const updatedBranch1 = await Branches1.findByIdAndUpdate(id,branch1);
        res.status(201).json(updatedBranch1);
    } catch (error) {
        res.status(404).json({message:`Failed to update this branch1 !!! ${error}`});
    }
}

const deleteBranch1 = async (req,res)=>{
    try {
        const {id} = req.params;
        await Branches1.findByIdAndDelete(id);
        res.status(200).json(id);
    } catch (error) {
        res.status(500).json({message:`Failed to delete this branch1 !!! ${error}`})
    }
}

export default {getBranches1,getBranch1,createBranch1,updateBranch1,deleteBranch1};