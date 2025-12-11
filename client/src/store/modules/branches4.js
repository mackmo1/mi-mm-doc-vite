import axios from "axios";
import store from "..";

const API = axios.create({baseURL:"http://localhost:5000/api/branches4"});

const state = {
    branches4:[],
}

const getters = {
    branches4:(state)=>state.branches4,
}

const actions = {
    // Get branches list number 4
    async getBranches4({commit}){
        const data = await API.get('/')
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('getBranches4',data);
    },
    // Get a specific branch
    async getBranch4({commit},id){
        const data = await API.get(`/${id}`)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('getBranch4',data);
    },
    // Add new branch
    async addBranch4({commit},branch){
        const data = await API.post('/',branch)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('addBranch4',data);
    },
    // Update branch   
    async updateBranch4({commit},branch){
        const data = await API.patch(`/${branch.id}`,branch)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('updateBranch4',data);
    },
    // Delete branch
    async deleteBranch4({commit},id){
        const data = await API.delete(`/${id}`)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('deleteBranch4',data);
    }
}

const mutations = {
    // Get all list branches number 4
    getBranches4:(state,data)=>{
        state.branches4=data
    },
    // Get a specific branch 
    getBranch4:(state,data)=>{
        if (typeof $ !== 'undefined' && $('.form-control').length) {
            $('.form-control').trumbowyg('html',data.content);
        }
        store.state.oldBranch=data;
        store.state.isUpdate=true;
        store.state.branchType="branch4";
    },
    // Add new branch
    addBranch4:(state,data)=>{
        state.branches4.push(data);
    },
    // Update branch 
    updateBranch4:(state,data)=>{
        state.branches4 = state.branches4.map((branch)=>{
            return branch.id===data.id ? data : branch;
        });
        store.state.isUpdate=false;
    },
    // Delete branch
    deleteBranch4:(state,data)=>{
        state.branches4 = state.branches4.filter((branch)=>{
            return branch.id !== data.id;
        });
    },
    // Update branch show state
    updateBranchShow:(state, {id, isShow}) => {
        state.branches4 = state.branches4.map(branch => 
            branch.id === id ? { ...branch, isShow: isShow !== null ? isShow : !branch.isShow } : branch
        );
    },
    // Reset all isAdd flags
    resetAllIsAdd:(state) => {
        state.branches4 = state.branches4.map(branch => ({ ...branch, isAdd: false }));
    },
    // Set isAdd flag for specific branch
    setIsAdd:(state, id) => {
        state.branches4 = state.branches4.map(branch => 
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
