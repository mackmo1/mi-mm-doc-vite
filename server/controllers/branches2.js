import Branches2 from "../models/Branches2.js";

const getBranches2 = async (req,res)=>{
    try {
        const branches2 = await Branches2.findAll();
        res.status(200).json(branches2);
    } catch (error) {
        res.status(404).json({message:`Failed to get branches2 !!! ${error}`});
    }
}

const getBranch2 = async (req,res)=>{
    try {
        const {id}=req.params;
        const [branch2] = await Branches2.findById(id);
        res.status(200).json(branch2);
    } catch (error) {
        res.status(404).json({message:`Failed to get branch2 !!! ${error}`});
    }
}

const createBranch2 = async (req,res)=>{
    try {
        const branch2 = req.body;
        const newBranch2 = new Branches2(branch2);
        await newBranch2.save();
        res.status(201).json(newBranch2);
    } catch (error) {
        res.status(404).json({message:`Failed to create new branch2 !!! ${error}`});
    }
}

const updateBranch2 = async (req,res)=>{
    try {
        const {id}=req.params;
        const branch2 = req.body;
        const updatedBranch2 = await Branches2.findByIdAndUpdate(id,branch2);
        res.status(201).json(updatedBranch2);
    } catch (error) {
        res.status(404).json({message:`Failed to update branch2 !!! ${error}`});
    }
}

const deleteBranch2 = async (req,res)=>{
    try {
        const {id}=req.params;
        await Branches2.findByIdAndDelete(id);
        res.status(200).json(id);
    } catch (error) {
        res.status(500).json({message:`Failed to delete branch2 !!! ${error}`});
    }
}

export default {getBranch2,getBranches2,createBranch2,deleteBranch2,updateBranch2};