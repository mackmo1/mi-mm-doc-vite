import axios from "axios";
import store from "..";

const API = axios.create({baseURL:"http://localhost:5000/api/branches3"});

const state = {
    branches3:[],
}

const getters = {
    branches3:(state)=>state.branches3,
}

const actions = {
    // Get branches list number 3
    async getBranches3({commit}){
        const data = await API.get('/')
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('getBranches3',data);
    },
    // Get a specific branch
    async getBranch3({commit},id){
        const data = await API.get(`/${id}`)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('getBranch3',data);
    },
    // Add new branch
    async addBranch3({commit},branch){
        const data = await API.post('/',branch)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('addBranch3',data);
    },
    // Update branch   
    async updateBranch3({commit},branch){
        const data = await API.patch(`/${branch.id}`,branch)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('updateBranch3',data);
    },
    // Delete branch
    async deleteBranch3({commit},id){
        const data = await API.delete(`/${id}`)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('deleteBranch3',data);
    }
}

const mutations = {
    // Get all list branches number 3
    getBranches3:(state,data)=>{
        state.branches3=data
    },
    // Get a specific branch 
    getBranch3:(state,data)=>{
        if (typeof $ !== 'undefined' && $('.form-control').length) {
            $('.form-control').trumbowyg('html',data.content);
        }
        store.state.oldBranch=data;
        store.state.isUpdate=true;
        store.state.branchType="branch3";
    },
    // Add new branch
    addBranch3:(state,data)=>{
        state.branches3.push(data);
    },
    // Update branch 
    updateBranch3:(state,data)=>{
        state.branches3 = state.branches3.map((branch)=>{
            return branch.id===data.id ? data : branch;
        });
        store.state.isUpdate=false;
    },
    // Delete branch
    deleteBranch3:(state,data)=>{
        state.branches3 = state.branches3.filter((branch)=>{
            return branch.id !== data.id;
        });
    },
    // Update branch show state
    updateBranchShow:(state, {id, isShow}) => {
        state.branches3 = state.branches3.map(branch => 
            branch.id === id ? { ...branch, isShow: isShow !== null ? isShow : !branch.isShow } : branch
        );
    },
    // Reset all isAdd flags
    resetAllIsAdd:(state) => {
        state.branches3 = state.branches3.map(branch => ({ ...branch, isAdd: false }));
    },
    // Set isAdd flag for specific branch
    setIsAdd:(state, id) => {
        state.branches3 = state.branches3.map(branch => 
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
