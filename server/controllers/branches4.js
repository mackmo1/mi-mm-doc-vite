import Branches4 from "../models/Branches4.js";

const getBranches4 = async (req,res)=>{
    try {
        const branches4 = await Branches4.findAll();
        res.status(200).json(branches4);
    } catch (error) {
        res.status(404).json({message:`Failed to get branches4 !!! ${error}`});
    }
}

const getBranch4 = async (req,res)=>{
    try {
        const {id}=req.params;
        const [branch4] = await Branches4.findById(id);
        res.status(200).json(branch4);
    } catch (error) {
        res.status(404).json({message:`Failed to get branch4 !!! ${error}`});
    }
}

const createBranch4 = async (req,res)=>{
    try {
        const branch4 = req.body;
        const newBranch4 = new Branches4(branch4);
        await newBranch4.save();
        res.status(201).json(newBranch4);
    } catch (error) {
        res.status(404).json({message:`Failed to create new branch4 !!! ${error}`});
    }
}

const updateBranch4 = async (req,res)=>{
    try {
        const {id}=req.params;
        const branch4 = req.body;
        const updatedBranch4 = await Branches4.findByIdAndUpdate(id,branch4);
        res.status(201).json(updatedBranch4);
    } catch (error) {
        res.status(404).json({message:`Failed to update branch4 !!! ${error}`});
    }
}

const deleteBranch4 = async (req,res)=>{
    try {
        const {id}=req.params;
        await Branches4.findByIdAndDelete(id);
        res.status(200).json(id);
    } catch (error) {
        res.status(500).json({message:`Failed to delete branch4 !!! ${error}`});
    }
}

export default {getBranch4,getBranches4,createBranch4,deleteBranch4,updateBranch4};