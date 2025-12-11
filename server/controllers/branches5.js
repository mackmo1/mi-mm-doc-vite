import Branches5 from "../models/Branches5.js";

const getBranches5 = async (req,res)=>{
    try {
        const branches5 = await Branches5.findAll();
        res.status(200).json(branches5);
    } catch (error) {
        res.status(404).json({message:`Failed to get branches5 !!! ${error}`});
    }
}

const getBranch5 = async (req,res)=>{
    try {
        const {id}=req.params;
        const [branch5] = await Branches5.findById(id);
        res.status(200).json(branch5);
    } catch (error) {
        res.status(404).json({message:`Failed to get branch5 !!! ${error}`});
    }
}

const createBranch5 = async (req,res)=>{
    try {
        const branch5 = req.body;
        const newBranch5 = new Branches5(branch5);
        await newBranch5.save();
        res.status(201).json(newBranch5);
    } catch (error) {
        res.status(404).json({message:`Failed to create new branch5 !!! ${error}`});
    }
}

const updateBranch5 = async (req,res)=>{
    try {
        const {id}=req.params;
        const branch5 = req.body;
        const updatedBranch5 = await Branches5.findByIdAndUpdate(id,branch5);
        res.status(201).json(updatedBranch5);
    } catch (error) {
        res.status(404).json({message:`Failed to update branch5 !!! ${error}`});
    }
}

const deleteBranch5 = async (req,res)=>{
    try {
        const {id}=req.params;
        await Branches5.findByIdAndDelete(id);
        res.status(200).json(id);
    } catch (error) {
        res.status(500).json({message:`Failed to delete branch5 !!! ${error}`});
    }
}

export default {getBranch5,getBranches5,createBranch5,deleteBranch5,updateBranch5};