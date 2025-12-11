import Branches3 from "../models/Branches3.js";

const getBranches3 = async (req,res)=>{
    try {
        const branches3 = await Branches3.findAll();
        res.status(200).json(branches3);
    } catch (error) {
        res.status(404).json({message:`Failed to get branches3 !!! ${error}`});
    }
}

const getBranch3 = async (req,res)=>{
    try {
        const {id}=req.params;
        const [branch3] = await Branches3.findById(id);
        res.status(200).json(branch3);
    } catch (error) {
        res.status(404).json({message:`Failed to get branch3 !!! ${error}`});
    }
}

const createBranch3 = async (req,res)=>{
    try {
        const branch3 = req.body;
        const newBranch3 = new Branches3(branch3);
        await newBranch3.save();
        res.status(201).json(newBranch3);
    } catch (error) {
        res.status(404).json({message:`Failed to create new branch3 !!! ${error}`});
    }
}

const updateBranch3 = async (req,res)=>{
    try {
        const {id}=req.params;
        const branch3 = req.body;
        const updatedBranch3 = await Branches3.findByIdAndUpdate(id,branch3);
        res.status(201).json(updatedBranch3);
    } catch (error) {
        res.status(404).json({message:`Failed to update branch3 !!! ${error}`});
    }
}

const deleteBranch3 = async (req,res)=>{
    try {
        const {id}=req.params;
        await Branches3.findByIdAndDelete(id);
        res.status(200).json(id);
    } catch (error) {
        res.status(500).json({message:`Failed to delete branch3 !!! ${error}`});
    }
}

export default {getBranch3,getBranches3,createBranch3,deleteBranch3,updateBranch3};