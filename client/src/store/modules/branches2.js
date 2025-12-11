import axios from "axios";
import store from "..";

const API = axios.create({baseURL:"http://localhost:5000/api/branches2"});

const state = {
    branches2:[],
}

const getters = {
    branches2:(state)=>state.branches2,
}

const actions = {
    // Get branches list number 2
    async getBranches2({commit}){
        const data = await API.get('/')
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('getBranches2',data);
    },
    // Get a specific branch
    async getBranch2({commit},id){
        const data = await API.get(`/${id}`)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('getBranch2',data);
    },
    // Add new branch
    async addBranch2({commit},branch){
        const data = await API.post('/',branch)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('addBranch2',data);
    },
    // Update branch   
    async updateBranch2({commit},branch){
        const data = await API.patch(`/${branch.id}`,branch)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('updateBranch2',data);
    },
    // Delete branch
    async deleteBranch2({commit},id){
        const data = await API.delete(`/${id}`)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('deleteBranch2',data);
    }
}

const mutations = {
    // Get all list branches number 2
    getBranches2:(state,data)=>{
        state.branches2=data
    },
    // Get a specific branch 
    getBranch2:(state,data)=>{
        if (typeof $ !== 'undefined' && $('.form-control').length) {
            $('.form-control').trumbowyg('html',data.content);
        }
        store.state.oldBranch=data;
        store.state.isUpdate=true;
        store.state.branchType="branch2";
    },
    // Add new branch
    addBranch2:(state,data)=>{
        state.branches2.push(data);
    },
    // Update branch 
    updateBranch2:(state,data)=>{
        state.branches2 = state.branches2.map((branch)=>{
            return branch.id===data.id ? data : branch;
        });
        store.state.isUpdate=false;
    },
    // Delete branch
    deleteBranch2:(state,data)=>{
        state.branches2 = state.branches2.filter((branch)=>{
            return branch.id !== data.id;
        });
    },
    // Update branch show state
    updateBranchShow:(state, {id, isShow}) => {
        state.branches2 = state.branches2.map(branch => 
            branch.id === id ? { ...branch, isShow: isShow !== null ? isShow : !branch.isShow } : branch
        );
    },
    // Reset all isAdd flags
    resetAllIsAdd:(state) => {
        state.branches2 = state.branches2.map(branch => ({ ...branch, isAdd: false }));
    },
    // Set isAdd flag for specific branch
    setIsAdd:(state, id) => {
        state.branches2 = state.branches2.map(branch => 
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
