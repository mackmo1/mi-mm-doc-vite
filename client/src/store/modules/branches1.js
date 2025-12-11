import axios from "axios";
import store from "..";

const API = axios.create({baseURL:"http://localhost:5000/api/branches1"});

const state={
    branches1:[],
}

const getters = {
    branches1: (state) => state.branches1
};

const actions={
    // Get Mainlist
    async getBranches1({commit}){
        const data = await API.get('/')
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit("getBranches1",data);
    },
    // Get a specific branch
    async getBranch1({commit},id){
        const data = await API.get(`/${id}`)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('getBranch1',data);
    },
    // Add new main branch
    async addBranch1({commit},branch){
        const data = await API.post('/',branch)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('addBranch1',data);
    },
    // Update main branch   
    async updateBranch1({commit},branch){
        const data = await API.patch(`/${branch.id}`,branch)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('updateBranch1',data);
    },
    // Delete main branch
    async deleteBranch1({commit},id){
        const data = await API.delete(`/${id}`)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('deleteBranch1',data);
    }
}

const mutations = {
    // Get all list branches number 1
    getBranches1:(state,data)=>{
        state.branches1=data
    },
    // Get a specific branch 
    getBranch1:(state,data)=>{
        if (typeof $ !== 'undefined' && $('.form-control').length) {
            $('.form-control').trumbowyg('html',data.content);
        }
        store.state.oldBranch=data;
        store.state.isUpdate=true;
        store.state.branchType="branch1";
    },
    // Add new branch
    addBranch1:(state,data)=>{
        state.branches1.push(data);
    },
    // Update branch 
    updateBranch1:(state,data)=>{
        state.branches1 = state.branches1.map((branch)=>{
            return branch.id===data.id ? data : branch;
        });
        store.state.isUpdate=false;
    },
    // Delete branch
    deleteBranch1:(state,data)=>{
        state.branches1 = state.branches1.filter((branch)=>{
            return branch.id !== data.id;
        });
    },
    // Update branch show state
    updateBranchShow:(state, {id, isShow}) => {
        state.branches1 = state.branches1.map(branch => 
            branch.id === id ? { ...branch, isShow: isShow !== null ? isShow : !branch.isShow } : branch
        );
    },
    // Reset all isAdd flags
    resetAllIsAdd:(state) => {
        state.branches1 = state.branches1.map(branch => ({ ...branch, isAdd: false }));
    },
    // Set isAdd flag for specific branch
    setIsAdd:(state, id) => {
        state.branches1 = state.branches1.map(branch => 
            branch.id === id ? { ...branch, isAdd: true } : branch
        );
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
